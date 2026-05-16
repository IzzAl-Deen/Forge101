import { useExercise } from "@/hooks/use-exercise";
import { DIFFICULTY_COLORS } from "@/types/exercise";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExerciseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    data: exercise,
    isLoading,
    isError,
    error,
    refetch,
  } = useExercise(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C8FF00" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>EXERCISE DETAILS</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.centered}>
          <Ionicons name="warning-outline" size={46} color="#C8FF00" />

          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load exercise"}
          </Text>

          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Exercise not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const difficultyColor =
    DIFFICULTY_COLORS[exercise.difficulty?.toLowerCase()] ?? "#888";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>EXERCISE DETAILS</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          {exercise.image_url ? (
            <Image
              source={{ uri: exercise.image_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="barbell-outline" size={76} color="#333" />
            </View>
          )}

          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <Text style={styles.exerciseName}>
              {exercise.name.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>TARGET MUSCLE</Text>
            <Text style={styles.infoValue}>{exercise.target_muscle}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>DIFFICULTY</Text>
            <Text style={[styles.infoValue, { color: difficultyColor }]}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OVERVIEW</Text>

          <View style={styles.card}>
            <Text style={styles.description}>
              {exercise.description || "No description available."}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATEGORY</Text>

          <View style={styles.card}>
            <Text style={styles.categoryText}>
              {exercise.category || "General"}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  errorText: {
    color: "#777",
    fontSize: 15,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#C8FF00",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#000",
    fontWeight: "800",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerSpace: {
    width: 30,
  },
  heroContainer: {
    height: 290,
    backgroundColor: "#141414",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#141414",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  heroContent: {
    position: "absolute",
    bottom: 22,
    left: 16,
    right: 16,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: 1,
    lineHeight: 36,
  },
  infoRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#141414",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E1E1E",
    overflow: "hidden",
  },
  infoCard: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  infoDivider: {
    width: 1,
    backgroundColor: "#2A2A2A",
  },
  infoLabel: {
    color: "#555",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  section: {
    marginHorizontal: 16,
    marginTop: 22,
    gap: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  description: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 22,
  },
  categoryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  bottomSpace: {
    height: 32,
  },
});