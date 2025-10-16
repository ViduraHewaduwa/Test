import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Linking,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../../../context/AuthContext";
import {
  getLawyerAppointments,
  updateAppointmentStatus,
} from "../../../../../service/appointmentSercive";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../../context/ThemeContext";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Cancelled", "Completed"];

const LawyerAppointmentsScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchAppointments = async () => {
    if (!user?.id) return;
    try {
      const data = await getLawyerAppointments(user.id);
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleStatusChange = async (appointmentId, currentStatus) => {
    let newStatus =
      currentStatus === "Pending"
        ? "Confirmed"
        : currentStatus === "Confirmed"
        ? "Completed"
        : currentStatus === "Cancelled"
        ? "Pending"
        : "Pending";

    Alert.alert(
      "Change Status",
      `Are you sure you want to mark this appointment as "${newStatus}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await updateAppointmentStatus(appointmentId, newStatus);
              fetchAppointments();
            } catch (error) {
              console.error("Error updating status:", error);
              Alert.alert("Error", "Failed to update appointment status");
            }
          },
        },
      ]
    );
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterAppointments(text, selectedStatus);
  };

  const filterAppointments = (query, status) => {
    let filtered = [...appointments];

    if (status !== "All") {
      filtered = filtered.filter((appt) => appt.status === status);
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (appt) =>
          appt.contactName.toLowerCase().includes(lowerQuery) ||
          appt.meetingType.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterAppointments(searchQuery, status);
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.light }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.light }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.primary }]}>
          All Appointments
        </Text>

        {/* Search Bar */}
        <TextInput
          style={[
            styles.searchInput,
            { borderColor: colors.border, backgroundColor: colors.white },
          ]}
          placeholder="Search by client or type..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/* Status Filters */}
        <View style={styles.filterContainer}>
          {STATUS_OPTIONS.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === status && { color: colors.white },
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredAppointments.length === 0 ? (
          <Text style={[styles.noData, { color: colors.placeholder }]}>
            No appointments found.
          </Text>
        ) : (
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.white, shadowColor: colors.shadow },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.clientName, { color: colors.text }]}>
                    {item.contactName}
                  </Text>
                  <Text style={[styles.details, { color: colors.secondaryText }]}>
                    {item.meetingType} • {new Date(item.date).toDateString()} at{" "}
                    {item.time}
                  </Text>
                  <Text style={[styles.details, { color: colors.secondaryText }]}>
                    {item.contactEmail}
                  </Text>
                  <Text style={[styles.details, { color: colors.secondaryText }]}>
                    {item.contactPhone}
                  </Text>
                  <Text style={[styles.details, { color: colors.secondaryText }]}>
                    {item.description}
                  </Text>

                  {/* Call & Message Buttons */}
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => Linking.openURL(`tel:${item.contactPhone}`)}
                    >
                      <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.info }]}
                      onPress={() => Linking.openURL(`sms:${item.contactPhone}`)}
                    >
                      <Text style={styles.actionButtonText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        item.status === "Confirmed"
                          ? colors.success
                          : item.status === "Cancelled"
                          ? colors.danger
                          : item.status === "Completed"
                          ? colors.dark
                          : colors.warning,
                    },
                  ]}
                  onPress={() => handleStatusChange(item._id, item.status)}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LawyerAppointmentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  filterContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 6,
    marginBottom: 6,
  },
  filterText: { fontSize: 12 },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  clientName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  details: { fontSize: 13, marginTop: 2 },
  statusButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, justifyContent: "center" },
  statusText: { color: "#fff", fontWeight: "600" },
  actionButtonsContainer: { flexDirection: "row", marginTop: 8 },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 8 },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  noData: { textAlign: "center", marginTop: 50 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
