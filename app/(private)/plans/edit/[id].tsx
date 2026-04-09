import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import Plans from "@/api/plansApi";
import PlanForm from "@/components/planform";
import { PendingExercise } from "@/components/plan-exercises";
import { Plan } from "@/types/plan";
import SuccessModal from "@/components/success-plan-modal";
import useSelectedExercises from "@/hooks/use-selected-exercises";


export default function EditPlanScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);

  const { id, selectedExercises } = useLocalSearchParams();

  const [plan, setPlan] =
    useState<Omit<Plan, "user_id"> | null>(null);

  const loadPlan = useCallback(async () => {
    try {
      const data = await Plans.getById(Number(id));

      setPlan({
        name: data.name,
        difficulty: data.difficulty,
        duration_minutes: data.duration_minutes,
      });

      if (!selectedExercises) {
        const exercisesData = await Plans.getExercises(Number(id));

        setExercises(
          exercisesData.exercises.map((ex: any) => ({
            exercise_id: ex.id,
            name: ex.name,
            sets: String(ex.pivot?.sets || ""),
            reps: String(ex.pivot?.reps || ""),
            day: ex.pivot?.day ? [ex.pivot.day] : [],
          }))
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed loading plan");
    }
  }, [id, selectedExercises]);

  useEffect(() => {
      loadPlan();
  }, [loadPlan]);

  const handleUpdate = async (
    updated: Omit<Plan, "user_id">
  ) => {
    try {
      await Plans.update(Number(id), updated as Plan);

      let orderIndex = 1;
      const existing = await Plans.getExercises(Number(id));
      await Promise.all(
        existing.exercises.map((ex: any) =>
          Plans.deleteExercise(Number(id), ex.id)
        )
      );

      const requests = exercises.flatMap((exercise) => {
        const days = exercise.day.length > 0 ? exercise.day : ["monday"];

        return days.map((day) =>
          Plans.attachExercise(Number(id), {
            exercise_id: exercise.exercise_id,
            sets: Number(exercise.sets) || 0,
            reps: Number(exercise.reps) || 0,
            day,
            order_index: orderIndex++,
          })
        );
      });

      await Promise.all(requests);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await Plans.delete(Number(id));
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Delete failed");
    }
  };

  useSelectedExercises(setExercises);

  if (!plan) return <ActivityIndicator />;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <PlanForm
        initialValues={plan}
        planId={Number(id)}
        exercises={exercises}
        submitLabel="UPDATE PLAN"
        onSubmit={handleUpdate}
        onExercisesChange={setExercises}
        onDelete={handleDelete}
      />
      <SuccessModal
        visible={modalVisible}
        message="Success!"
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
  },
});
