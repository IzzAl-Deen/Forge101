import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { PendingExercise } from "@/components/plan-exercises";

type Params = {
  selectedExercises?: string;
};

export default function useSelectedExercises(
  setExercises: (exercises: PendingExercise[]) => void
) {
  const { selectedExercises } = useLocalSearchParams<Params>();

  useEffect(() => {
    if (!selectedExercises) return;

    try {
      const parsed = JSON.parse(selectedExercises);
      setExercises(parsed);
    } catch (error) {
      console.error("Failed to parse selected exercises:", error);
    }
  }, [selectedExercises]);
}