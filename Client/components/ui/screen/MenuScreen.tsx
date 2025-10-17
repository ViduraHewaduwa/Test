import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Menu } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { COLOR } from "@/constants/ColorPallet";

export default function MenuScreen({ navigation }: { navigation?: any }) {
  const { user, logout, getCurrentUser, isLoading, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert(
        "Error",
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Failed to logout"
      );
    }
  };

  const navigateToProfile = () => {
    if (!user) return;

    switch (user.role) {
      case "user":
        navigation.navigate("UserProfile");
        break;
      case "lawyer":
        navigation.navigate("LawyerOwnProfile");
        break;
      case "ngo":
        navigation.navigate("NgoOwnProfile");
        break;
      default:
        console.log("Unknown user role:", user.role);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCurrentUser();
    } catch {
      Alert.alert("Error", "Failed to refresh profile data");
    } finally {
      setRefreshing(false);
    }
  };

  const getUserTypeLabel = () => {
    if (!user) return "User";
    switch (user.role) {
      case "user":
        return "Regular User";
      case "lawyer":
        return "Legal Professional";
      case "ngo":
        return "NGO Representative";
      default:
        return "User";
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "User";

    switch (user.role) {
      case "lawyer":
        return user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email;
      case "ngo":
        return user.organizationName || user.email;
      case "user":
      default:
        return user.email;
    }
  };

  const formatJoinDate = (dateString?: string): string => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load user data</Text>
        <Text style={styles.errorSubText}>
          {isAuthenticated ? "User data is missing" : "Please log in to view menu"}
        </Text>
        <Pressable style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
        {!isAuthenticated && (
          <Pressable
            style={[styles.retryButton, { backgroundColor: "#007AFF", marginTop: 10 }]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.retryButtonText}>Go to Login</Text>
          </Pressable>
        )}
      </View>
    );
  }

  /** Menu items data */
  const menuItems = [
    {
      title: "My Profile",
      icon: "account-outline",
      onPress: navigateToProfile,
    },
    ...(user.role === "user"
      ? [
          {
            title: "My Appointments",
            icon: "calendar-check-outline",
            onPress: () => navigation.navigate("MyAppointments"),
          },
        ]
      : []),
    {
      title: "AI ChatBot Assist",
      icon: "robot-outline",
      onPress: () => navigation.navigate("Chat"),
    },
    {
      title: "Languages",
      icon: "translate",
      onPress: () => navigation.navigate("LanguageSettings"),
    },
    {
      title: "NGO",
      icon: "charity",
      onPress: () => navigation.navigate("Ngo"),
    },
    { title: "Settings", icon: "cog-outline", onPress: () => {} },
    { title: "About Us", icon: "shield-account-outline", onPress: () => {} },
    { title: "Contact Us", icon: "account-voice", onPress: () => {} },
  ];

  const renderMenuItem = ({ item }: any) => (
    <Menu.Item leadingIcon={item.icon} onPress={item.onPress} title={item.title} />
  );

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

      {/* Profile Summary Card */}
      <TouchableOpacity style={styles.profileCard} onPress={navigateToProfile}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getUserDisplayName().charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.displayName}>{getUserDisplayName()}</Text>
          <Text style={styles.userType}>{getUserTypeLabel()}</Text>
          <Text style={styles.memberSince}>Member since {formatJoinDate(user.createdAt)}</Text>
        </View>

        <View style={styles.profileArrow}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </TouchableOpacity>

      <Text style={styles.menuSectionTitle}>Quick Actions</Text>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      data={menuItems}
      keyExtractor={(item, index) => item.title + index}
      renderItem={renderMenuItem}
      ListHeaderComponent={ListHeader}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 30 }}
      ListFooterComponent={
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  errorText: { fontSize: 16, color: "#666", marginBottom: 10, textAlign: "center" },
  errorSubText: { fontSize: 14, color: "#999", marginBottom: 20, textAlign: "center" },
  retryButton: { backgroundColor: "#ff6b35", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  retryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  header: { alignItems: "center", marginBottom: 30, marginTop: 40 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: { marginRight: 15 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ff6b35", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  profileInfo: { flex: 1 },
  displayName: { fontSize: 18, color: "#333", fontWeight: "600", marginBottom: 4 },
  userType: { fontSize: 14, color: "#ff6b35", fontWeight: "500", marginBottom: 4 },
  memberSince: { fontSize: 12, color: "#666" },
  profileArrow: { marginLeft: 10 },
  menuSectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 15, textAlign: "center" },
  logoutButton: { backgroundColor: "#dc3545", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, alignItems: "center", marginTop: 20, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  logoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
