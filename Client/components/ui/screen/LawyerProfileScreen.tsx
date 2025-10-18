import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { COLOR } from "@/constants/ColorPallet";
import { saveLawyerProfile, getLawyerProfile } from "../../../service/lawyerService";
import { useAuth } from "@/context/AuthContext";

export default function LawyerAdditionalDetails() {
  const { user } = useAuth();
  const lawyerId = user?.id;

  const [profile, setProfile] = useState({
    experience: 0,
    aboutMe: "",
    contactInfo: {
      email: "",
      phone: "",
      officeLocation: "",
      languages: [],
    },
    availability: {
      isAvailable: true,
      days: [],
      timeSlots: [],
    },
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!lawyerId) return;
      try {
        setIsLoading(true);
        const data = await getLawyerProfile(lawyerId);
        if (data) {
          setProfile({
            experience: data.experience || 0,
            aboutMe: data.aboutMe || "",
            contactInfo: {
              email: data.contactInfo?.email || "",
              phone: data.contactInfo?.phone || "",
              officeLocation: data.contactInfo?.officeLocation || "",
              languages: data.contactInfo?.languages || [],
            },
            availability: data.availability || {
              isAvailable: true,
              days: [],
              timeSlots: [],
            },
          });

          if (data.profilePicture) {
            setProfilePicture({
              uri: data.profilePicture,
              isExisting: true,
            });
          }
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [lawyerId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera roll permissions are needed!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setProfilePicture({ uri: asset.uri, isExisting: false });
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith("contactInfo.")) {
      const key = field.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  const toggleLanguage = (lang) => {
    setProfile((prev) => {
      const exists = prev.contactInfo.languages.includes(lang);
      const newLangs = exists
        ? prev.contactInfo.languages.filter((l) => l !== lang)
        : [...prev.contactInfo.languages, lang];
      return { ...prev, contactInfo: { ...prev.contactInfo, languages: newLangs } };
    });
  };

  const toggleAvailabilityDay = (day) => {
    setProfile((prev) => {
      const exists = prev.availability.days.includes(day);
      const newDays = exists
        ? prev.availability.days.filter((d) => d !== day)
        : [...prev.availability.days, day];
      return { ...prev, availability: { ...prev.availability, days: newDays } };
    });
  };

  const addTimeSlot = () => {
    setProfile((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: [...prev.availability.timeSlots, { start: "", end: "" }],
      },
    }));
  };

  const updateTimeSlot = (index, key, value) => {
    const updated = [...profile.availability.timeSlots];
    updated[index][key] = value;
    setProfile((prev) => ({
      ...prev,
      availability: { ...prev.availability, timeSlots: updated },
    }));
  };

  const handleSave = async () => {
    if (!profile.contactInfo.email || !profile.contactInfo.phone) {
      Alert.alert("Error", "Email and phone are required.");
      return;
    }

    if (!lawyerId) {
      Alert.alert("Error", "User not found.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("lawyerId", String(lawyerId));
      formData.append("experience", String(profile.experience));
      formData.append("aboutMe", profile.aboutMe);
      formData.append("contactInfo", JSON.stringify(profile.contactInfo));
      formData.append("availability", JSON.stringify(profile.availability));

      // ✅ Correct Expo Go-compatible image upload
      if (profilePicture && !profilePicture.isExisting) {
        formData.append("profilePicture", {
          uri: profilePicture.uri,
          name: `profile_${lawyerId}.jpg`,
          type: "image/jpeg",
        });
      }

      const result = await saveLawyerProfile(formData);
      Alert.alert("Success", "Profile saved successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const languageOptions = ["English", "Sinhala", "Tamil"];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLOR.light.primary} />
        </View>
      )}

      {/* Profile Picture */}
      <View style={styles.profileImageContainer}>
        {profilePicture?.uri ? (
          <Image source={{ uri: profilePicture.uri }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadText}>
            {profilePicture ? "Change Picture" : "Upload Picture"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Me */}
      <View style={styles.field}>
        <Text style={styles.label}>About Me</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about yourself"
          value={profile.aboutMe}
          onChangeText={(text) => handleChange("aboutMe", text)}
          multiline
        />
      </View>

      {/* Experience */}
      <View style={styles.field}>
        <Text style={styles.label}>Experience (Years)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(profile.experience)}
          onChangeText={(text) => handleChange("experience", Number(text) || 0)}
        />
      </View>

      {/* Availability */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>

        <TouchableOpacity
          style={[
            styles.availabilityToggle,
            profile.availability.isAvailable && styles.availabilityActive,
          ]}
          onPress={() =>
            setProfile((prev) => ({
              ...prev,
              availability: {
                ...prev.availability,
                isAvailable: !prev.availability.isAvailable,
              },
            }))
          }
        >
          <Text style={styles.availabilityText}>
            {profile.availability.isAvailable ? "Available" : "Not Available"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Available Days</Text>
        <View style={styles.languagesContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.languageButton,
                profile.availability.days.includes(day) && styles.languageSelected,
              ]}
              onPress={() => toggleAvailabilityDay(day)}
            >
              <Text
                style={[
                  styles.languageText,
                  profile.availability.days.includes(day) && styles.languageTextSelected,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Time Slots</Text>
        {profile.availability.timeSlots.map((slot, index) => (
          <View key={index} style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Start Time (e.g., 09:00 AM)"
              value={slot.start}
              onChangeText={(text) => updateTimeSlot(index, "start", text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="End Time (e.g., 05:00 PM)"
              value={slot.end}
              onChangeText={(text) => updateTimeSlot(index, "end", text)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={addTimeSlot}>
          <Text style={{ color: COLOR.light.primary, fontWeight: "bold" }}>
            + Add Time Slot
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={profile.contactInfo.email}
            onChangeText={(text) => handleChange("contactInfo.email", text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            value={profile.contactInfo.phone}
            onChangeText={(text) => handleChange("contactInfo.phone", text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Office Location</Text>
          <TextInput
            style={styles.input}
            value={profile.contactInfo.officeLocation}
            onChangeText={(text) => handleChange("contactInfo.officeLocation", text)}
          />
        </View>

        <Text style={styles.label}>Languages</Text>
        <View style={styles.languagesContainer}>
          {languageOptions.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                profile.contactInfo.languages.includes(lang) && styles.languageSelected,
              ]}
              onPress={() => toggleLanguage(lang)}
            >
              <Text
                style={[
                  styles.languageText,
                  profile.contactInfo.languages.includes(lang) && styles.languageTextSelected,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Profile"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLOR.light.light },
  loadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 999,
  },
  profileImageContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#EEE" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#777" },
  uploadButton: { marginTop: 10, backgroundColor: COLOR.light.primary, padding: 8, borderRadius: 8, paddingHorizontal: 16 },
  uploadText: { color: "#fff", fontWeight: "600" },
  section: { marginTop: 20, padding: 15, backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  input: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#F8F9FA", fontSize: 14 },
  textArea: { height: 100, textAlignVertical: "top", paddingTop: 10 },
  languagesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  languageButton: { borderWidth: 1, borderColor: "#DDD", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8 },
  languageSelected: { backgroundColor: COLOR.light.primary, borderColor: COLOR.light.primary },
  languageText: { color: "#666" },
  languageTextSelected: { color: "#fff", fontWeight: "600" },
  availabilityToggle: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#DDD", alignItems: "center", marginBottom: 12 },
  availabilityActive: { backgroundColor: COLOR.light.primary },
  availabilityText: { color: "#000", fontWeight: "600" },
  saveButton: { marginTop: 20, marginBottom: 40, backgroundColor: COLOR.light.primary, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
