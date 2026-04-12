import Exercises, {
  Exercise,
  LaravelPaginatedResponse,
} from "@/api/exerciseApi";
import { Kinetic } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const muscleFilters = ["all", "chest", "back", "legs", "arms"];

export default function ExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [navData, setNavData] = useState<{
    planId: string;
    returnId: string;
    returnTo: string;
    planName: string;
    planDifficulty: string;
    planDuration: string;
  } | null>(null);

  const SEARCH_KEY = "ExercisesScreen.searchText";
  const MUSCLE_KEY = "ExercisesScreen.selectedMuscle";
  const NAV_KEY = "ExercisesScreen.navData";

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

  const selectedCount = selectedExercises.length;

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

    setSelectedExercises((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  async function handleAddSelectedExercises() {
    if (!navData?.returnTo) {
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

  function renderExerciseItem({ item }: { item: Exercise }) {
    const key = String(item.id ?? item.name);
    const isSelected = selectedExercises.includes(key);

    return (
      <Pressable
        onPress={() => toggleExercise(item)}
        style={[styles.card, isSelected && styles.cardSelected]}
      >
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
          <Text style={styles.cardMeta}>
            {capitalize(item.category || "strength")} {"\u2022"}{" "}
            {item.video_url ? "Video" : "Equipment"}
          </Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected ? (
            <MaterialIcons name="check" size={22} color="#101010" />
          ) : null}
        </View>
      </Pressable>
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
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={Kinetic.accentLight}
            />
          </Pressable>

          <Text style={styles.headerTitle}>SELECT EXERCISES</Text>

          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Text style={styles.doneText}>DONE</Text>
          </Pressable>
        </View>

        <View style={styles.searchWrapper}>
          <MaterialIcons
            name="search"
            size={22}
            color="rgba(255,255,255,0.35)"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search exercises"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={visibleExercises}
          keyExtractor={(item) => String(item.id ?? item.name)}
          renderItem={renderExerciseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {muscleFilters.map((item) => {
                const isActive = selectedMuscle === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setSelectedMuscle(item)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {item.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={Kinetic.accentPrimary} />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No exercises found</Text>
                <Text style={styles.emptyText}>
                  Try another search term or choose a different filter.
                </Text>
              </View>
            )
          }
          ListFooterComponent={<View style={styles.footerSpacer} />}
        />

        <Pressable
          style={[
            styles.ctaWrapper,
            selectedCount === 0 && styles.ctaWrapperDisabled,
          ]}
          disabled={selectedCount === 0}
          onPress={handleAddSelectedExercises}
        >
          <LinearGradient
            colors={["#eff8c6", "#d0ff00"]}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 1, y: 0.6 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>ADD SELECTED EXERCISES</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{selectedCount}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function capitalize(value: string) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
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
  doneText: {
    color: "#eef6c8",
    fontSize: 15,
    fontWeight: "800",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    backgroundColor: "#232323",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
  },
  filterRow: {
    paddingBottom: 18,
    gap: 10,
  },
  filterChip: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 17,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: "#d7ff17",
  },
  filterChipText: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  filterChipTextActive: {
    color: "#121212",
  },
  listContent: {
    paddingBottom: 148,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  cardSelected: {
    backgroundColor: "#1a1a18",
    borderColor: "rgba(215,255,23,0.26)",
    shadowColor: "#d7ff17",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: 78,
    height: 78,
    borderRadius: 12,
    backgroundColor: "#202020",
    marginRight: 16,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    paddingRight: 12,
  },
  cardTag: {
    color: "#e7efbb",
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 6,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 4,
  },
  cardMeta: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 15,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171717",
  },
  checkboxSelected: {
    backgroundColor: "#d7ff17",
    borderColor: "#d7ff17",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  emptyText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  footerLoader: {
    marginTop: 4,
    marginBottom: 24,
  },
  footerSpacer: {
    height: 14,
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
  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    paddingHorizontal: 8,
  },
  countText: {
    color: "#506100",
    fontSize: 15,
    fontWeight: "900",
  },
});
