import Exercises from "@/api/exerciseApi";
import { useNav } from "@/contexts/NavContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export type ExerciseFormItem = {
  exercise_id: number;
  name: string;
  target_muscle: string;
  category: string;
  image_url: string | null;
  sets: string;
  reps: string;
  day: string[];
};

type NavData = {
  planId: string;
  returnId: string;
  returnTo: string;
  planName: string;
  planDifficulty: string;
  planDuration: string;
};

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function useExerciseDetails() {
  const router = useRouter();
  const { selectedIds } = useLocalSearchParams<{
    selectedIds?: string;
  }>();
  const [items, setItems] = useState<ExerciseFormItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const { navData } = useNav();

  const { data: selectedItems = [], isLoading: loading } = useQuery<
    ExerciseFormItem[]
  >({
    queryKey: ["selectedExercises", selectedIds],
    queryFn: async () => {
      const response = await Exercises.getAll(1, 100);
      const ids = selectedIds
        ? selectedIds
            .split(",")
            .map((item) => Number(item))
            .filter((item) => !Number.isNaN(item))
        : [];

      return response.data
        .filter((exercise) => exercise.id != null && ids.includes(exercise.id))
        .map((exercise) => ({
          exercise_id: exercise.id!,
          name: exercise.name,
          target_muscle: exercise.target_muscle,
          category: exercise.category,
          image_url: exercise.image_url,
          sets: "3",
          reps: "10",
          day: ["monday"],
        }));
    },
    enabled: !!selectedIds,
  });

  // navData comes from NavContext (set by the caller flow)

  useEffect(() => {
    if (!initialized && selectedItems.length > 0) {
      setItems(selectedItems);
      setInitialized(true);
    }
  }, [initialized, selectedItems]);

  useEffect(() => {
    setInitialized(false);
  }, [selectedIds]);

  function updateItem(
    exerciseId: number,
    field: "sets" | "reps",
    value: string,
  ) {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.exercise_id !== exerciseId) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      });
    });
  }

  function toggleDay(exerciseId: number, day: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.exercise_id !== exerciseId) {
          return item;
        }

        const hasDay = item.day.includes(day);

        if (hasDay) {
          return {
            ...item,
            day: item.day.filter((d) => d !== day),
          };
        }

        return {
          ...item,
          day: [...item.day, day],
        };
      }),
    );
  }

  async function handleSaveExercises() {
    if (!navData?.returnTo) {
      Alert.alert("Error", "Missing return page");
      return;
    }

    setSaving(true);

    try {
      await AsyncStorage.setItem("selectedExercises", JSON.stringify(items));

      router.replace({
        pathname: navData.returnTo as
          | "/(private)/plans/create"
          | "/(private)/plans/edit/[id]",
        params: {
          id: navData.returnId || navData.planId || "",
        },
      });
    } catch (error) {
      console.error("Failed to save exercises:", error);
      Alert.alert("Error", "Failed to save exercises");
    } finally {
      setSaving(false);
    }
  }

  return {
    items,
    loading,
    saving,
    updateItem,
    toggleDay,
    handleSaveExercises,
    weekDays,
  };
}
