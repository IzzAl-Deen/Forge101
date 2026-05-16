import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ExerciseFilters } from "@/types/exercise";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ExerciseFiltersContextType = {
  filters: ExerciseFilters;
  setFilters: (filters: ExerciseFilters) => void;
  filtersLoaded: boolean;
};

const STORAGE_KEY = "exerciseFilters";

const defaultFilters: ExerciseFilters = {
  target_muscle: null,
  difficulty: null,
  category: null,
};

const ExerciseFiltersContext =
  createContext<ExerciseFiltersContextType | null>(null);

export function ExerciseFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFiltersState] = useState<ExerciseFilters>(defaultFilters);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          setFiltersState(JSON.parse(saved));
        }
      })
      .finally(() => setFiltersLoaded(true));
  }, []);

  const setFilters = (newFilters: ExerciseFilters) => {
    setFiltersState(newFilters);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
  };

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      filtersLoaded,
    }),
    [filters, filtersLoaded],
  );

  return (
    <ExerciseFiltersContext.Provider value={value}>
      {children}
    </ExerciseFiltersContext.Provider>
  );
}

export function useExerciseFilters() {
  const context = useContext(ExerciseFiltersContext);

  if (!context) {
    throw new Error("ExerciseFiltersProvider is missing");
  }

  return context;
}