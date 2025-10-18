import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLawyerReviews } from "../../../../../service/lawyerService";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "../../../../../context/ThemeContext";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width - 40; // keep margins on sides

const FeedbackSection = () => {
  const { colors } = useTheme();
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getLawyerReviews(user.id);
        if (data?.success) {
          setReviewsList(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching lawyer reviews:", error);
        Alert.alert("Error", "Could not load lawyer reviews");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchReviews();
  }, [user?.id]);

  if (loading) {
    return (
      <View
        style={[
          styles.card,
          styles.loadingContainer,
          { backgroundColor: colors.white },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (reviewsList.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Feedback & Reviews
        </Text>
        <Text style={{ color: colors.secondary }}>No reviews yet.</Text>
      </View>
    );
  }

  // Split reviews into chunks of 5 per page
  const chunkReviews = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const paginatedReviews = chunkReviews(reviewsList, 5);

  const handleScroll = (event) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    setCurrentPage(pageIndex);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.white, shadowColor: colors.shadow },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Feedback & Reviews
      </Text>

      <View style={styles.sliderContainer}>
        <FlatList
          data={paginatedReviews}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <View
              style={{
                width: PAGE_WIDTH,
                alignSelf: "center",
              }}
            >
              {item.map((review, index) => (
                <View
                  key={index}
                  style={[styles.reviewCard, { backgroundColor: colors.light }]}
                >
                  <View style={styles.reviewContent}>
                    <Text style={[styles.userName, { color: colors.primary }]}>
                      {review.firstName || "Anonymous"}
                    </Text>
                    <Text style={[styles.comment, { color: colors.secondary }]}>
                      {review.comment}
                    </Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={16}
                        color={colors.star || "#FFD700"}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={PAGE_WIDTH}
          contentContainerStyle={{
            alignItems: "center",
          }}
        />
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {paginatedReviews.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentPage === index ? colors.primary : colors.secondary,
                transform: [{ scale: currentPage === index ? 1.2 : 1 }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default FeedbackSection;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
    textAlign: "center",
  },
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  reviewCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    width: PAGE_WIDTH - 32,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  reviewContent: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  comment: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});
