import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Exercise } from "@/types/exercise";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setSelectedExercises(JSON.parse(saved));
      })
      .catch(() => {});
  }, []);

  const saveExercises = useCallback(async (items: Exercise[]) => {
    setSelectedExercises(items);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addExercise = useCallback(
    async (exercise: Exercise) => {
      if (selectedExercises.some((item) => item.id === exercise.id)) return;
      await saveExercises([...selectedExercises, exercise]);
    },
    [selectedExercises, saveExercises],
  );

  const removeExercise = useCallback(
    async (exerciseId: number) => {
      await saveExercises(
        selectedExercises.filter((item) => item.id !== exerciseId),
      );
    },
    [selectedExercises, saveExercises],
  );

  const clearSelectedExercises = useCallback(() => {
    return saveExercises([]);
  }, [saveExercises]);

  const isSelected = useCallback(
    (exerciseId: number) =>
      selectedExercises.some((item) => item.id === exerciseId),
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
    throw new Error("SelectedExercisesProvider is missing");
  }

  return context;
}