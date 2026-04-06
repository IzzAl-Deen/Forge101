import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDeferredValue, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseCategoryChip } from "@/components/exercises/exercise-category-chip";
import { ExerciseSearchInput } from "@/components/exercises/exercise-search-input";
import { ExerciseSelectableCard } from "@/components/exercises/exercise-selectable-card";
import { Fonts, Kinetic } from "@/constants/theme";
import { useExerciseCatalog } from "@/hooks/use-exercise-catalog";
import type { Exercise } from "@/types/exercise";

type ExerciseSelectionScreenProps = {
  onDone?: () => void;
  onAddSelected?: (selectedExercises: Exercise[]) => void | Promise<void>;
  planId?: string | null;
  planName?: string | null;
  showFooterPreview?: boolean;
  initialExercises?: Exercise[];
  useLiveCatalog?: boolean;
  helperText?: string | null;
};

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function toDisplayLabel(value: string) {
  return value
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getExerciseTags(exercise: Exercise) {
  return exercise.target_muscle
    .split(/[,&/]/)
    .map((part) => normalizeTag(part))
    .filter(Boolean);
}

function getSearchableText(exercise: Exercise) {
  return [
    exercise.name,
    exercise.description,
    exercise.target_muscle,
    exercise.category,
    exercise.difficulty,
  ]
    .join(" ")
    .toLowerCase();
}

function createCategoryOptions(exercises: Exercise[]) {
  const seen = new Set<string>();
  const categories: string[] = ["all"];

  exercises.forEach((exercise) => {
    getExerciseTags(exercise).forEach((tag) => {
      if (!seen.has(tag)) {
        seen.add(tag);
        categories.push(tag);
      }
    });
  });

  return categories;
}

function FooterPreview() {
  const items = [
    { icon: "crosshair", label: "Plans", selected: false },
    { icon: "plus-square", label: "Builder", selected: true },
    { icon: "grid", label: "Exercises", selected: false },
    { icon: "user", label: "Profile", selected: false },
  ] as const;

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => (
        <View key={item.label} style={[styles.bottomNavItem, item.selected && styles.bottomNavItemActive]}>
          <Feather
            color={item.selected ? Kinetic.accentLight : "rgba(255,255,255,0.55)"}
            name={item.icon}
            size={18}
          />
          <Text style={[styles.bottomNavLabel, item.selected && styles.bottomNavLabelActive]}>
            {item.label.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ExerciseSelectionScreen({
  onDone,
  onAddSelected,
  planId,
  planName,
  showFooterPreview = true,
  initialExercises,
  useLiveCatalog = true,
  helperText,
}: ExerciseSelectionScreenProps) {
  const { exercises, isLoading, isRefreshing, error, refresh, reload } = useExerciseCatalog({
    enabled: useLiveCatalog,
    initialExercises,
  });
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const deferredSearchValue = useDeferredValue(searchValue);

  const categoryOptions = createCategoryOptions(exercises);

  useEffect(() => {
    if (selectedCategory !== "all" && !categoryOptions.includes(selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [categoryOptions, selectedCategory]);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory === "all" || getExerciseTags(exercise).includes(selectedCategory);

    if (!matchesCategory) {
      return false;
    }

    const normalizedQuery = deferredSearchValue.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return getSearchableText(exercise).includes(normalizedQuery);
  });

  const selectedExercises = exercises.filter((exercise) => selectedIds.includes(exercise.id));

  function toggleExercise(exerciseId: number) {
    setSelectedIds((current) =>
      current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId]
    );
  }

  async function handleAddSelected() {
    if (!selectedExercises.length) {
      return;
    }

    if (onAddSelected) {
      await onAddSelected(selectedExercises);
      return;
    }

    Alert.alert(
      "Selection staged",
      `Picked ${selectedExercises.length} exercise${selectedExercises.length === 1 ? "" : "s"}${
        planName ? ` for ${planName}` : ""
      }. The UI is ready, but the final plan flow still needs to provide sets, reps, and day before calling the backend attach endpoint.`
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable hitSlop={10} onPress={onDone} style={styles.headerIconButton}>
            <Feather color={Kinetic.accentLight} name="arrow-left" size={24} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>SELECT EXERCISES</Text>
            {planName ? <Text style={styles.planCaption}>For {planName}</Text> : null}
          </View>
        </View>

        <Pressable hitSlop={10} onPress={onDone}>
          <Text style={styles.doneText}>DONE</Text>
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.stateBlock}>
              <ActivityIndicator color={Kinetic.accentPrimary} size="large" />
              <Text style={styles.stateTitle}>Loading exercise library</Text>
              <Text style={styles.stateBody}>Pulling every exercise currently available in the database.</Text>
            </View>
          ) : error ? (
            <View style={styles.stateBlock}>
              <Text style={styles.stateTitle}>We could not load exercises</Text>
              <Text style={styles.stateBody}>{error}</Text>
              <Pressable onPress={reload} style={styles.retryButton}>
                <Text style={styles.retryText}>TRY AGAIN</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.stateBlock}>
              <Text style={styles.stateTitle}>No exercises match this filter</Text>
              <Text style={styles.stateBody}>Try another muscle group or clear the search to see more results.</Text>
            </View>
          )
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <ExerciseSearchInput onChangeText={setSearchValue} value={searchValue} />

            <ScrollView
              contentContainerStyle={styles.categoryRow}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {categoryOptions.map((option) => (
                <ExerciseCategoryChip
                  key={option}
                  label={option === "all" ? "All" : toDisplayLabel(option)}
                  onPress={() => setSelectedCategory(option)}
                  selected={selectedCategory === option}
                />
              ))}
            </ScrollView>

            {!isLoading && !error ? (
              <Text style={styles.resultCount}>
                {filteredExercises.length} of {exercises.length} exercises
              </Text>
            ) : null}
          </View>
        }
        refreshControl={
          <RefreshControl
            onRefresh={refresh}
            progressBackgroundColor="#141414"
            refreshing={isRefreshing}
            tintColor={Kinetic.accentPrimary}
          />
        }
        renderItem={({ item }) => (
          <ExerciseSelectableCard
            exercise={item}
            onToggle={() => toggleExercise(item.id)}
            selected={selectedIds.includes(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Pressable
          disabled={!selectedExercises.length}
          onPress={() => {
            void handleAddSelected();
          }}
          style={({ pressed }) => [styles.ctaWrap, pressed && selectedExercises.length ? styles.ctaPressed : null]}>
          <LinearGradient
            colors={["#f2ffc0", "#d8ff3f", "#c2ff05"]}
            end={{ x: 1, y: 0.5 }}
            start={{ x: 0, y: 0.5 }}
            style={[styles.ctaButton, !selectedExercises.length && styles.ctaButtonDisabled]}>
            <Text style={styles.ctaText}>ADD SELECTED EXERCISES</Text>
            <View style={styles.countBubble}>
              <Text style={styles.countBubbleText}>{selectedExercises.length}</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {showFooterPreview ? <FooterPreview /> : null}

        {helperText ? (
          <Text style={styles.footerHint}>{helperText}</Text>
        ) : planId ? (
          <Text style={styles.footerHint}>Plan reference ready: #{planId}</Text>
        ) : (
          <Text style={styles.footerHint}>
            Builder hookup pending. This screen already reads from the live exercise table.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    alignItems: "center",
    backgroundColor: "#161616",
    borderColor: "rgba(255,255,255,0.04)",
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bottomNavItem: {
    alignItems: "center",
    borderRadius: 18,
    gap: 6,
    minWidth: 78,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bottomNavItemActive: {
    backgroundColor: "rgba(184,255,26,0.12)",
    shadowColor: Kinetic.accentPrimary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  bottomNavLabel: {
    color: "rgba(255,255,255,0.55)",
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  bottomNavLabelActive: {
    color: Kinetic.accentLight,
  },
  countBubble: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 999,
    height: 28,
    justifyContent: "center",
    minWidth: 28,
    paddingHorizontal: 8,
  },
  countBubbleText: {
    color: "#384200",
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: "800",
  },
  ctaButton: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  ctaButtonDisabled: {
    opacity: 0.45,
  },
  ctaPressed: {
    opacity: 0.94,
  },
  ctaText: {
    color: "#485000",
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  ctaWrap: {
    shadowColor: Kinetic.accentPrimary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  doneText: {
    color: Kinetic.accentLight,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  footer: {
    backgroundColor: "#0d0d0d",
    gap: 16,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },
  footerHint: {
    color: Kinetic.textFaint,
    fontFamily: Fonts.sans,
    fontSize: 12,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#0d0d0d",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 18,
  },
  headerIconButton: {
    paddingRight: 2,
  },
  headerLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  headerTitle: {
    color: Kinetic.accentLight,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  listContent: {
    gap: 16,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  listHeader: {
    gap: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  planCaption: {
    color: Kinetic.textFaint,
    fontFamily: Fonts.sans,
    fontSize: 12,
    marginTop: 4,
  },
  categoryRow: {
    gap: 12,
    paddingRight: 22,
  },
  resultCount: {
    color: Kinetic.textFaint,
    fontFamily: Fonts.sans,
    fontSize: 13,
    letterSpacing: 0.3,
    paddingHorizontal: 2,
  },
  retryButton: {
    backgroundColor: "#1f1f1f",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: {
    color: Kinetic.accentLight,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  safeArea: {
    backgroundColor: "#0d0d0d",
    flex: 1,
  },
  stateBlock: {
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 42,
  },
  stateBody: {
    color: Kinetic.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  stateTitle: {
    color: Kinetic.white,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
});
