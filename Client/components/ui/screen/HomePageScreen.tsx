import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const lawyer = require("../../../assets/images/pngtree-female-lawyer-png-image_14809305.png");

export default function HomePageScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Define all sections as items in an array
  const sections = [
    { key: "hero" },
    { key: "stats" },
    { key: "featured" },
    { key: "testimonial" },
    { key: "success" },
    { key: "ctaFooter" },
  ];

  const renderSection = ({ item }) => {
    switch (item.key) {
      case "hero":
        return (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.heroSection}
          >
            <Animated.View
              style={[
                styles.heroContent,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Floating Stats */}
              <View style={styles.floatingStats}>
                <View
                  style={[styles.floatingCard, { backgroundColor: "rgba(255,255,255,0.15)" }]}
                >
                  <Text style={styles.floatingNumber}>16+</Text>
                  <Text style={styles.floatingLabel}>Years</Text>
                </View>
                <View
                  style={[styles.floatingCard, { backgroundColor: "rgba(255,255,255,0.15)" }]}
                >
                  <Text style={styles.floatingNumber}>100+</Text>
                  <Text style={styles.floatingLabel}>Volunteers</Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>Justice for{"\n"}Everyone</Text>
              <Text style={styles.heroSubtitle}>
                Innovative legal strategies for equality and justice
              </Text>

              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: colors.accent }]}
                onPress={() => navigation.navigate("Lawyer")}
                activeOpacity={0.8}
              >
                <Text style={[styles.ctaButtonText, { color: '#fff' }]}>Get Legal Help</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.heroDecoration}>
                <View style={[styles.circle, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
                <View style={[styles.circleSmall, { backgroundColor: "rgba(255,255,255,0.08)" }]} />
              </View>
            </Animated.View>
          </LinearGradient>
        );

      case "stats":
        return (
          <View style={styles.statsGrid}>
            {[{
              icon: "account-group",
              color: "#E3F2FD",
              number: "1,200+",
              label: "People Supported"
            },{
              icon: "trophy",
              color: "#FFF3E0",
              number: "35+",
              label: "Landmark Cases"
            },{
              icon: "shield-check",
              color: "#E8F5E9",
              number: "1,500+",
              label: "Protected Rights"
            }].map((stat, idx) => (
              <View key={idx} style={[styles.statCard, { backgroundColor: colors.white }]}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.statCardNumber, { color: colors.primary }]}>{stat.number}</Text>
                <Text style={[styles.statCardLabel, { color: colors.darkgray }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        );

      case "featured":
        return (
          <View style={[styles.featuredSection, { backgroundColor: colors.light }]}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredTextContainer}>
                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.badgeText}>Our Mission</Text>
                  </View>
                </View>

                <Text style={[styles.featuredTitle, { color: colors.primary }]}>
                  Standing with communities who face inequality
                </Text>

                <Text style={[styles.featuredDescription, { color: colors.darkgray }]}>
                  We provide legal support and advocacy to protect rights, promote equality, and fight injustice in our communities.
                </Text>

                <View style={styles.featuredStats}>
                  <View style={styles.featuredStatItem}>
                    <MaterialCommunityIcons name="gavel" size={24} color={colors.accent} />
                    <Text style={[styles.featuredStatText, { color: colors.primary }]}>
                      Expert Legal Team
                    </Text>
                  </View>
                  <View style={styles.featuredStatItem}>
                    <MaterialCommunityIcons name="hand-heart" size={24} color={colors.accent} />
                    <Text style={[styles.featuredStatText, { color: colors.primary }]}>
                      Community First
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.featuredImageContainer}>
                <View style={[styles.imageBorder, { borderColor: colors.accent }]} />
                <Image source={lawyer} style={styles.featuredImage} />
              </View>
            </View>
          </View>
        );

      case "testimonial":
        return (
          <View style={[styles.testimonialCard, { backgroundColor: colors.white }]}>
            <View style={styles.quoteIconContainer}>
              <Ionicons name="chatbox-ellipses" size={32} color={colors.accent} />
            </View>

            <Text style={[styles.testimonialQuote, { color: colors.primary }]}>
              "We stand with communities who face inequality, giving them a voice and protecting their rights."
            </Text>

            <View style={styles.testimonialAuthor}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                }}
                style={styles.authorImage}
              />
              <View style={styles.authorInfo}>
                <Text style={[styles.authorName, { color: colors.primary }]}>Liam Bennett</Text>
                <Text style={[styles.authorRole, { color: colors.darkgray }]}>Lead Advocate</Text>
              </View>
            </View>
          </View>
        );

      case "success":
        return (
          <View style={[styles.successSection, { backgroundColor: colors.light }]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recent Victories</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.darkgray }]}>Empowering communities through justice</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: "#FFF3E0" }]}>
                <MaterialCommunityIcons name="trophy-variant" size={28} color="#FF9800" />
              </View>
            </View>

            <View style={[styles.successCard, { backgroundColor: colors.white }]}>
              <View style={styles.successItem}>
                <View style={[styles.successBullet, { backgroundColor: colors.accent }]} />
                <Text style={[styles.successText, { color: colors.darkgray }]}>
                  Successfully represented <Text style={styles.highlight}>LGBTQ+ individuals</Text> who were denied employment opportunities
                </Text>
              </View>

              <View style={styles.successItem}>
                <View style={[styles.successBullet, { backgroundColor: colors.accent }]} />
                <Text style={[styles.successText, { color: colors.darkgray }]}>
                  Supported <Text style={styles.highlight}>families of disabled children</Text> to secure their right to inclusive <Text style={styles.highlight}>education</Text>
                </Text>
              </View>
            </View>
          </View>
        );

      case "ctaFooter":
        return (
          <View style={[styles.ctaFooter, { backgroundColor: colors.primary }]}>
            <Text style={styles.ctaFooterTitle}>Ready to take action?</Text>
            <Text style={styles.ctaFooterSubtitle}>
              Connect with our legal experts today
            </Text>
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate("Lawyer")}
            >
              <Text style={[styles.footerButtonText, { color: '#fff' }]}>Find a Lawyer</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.light }]}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 0 },
  
  // Hero Section
  heroSection: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
  },
  floatingStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  floatingCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 90,
  },
  floatingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  floatingLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 56,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 20,
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  heroDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
  },
  circleSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -20,
    left: -30,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginTop: -40,
    gap: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 64) / 3,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Featured Section
  featuredSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredTextContainer: {
    width: '100%',
    marginBottom: 32,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 16,
  },
  featuredDescription: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  featuredStats: {
    gap: 16,
  },
  featuredStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredStatText: {
    fontSize: 15,
    fontWeight: '600',
  },
  featuredImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBorder: {
    position: 'absolute',
    width: 220,
    height: 280,
    borderWidth: 3,
    borderRadius: 30,
    top: -10,
    left: -10,
  },
  featuredImage: {
    width: 200,
    height: 280,
    resizeMode: 'contain',
  },

  // Testimonial
  testimonialCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 32,
  },
  quoteIconContainer: {
    marginBottom: 16,
  },
  testimonialQuote: {
    fontSize: 17,
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorRole: {
    fontSize: 13,
    marginTop: 2,
  },

  // Success Section
  successSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    padding: 20,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  successItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  successBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  // CTA Footer
  ctaFooter: {
    marginTop: 32,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  ctaFooterTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaFooterSubtitle: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 24,
    textAlign: 'center',
  },
  footerButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
