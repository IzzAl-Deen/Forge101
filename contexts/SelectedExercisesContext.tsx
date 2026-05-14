import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Exercise } from "@/types/exercise";

type SelectedExercisesContextType = {
  selectedExercises: Exercise[];
  addExercise: (exercise: Exercise) => Promise<void>;
  removeExercise: (exerciseId: number) => Promise<void>;
  isSelected: (exerciseId: number) => boolean;
  clearSelectedExercises: () => Promise<void>;
};

const STORAGE_KEY = "selectedExercises";

const SelectedExercisesContext =
  createContext<SelectedExercisesContextType | null>(null);

export function SelectedExercisesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    async function loadSelectedExercises() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          setSelectedExercises(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Failed to load selected exercises:", error);
      }
    }

    loadSelectedExercises();
  }, []);

  const saveSelectedExercises = useCallback(async (items: Exercise[]) => {
    setSelectedExercises(items);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addExercise = useCallback(
    async (exercise: Exercise) => {
      const alreadySelected = selectedExercises.some(
        (item) => item.id === exercise.id,
      );

      if (alreadySelected) {
        return;
      }

      const updatedItems = [...selectedExercises, exercise];
      await saveSelectedExercises(updatedItems);
    },
    [selectedExercises, saveSelectedExercises],
  );

  const removeExercise = useCallback(
    async (exerciseId: number) => {
      const updatedItems = selectedExercises.filter(
        (item) => item.id !== exerciseId,
      );

      await saveSelectedExercises(updatedItems);
    },
    [selectedExercises, saveSelectedExercises],
  );

  const clearSelectedExercises = useCallback(async () => {
    await saveSelectedExercises([]);
  }, [saveSelectedExercises]);

  const isSelected = useCallback(
    (exerciseId: number) => {
      return selectedExercises.some((item) => item.id === exerciseId);
    },
    [selectedExercises],
  );

  const value = useMemo(
    () => ({
      selectedExercises,
      addExercise,
      removeExercise,
      isSelected,
      clearSelectedExercises,
    }),
    [
      selectedExercises,
      addExercise,
      removeExercise,
      isSelected,
      clearSelectedExercises,
    ],
  );

  return (
    <SelectedExercisesContext.Provider value={value}>
      {children}
    </SelectedExercisesContext.Provider>
  );
}

export function useSelectedExercises() {
  const context = useContext(SelectedExercisesContext);

  if (!context) {
    throw new Error(
      "useSelectedExercises must be used inside SelectedExercisesProvider",
    );
  }

  return context;
}