import { PendingExercise } from "@/components/plan-exercises";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function useSelectedExercises(
  setExercises: (exercises: PendingExercise[]) => void,
) {
  useEffect(() => {
    async function loadSelectedExercises() {
      try {
        const selectedExercises =
          await AsyncStorage.getItem("selectedExercises");
        if (selectedExercises) {
          const parsed = JSON.parse(selectedExercises);
          setExercises(parsed);
          await AsyncStorage.removeItem("selectedExercises");
        }
      } catch (error) {
        console.error("Failed to load selected exercises:", error);
      }
    }

    loadSelectedExercises();
  }, [setExercises]);
}
