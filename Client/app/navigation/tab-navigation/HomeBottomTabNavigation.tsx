import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomePageScreen from "@/components/ui/screen/HomePageScreen";
import ForumScreen from "@/components/ui/screen/ForumScreen";
import DocumentAnalyseScreen from "../../../components/ui/screen/DocumentAnalyseScreen";
import LawyerScreen from "@/components/ui/screen/LawyerScreen";
import MenuScreen from "@/components/ui/screen/MenuScreen";
import LawyerCaseScreen from "@/components/ui/screen/LawyerCases";
import LawyerDashboard from "@/components/ui/screen/LawyerDashboard";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import notificationService, {
  Notification,
} from "../../../services/notificationService";
import { COLOR } from "@/constants/ColorPallet";
import logo from "../../../assets/images/logo/logo2.jpeg";

const Tab = createBottomTabNavigator();

export default function HomeBottomTabNavigation({ navigation }: any) {
  const { colors, theme } = useTheme();
  const { user } = useAuth();
  const userRole = user?.role || "user";

  /** Notification states */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  /** Navigation helpers */
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

  const navigateToChat = () => {
    console.log("navigate to chat pressed..");
  };

  /** Fetch notifications lazily */
  const fetchNotifications = async () => {
    if (!user?.email) return;
    setLoadingNotifications(true);
    try {
      let userNotifications: Notification[] = [];
      if (user.role === "lawyer") {
        userNotifications = await notificationService.getLawyerNotifications(
          user.email
        );
      } else {
        userNotifications = await notificationService.getUserNotifications(
          user.email
        );
      }
      setNotifications(userNotifications);

      const count = await notificationService.getUnreadCount(user.email);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleOpenNotifications = async () => {
    setIsNotificationModalVisible(true);
    if (notifications.length === 0) {
      await fetchNotifications();
    }
  };

  /** Notification handlers */
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await notificationService.markAsRead(notification._id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
    }
    setIsNotificationModalVisible(false);
    navigation.navigate("Forum");
  };

  const handleMarkAllAsRead = async () => {
    if (user?.email) {
      await notificationService.markAllAsRead(user.email);
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleClearAllNotifications = async () => {
    if (user?.email) {
      await notificationService.clearAllNotifications(user.email);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  /** Notification item renderer */
  const renderNotificationItem = useCallback(
    ({ item }: { item: Notification }) => (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          {
            backgroundColor: item.isRead
              ? theme === "dark"
                ? colors.secondary
                : "#FFFFFF"
              : theme === "dark"
              ? "rgba(255, 113, 0, 0.1)"
              : "rgba(255, 113, 0, 0.05)",
            borderBottomColor: theme === "dark" ? colors.darkgray : "#F0F0F0",
          },
        ]}
        onPress={() => handleNotificationClick(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.notificationIcon,
            { backgroundColor: theme === "dark" ? colors.white : "#F0F0F0" },
          ]}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={24}
            color={colors.accent}
          />
        </View>
        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationText,
              { color: theme === "dark" ? colors.primary : "#2C3E50" },
            ]}
          >
            <Text style={[styles.notificationSender, { color: colors.accent }]}>
              {item.sender}
            </Text>{" "}
            commented on your post:{" "}
            <Text
              style={[
                styles.notificationPostTitle,
                { color: theme === "dark" ? colors.primary : "#2C3E50" },
              ]}
            >
              {item.postTitle}
            </Text>
          </Text>
          <Text
            style={[
              styles.notificationComment,
              { color: theme === "dark" ? "#AAA" : "#666" },
            ]}
            numberOfLines={2}
          >
            {userRole === "lawyer" ? item.message : item.commentContent}
          </Text>
          <Text
            style={[
              styles.notificationTime,
              { color: theme === "dark" ? colors.darkgray : "#999" },
            ]}
          >
            {notificationService.formatTimeAgo(item.createdAt)}
          </Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    ),
    [theme, colors]
  );

  /** Notification Modal */
  const NotificationModal = () => (
    <Modal
      animationType="slide"
      transparent
      visible={isNotificationModalVisible}
      onRequestClose={() => setIsNotificationModalVisible(false)}
    >
      <View style={styles.notificationModalOverlay}>
        <View
          style={[
            styles.notificationModalContent,
            { backgroundColor: theme === "dark" ? colors.secondary : "#FFF" },
          ]}
        >
          <View style={styles.notificationModalHeader}>
            <Text
              style={[
                styles.notificationModalTitle,
                { color: theme === "dark" ? colors.primary : "#2C3E50" },
              ]}
            >
              Notifications
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={fetchNotifications}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="refresh" size={20} color={colors.accent} />
              </TouchableOpacity>
              {notifications.length > 0 && (
                <>
                  {unreadCount > 0 && (
                    <TouchableOpacity
                      onPress={handleMarkAllAsRead}
                      style={{ marginRight: 15 }}
                    >
                      <Text
                        style={[
                          styles.markAllReadText,
                          { color: colors.accent },
                        ]}
                      >
                        Mark all read
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handleClearAllNotifications}
                    style={{ marginRight: 15 }}
                  >
                    <Text
                      style={[styles.markAllReadText, { color: "#FF3B30" }]}
                    >
                      Clear all
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                onPress={() => setIsNotificationModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme === "dark" ? colors.primary : "#2C3E50"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {loadingNotifications ? (
            <View style={{ padding: 32, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : notifications.length > 0 ? (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item._id}
              renderItem={renderNotificationItem}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={3}
              removeClippedSubviews
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyNotifications}>
              <Ionicons
                name="notifications-off-outline"
                size={64}
                color={theme === "dark" ? colors.darkgray : "#CCC"}
              />
              <Text
                style={[
                  styles.emptyNotificationsText,
                  { color: theme === "dark" ? colors.darkgray : "#999" },
                ]}
              >
                No notifications yet
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  /** Header Options */
  const commonHeaderOptions = {
    headerStyle: {
      backgroundColor: colors.white,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      height: 90,
      borderBottomWidth: 1,
      borderBottomColor: theme === "light" ? "#F5F5F7" : colors.darkgray,
    },
    headerTintColor: colors.primary,
  };

  /** Bottom Tabs */
  const UserTabs = () => (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName = "";
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Forum":
              iconName = focused ? "chatbox" : "chatbox-outline";
              break;
            case "Documents":
              iconName = focused ? "document" : "document-outline";
              break;
            case "Lawyer":
              iconName = focused ? "briefcase" : "briefcase-outline";
              break;
            case "Menu":
              iconName = focused ? "menu" : "menu-outline";
              break;
          }
          return <Ionicons name={iconName as any} size={22} color={color} />;
        },

        // 🎨 HEADER STYLE
        headerStyle: {
          backgroundColor: colors.white,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          height: 130,
          borderBottomWidth: 1,
          borderBottomColor: theme === "light" ? "#F5F5F7" : colors.darkgray,
        },
        headerTintColor: colors.primary,

        // 🧭 HEADER LEFT — LOGO
        headerLeft: () => (
          <View style={{ marginLeft: 0 }}>
            <Image
              source={logo}
              style={{ width: 90, height: 90, resizeMode: "contain" }}
            />
          </View>
        ),

        // 🔔 HEADER RIGHT — ICONS
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleOpenNotifications}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.accent}
              />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -2,
                    top: -2,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#FF3B30",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={navigateToChat}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={24}
                color={colors.accent}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToProfile}>
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        ),

        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: theme === "light" ? "#F5F5F7" : colors.darkgray,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePageScreen}
        options={{ headerTitle: "HOME" }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentAnalyseScreen}
        options={{ headerTitle: "DOCUMENTS" }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{ headerTitle: "FORUM" }}
      />
      <Tab.Screen
        name="Lawyer"
        component={LawyerScreen}
        options={{ headerTitle: "FIND LAWYERS" }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerTitle: "MENU" }}
      />
    </Tab.Navigator>
  );

  const LawyerTabs = () => (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName: string = "";
          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "grid-outline";
              break;
            
            case "Documents":
              iconName = focused ? "document-text" : "document-text-outline";
              break;
            case "Forum":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
            case "Menu":
              iconName = focused ? "menu" : "menu-outline";
              break;
          }
          return <Ionicons name={iconName as any} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: theme === "light" ? "#F5F5F7" : colors.darkgray,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={LawyerDashboard}
        options={{
          ...commonHeaderOptions,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={handleOpenNotifications} // <-- lazy fetch
            >
              <Ionicons name="notifications" size={24} color={colors.accent} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -2,
                    top: -2,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#FF3B30",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentAnalyseScreen}
        options={commonHeaderOptions}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={commonHeaderOptions}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={commonHeaderOptions}
      />
    </Tab.Navigator>
  );

  return (
    <>
      {userRole === "lawyer" ? <LawyerTabs /> : <UserTabs />}
      <NotificationModal />
    </>
  );
}

const styles = StyleSheet.create({
  notificationItem: { flexDirection: "row", padding: 16, borderBottomWidth: 1 },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: { flex: 1 },
  notificationText: { fontSize: 14, marginBottom: 4, lineHeight: 20 },
  notificationSender: { fontWeight: "700" },
  notificationPostTitle: { fontWeight: "600" },
  notificationComment: { fontSize: 13, marginBottom: 4, fontStyle: "italic" },
  notificationTime: { fontSize: 12 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    marginLeft: 8,
    alignSelf: "center",
  },
  markAllReadText: { fontSize: 14, fontWeight: "600" },
  notificationModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  notificationModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 16,
  },
  notificationModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  notificationModalTitle: { fontSize: 18, fontWeight: "700" },
  emptyNotifications: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyNotificationsText: { fontSize: 16, marginTop: 16 },
});
