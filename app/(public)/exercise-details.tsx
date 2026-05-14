import { useSelectedExercises } from "@/contexts/SelectedExercisesContext";
import { useExercise } from "@/hooks/use-exercise";
import { DIFFICULTY_COLORS } from "@/types/exercise";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
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

  const { addExercise, removeExercise, isSelected } = useSelectedExercises();

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
          <Ionicons name="warning-outline" size={48} color="#C8FF00" />

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

  const selected = isSelected(exercise.id);

  const handleAddToPlan = async () => {
    try {
      if (selected) {
        await removeExercise(exercise.id);
        Alert.alert("Removed", "Exercise removed from your plan.");
        return;
      }

      await addExercise(exercise);
      Alert.alert("Added", "Exercise added to your plan.");
    } catch (error) {
      Alert.alert("Error", "Could not update your plan.");
    }
  };

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
              <Ionicons name="barbell-outline" size={80} color="#333" />
            </View>
          )}

          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.focusBadge}>
              <Ionicons name="flash" size={10} color="#000" />
              <Text style={styles.focusBadgeText}>
                {exercise.category?.toUpperCase() || "EXERCISE"}
              </Text>
            </View>

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

          <View style={styles.overviewCard}>
            <Text style={styles.overviewText}>
              {exercise.description || "No description available."}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MUSCLE FOCUS</Text>

          <View style={styles.muscleCard}>
            <Text style={styles.muscleName}>{exercise.target_muscle}</Text>
            <Text style={styles.muscleRole}>Main target muscle</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToPlan}>
          <Text style={styles.addBtnText}>
            {selected ? "REMOVE FROM PLAN" : "ADD TO PLAN"}
          </Text>

          <Ionicons
            name={selected ? "checkmark-circle-outline" : "add-circle-outline"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
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
    height: 300,
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  focusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C8FF00",
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    marginBottom: 8,
  },
  focusBadgeText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 32,
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
    marginTop: 24,
    gap: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
  overviewCard: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  overviewText: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 22,
  },
  muscleCard: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  muscleName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  muscleRole: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#C8FF00",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 2,
  },
});