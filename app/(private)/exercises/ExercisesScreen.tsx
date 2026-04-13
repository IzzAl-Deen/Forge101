import { Exercise } from "@/api/exerciseApi";
import { AddSelectedExercisesButton } from "@/components/AddSelectedExercisesButton";
import { ExerciseSelectionCard } from "@/components/ExerciseSelectionCard";
import { ExercisesScreenHeader } from "@/components/ExercisesScreenHeader";
import { MuscleFilterChips } from "@/components/MuscleFilterChips";
import { SearchBar } from "@/components/SearchBar";
import { useExercisesScreen } from "@/hooks/use-exercises-screen";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExercisesScreen() {
  const {
    exercises,
    loading,
    searchText,
    setSearchText,
    selectedMuscle,
    setSelectedMuscle,
    selectedExercises,
    selectedCount,
    toggleExercise,
    handleAddSelectedExercises,
    muscleFilters,
  } = useExercisesScreen();

  function renderExerciseItem({ item }: { item: Exercise }) {
    const key = String(item.id ?? item.name);
    const isSelected = selectedExercises.includes(key);

    return (
      <ExerciseSelectionCard
        exercise={item}
        isSelected={isSelected}
        onPress={() => toggleExercise(item)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ExercisesScreenHeader />

        <SearchBar value={searchText} onChangeText={setSearchText} />

        <FlatList
          data={exercises}
          keyExtractor={(item) => String(item.id ?? item.name)}
          renderItem={renderExerciseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <MuscleFilterChips
              filters={muscleFilters}
              selectedMuscle={selectedMuscle}
              onSelectMuscle={setSelectedMuscle}
            />
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#d7ff17" />
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

        <AddSelectedExercisesButton
          selectedCount={selectedCount}
          onPress={handleAddSelectedExercises}
        />
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
  listContent: {
    paddingBottom: 148,
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
  footerSpacer: {
    height: 14,
  },
});
