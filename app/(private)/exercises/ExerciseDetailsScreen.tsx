import Exercises, {
  Exercise,
  LaravelPaginatedResponse,
} from "@/api/exerciseApi";
import { Kinetic } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ExerciseFormItem = {
  exercise_id: number;
  name: string;
  target_muscle: string;
  category: string;
  image_url: string | null;
  sets: string;
  reps: string;
  day: string[];
};

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function ExerciseDetailsScreen() {
  const router = useRouter();
  const {
    planId,
    returnId,
    returnTo,
    selectedIds,
    planName,
    planDifficulty,
    planDuration,
  } = useLocalSearchParams<{
    planId?: string;
    returnId?: string;
    returnTo?: string;
    selectedIds?: string;
    planName?: string;
    planDifficulty?: string;
    planDuration?: string;
  }>();
  const [items, setItems] = useState<ExerciseFormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSelectedExercises() {
      if (!selectedIds) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response: LaravelPaginatedResponse<Exercise> =
          await Exercises.getAll(1, 100);
        const ids = selectedIds
          .split(",")
          .map((item) => Number(item))
          .filter((item) => !Number.isNaN(item));

        const selected = ids
          .map((id) => response.data.find((exercise) => exercise.id === id))
          .filter(Boolean)
          .map((exercise) => ({
            exercise_id: exercise!.id!,
            name: exercise!.name,
            target_muscle: exercise!.target_muscle,
            category: exercise!.category,
            image_url: exercise!.image_url,
            sets: "3",
            reps: "10",
            day: ["monday"],
          }));

        setItems(selected);
      } catch (error) {
        console.error("Failed to load selected exercises:", error);
        Alert.alert("Error", "Failed to load selected exercises");
      } finally {
        setLoading(false);
      }
    }

    loadSelectedExercises();
  }, [selectedIds]);

  function updateItem(
    exerciseId: number,
    field: "sets" | "reps",
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.exercise_id === exerciseId ? { ...item, [field]: value } : item,
      ),
    );
  }

  function toggleDay(exerciseId: number, day: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.exercise_id !== exerciseId) {
          return item;
        }

        const hasDay = item.day.includes(day);

        return {
          ...item,
          day: hasDay
            ? item.day.filter((itemDay) => itemDay !== day)
            : [...item.day, day],
        };
      }),
    );
  }

  async function handleSaveExercises() {
    if (!returnTo) {
      Alert.alert("Error", "Missing return page");
      return;
    }

    setSaving(true);

    const selectedExercises = JSON.stringify(items);

    router.replace({
      pathname: returnTo as "/(private)/Plans/create" | "/(private)/Plans/edit/[id]",
      params: {
        id: returnId || planId || "",
        selectedExercises,
        planName: planName || "",
        planDifficulty: planDifficulty || "",
        planDuration: planDuration || "",
      },
    });
  }

  function renderItem({ item }: { item: ExerciseFormItem }) {
    return (
      <View style={styles.card}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <MaterialIcons name="fitness-center" size={22} color="#6f6f6f" />
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardTag}>
            {(item.target_muscle || item.category || "exercise")
              .replace(/_/g, " ")
              .toUpperCase()}
          </Text>
          <Text style={styles.cardTitle}>{item.name}</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>SETS</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={item.sets}
              onChangeText={(value) => updateItem(item.exercise_id, "sets", value)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>REPS</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={item.reps}
              onChangeText={(value) => updateItem(item.exercise_id, "reps", value)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DAY</Text>
            <View style={styles.daysRow}>
              {weekDays.map((day) => {
                const isSelected = item.day.includes(day);

                return (
                  <Pressable
                    key={day}
                    style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                    onPress={() => toggleDay(item.exercise_id, day)}
                  >
                    <Text
                      style={[
                        styles.dayChipText,
                        isSelected && styles.dayChipTextSelected,
                      ]}
                    >
                      {day.slice(0, 3).toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            hitSlop={10}
            onPress={() => router.back()}
            style={styles.headerIconButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={Kinetic.accentLight} />
          </Pressable>

          <Text style={styles.headerTitle}>EXERCISE DETAILS</Text>

          <View style={styles.headerRightSpace} />
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={Kinetic.accentPrimary} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.exercise_id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No exercises selected</Text>
              </View>
            }
          />
        )}

        <Pressable
          style={[
            styles.ctaWrapper,
            (items.length === 0 || saving) && styles.ctaWrapperDisabled,
          ]}
          disabled={items.length === 0 || saving}
          onPress={handleSaveExercises}
        >
          <LinearGradient
            colors={["#eff8c6", "#d0ff00"]}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 1, y: 0.6 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>
              {saving ? "SAVING..." : "SAVE EXERCISES"}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerIconButton: {
    width: 28,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    color: "#eef6c8",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginLeft: 8,
  },
  headerRightSpace: {
    width: 28,
  },
  listContent: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#202020",
    marginBottom: 14,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardTag: {
    color: "#e7efbb",
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 6,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#232323",
    color: "#f4f4f4",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayChip: {
    minWidth: 48,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#232323",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dayChipSelected: {
    backgroundColor: "#d7ff17",
  },
  dayChipText: {
    color: "#f4f4f4",
    fontSize: 12,
    fontWeight: "800",
  },
  dayChipTextSelected: {
    color: "#121212",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  ctaWrapper: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 28,
    borderRadius: 14,
    shadowColor: "#d7ff17",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 10,
  },
  ctaWrapperDisabled: {
    opacity: 0.5,
  },
  ctaButton: {
    minHeight: 58,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  ctaText: {
    color: "#4e5912",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
});
