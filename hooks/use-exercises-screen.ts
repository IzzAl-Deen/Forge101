import Exercises, {
    Exercise,
    LaravelPaginatedResponse,
} from "@/api/exerciseApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

type NavData = {
  planId: string;
  returnId: string;
  returnTo: string;
  planName: string;
  planDifficulty: string;
  planDuration: string;
};

const muscleFilters = ["all", "chest", "back", "legs", "arms"];

const SEARCH_KEY = "ExercisesScreen.searchText";
const MUSCLE_KEY = "ExercisesScreen.selectedMuscle";
const NAV_KEY = "ExercisesScreen.navData";

export function useExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [navData, setNavData] = useState<NavData | null>(null);

  useEffect(() => {
    // Load nav data and preferences
    async function loadState() {
      try {
        const [savedSearch, savedMuscle, savedNav] = await Promise.all([
          AsyncStorage.getItem(SEARCH_KEY),
          AsyncStorage.getItem(MUSCLE_KEY),
          AsyncStorage.getItem(NAV_KEY),
        ]);

        if (savedSearch !== null) {
          setSearchText(savedSearch);
        }
        if (savedMuscle !== null) {
          setSelectedMuscle(savedMuscle);
        }
        if (savedNav !== null) {
          setNavData(JSON.parse(savedNav));
        }
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    }

    loadState();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SEARCH_KEY, searchText).catch((error) =>
      console.error("Failed to save searchText:", error),
    );
  }, [searchText]);

  useEffect(() => {
    AsyncStorage.setItem(MUSCLE_KEY, selectedMuscle).catch((error) =>
      console.error("Failed to save selectedMuscle:", error),
    );
  }, [selectedMuscle]);

  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);

        const response: LaravelPaginatedResponse<Exercise> =
          await Exercises.getAll(1, 100);

        setExercises(response.data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const visibleExercises = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesMuscle =
        selectedMuscle === "all" ||
        (exercise.target_muscle || "")
          .toLowerCase()
          .includes(selectedMuscle.toLowerCase());

      const matchesSearch =
        normalizedSearch.length === 0 ||
        exercise.name.toLowerCase().includes(normalizedSearch) ||
        (exercise.target_muscle || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (exercise.category || "").toLowerCase().includes(normalizedSearch);

      return matchesMuscle && matchesSearch;
    });
  }, [exercises, searchText, selectedMuscle]);

  function toggleExercise(exercise: Exercise) {
    const key = String(exercise.id ?? exercise.name);

    setSelectedExercises((prev) => {
      const hasKey = prev.includes(key);
      if (hasKey) {
        return prev.filter((item) => item !== key);
      }
      return [...prev, key];
    });
  }

  function handleAddSelectedExercises() {
    if (!navData || !navData.returnTo) {
      Alert.alert("Error", "Missing return page");
      return;
    }

    if (selectedExercises.length === 0) {
      return;
    }

    router.push({
      pathname: "/(private)/exercises/ExerciseDetailsScreen",
      params: {
        selectedIds: selectedExercises.join(","),
      },
    });
  }

  return {
    exercises: visibleExercises,
    loading,
    searchText,
    setSearchText,
    selectedMuscle,
    setSelectedMuscle,
    selectedExercises,
    selectedCount: selectedExercises.length,
    toggleExercise,
    handleAddSelectedExercises,
    muscleFilters,
  };
}
