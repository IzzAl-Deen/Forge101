import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Exercise } from "../types/exercise";
import { DIFFICULTY_COLORS } from "../types/exercise";

// ─── Difficulty Badge ─────────────────────────────────────────────────────────
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const color = DIFFICULTY_COLORS[difficulty?.toLowerCase()] ?? "#888";
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>
        {difficulty?.toUpperCase()}
      </Text>
    </View>
  );
};

// ─── Exercise Card ────────────────────────────────────────────────────────────
export const ExerciseCard = ({
  item,
  featured,
}: {
  item: Exercise;
  featured?: boolean;
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(public)/exercise-details",
      params: { id: item.id },
    });
  };

  if (featured) {
    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: item.image_url }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={styles.techniqueBadge}>
            <Text style={styles.techniqueBadgeText}>✦ TECHNIQUE FOCUS</Text>
          </View>
          <Text style={styles.featuredName}>{item.name}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredMetaText}>
              TARGET • {item.target_muscle?.toUpperCase()}
            </Text>
            <Text style={styles.featuredMetaText}>
              LEVEL • {item.difficulty?.toUpperCase()}
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#C8FF00"
          style={styles.featuredArrow}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMuscle}>{item.category?.toUpperCase()}</Text>
        <DifficultyBadge difficulty={item.difficulty} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#141414",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  cardImage: {
    width: 80,
    height: 80,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 4,
  },
  cardName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cardMuscle: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
    marginTop: 2,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  featuredCard: {
    borderRadius: 14,
    overflow: "hidden",
    height: 160,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#C8FF0033",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  featuredContent: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  techniqueBadge: {
    backgroundColor: "#C8FF00",
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  techniqueBadgeText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  featuredName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  featuredMeta: {
    flexDirection: "row",
    gap: 16,
  },
  featuredMetaText: {
    color: "#aaa",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  featuredArrow: {
    position: "absolute",
    right: 16,
    top: "50%",
  },
});