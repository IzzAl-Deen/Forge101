import { ExerciseDetailCard } from "@/components/ExerciseDetailCard";
import { ExerciseDetailsHeader } from "@/components/ExerciseDetailsHeader";
import { SaveExercisesButton } from "@/components/SaveExercisesButton";
import {
  useExerciseDetails,
  type ExerciseFormItem,
} from "@/hooks/use-exercise-details";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseDetailsScreen() {
  const {
    items,
    loading,
    saving,
    updateItem,
    toggleDay,
    handleSaveExercises,
    weekDays,
  } = useExerciseDetails();

  function renderItem({ item }: { item: ExerciseFormItem }) {
    return (
      <ExerciseDetailCard
        item={item}
        onUpdateItem={updateItem}
        onToggleDay={toggleDay}
        weekDays={weekDays}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ExerciseDetailsHeader />

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#d7ff17" />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.exercise_id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No exercises selected</Text>
              </View>
            }
          />
        )}

        <SaveExercisesButton
          itemCount={items.length}
          saving={saving}
          onPress={handleSaveExercises}
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
    paddingBottom: 120,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
