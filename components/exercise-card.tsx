import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Exercise } from "../types/exercise";
import { DIFFICULTY_COLORS } from "../types/exercise";

type Props = {
  item: Exercise;
  featured?: boolean;
};

export const ExerciseCard = ({ item }: Props) => {
  const router = useRouter();
  const color = DIFFICULTY_COLORS[item.difficulty?.toLowerCase()] ?? "#888";

  const openDetails = () => {
    router.push({
      pathname: "/(public)/exercise-details",
      params: { id: item.id },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openDetails} activeOpacity={0.8}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="barbell-outline" size={26} color="#444" />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category?.toUpperCase()}</Text>

        <View style={[styles.badge, { borderColor: color }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.badgeText, { color }]}>
            {item.difficulty?.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#141414",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  image: {
    width: 80,
    height: 80,
  },
  placeholder: {
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 4,
  },
  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  category: {
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
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});