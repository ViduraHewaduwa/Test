import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function MyAppointmentsScreen() {
  const { colors } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAppointments(user.id);
    }
  }, [user]);

  const fetchAppointments = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.9:3000/api/appointments/user/${userId}`);
      if (response.status === 200) {
        // Sort upcoming appointments first
        const sorted = response.data.appointments.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAppointments(sorted);
      } else {
        Alert.alert("Error", "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Something went wrong while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  // Separate upcoming and past appointments
  const now = new Date();
  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= now);
  const pastAppointments = appointments.filter(a => new Date(a.date) < now);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.light }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.header, { color: colors.primary }]}>My Appointments</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 50 }} />
        ) : appointments.length === 0 ? (
          <Text style={[styles.noAppointments, { color: colors.primary }]}>
            You have no appointments scheduled.
          </Text>
        ) : (
          <>
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Upcoming</Text>
                {upcomingAppointments.map((appt) => (
                  <AppointmentCard key={appt._id} appt={appt} colors={colors} navigation={navigation} />
                ))}
              </View>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Past</Text>
                {pastAppointments.map((appt) => (
                  <AppointmentCard key={appt._id} appt={appt} colors={colors} navigation={navigation} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Appointment Card Component
const AppointmentCard = ({ appt, colors, navigation }: any) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: colors.white, shadowColor: colors.shadow }]}
    // onPress={() => navigation.navigate("AppointmentDetail", { appointmentId: appt._id })}
  >
    <Text style={[styles.title, { color: colors.primary }]}>
      {appt.lawyer?.firstName || "Lawyer"} - {appt.meetingType}
    </Text>
    <Text style={[styles.infoText, { color: colors.darkgray }]}>
      {new Date(appt.date).toLocaleDateString()} at {appt.time}
    </Text>
    <View
      style={[
        styles.statusBadge,
        appt.status === "Confirmed"
          ? { backgroundColor: "#4caf50" }
          : appt.status === "Pending"
          ? { backgroundColor: "#ff9800" }
          : { backgroundColor: "#f44336" },
      ]}
    >
      <Text style={styles.statusText}>{appt.status}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: { marginRight: 10 },
  header: { fontSize: 24, fontWeight: "bold", flex: 1, textAlign: "center" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  noAppointments: { fontSize: 18, textAlign: "center", marginTop: 50 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 15 },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  infoText: { fontSize: 14, marginBottom: 10 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});
