import Plans from "@/api/plansApi";
import { PendingExercise } from "@/components/plan-exercises";
import PlanForm from "@/components/planform";
import SuccessModal from "@/components/success-plan-modal";
import { Plan } from "@/types/plan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";

export default function EditPlanScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { id } = useLocalSearchParams();
  const [plan, setPlan] = useState<Omit<Plan, "user_id"> | null>(null);

  const loadPlan = useCallback(async () => {
    try {
      const data = await Plans.getById(Number(id));

      setPlan({
        name: data.name,
        difficulty: data.difficulty,
        duration_minutes: data.duration_minutes,
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed loading plan");
    }
  }, [id]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  useEffect(() => {
    AsyncStorage.getItem("selectedExercises")
        .then((saved) => {
          const parsed = saved ? JSON.parse(saved) : null;

          Plans.getExercises(Number(id))
              .then((res) => {

                const groupedExercises = res.exercises.reduce(
                    (acc: any[], ex: any) => {

                      const key = `${ex.id}-${ex.pivot?.sets}-${ex.pivot?.reps}`;

                      const existing = acc.find((item) => item.key === key);

                      if (existing) {
                        const day = ex.pivot?.day;

                        if (day && !existing.day.includes(day)) {
                          existing.day.push(day);
                        }

                      } else {
                        acc.push({
                          key,
                          exercise_id: ex.id,
                          name: ex.name,
                          sets: String(ex.pivot?.sets || ""),
                          reps: String(ex.pivot?.reps || ""),
                          day: ex.pivot?.day ? [ex.pivot.day] : [],
                        });
                      }

                      return acc;
                    },
                    []
                );

                if (parsed) {
                  setExercises([...groupedExercises, ...parsed]);
                  AsyncStorage.removeItem("selectedExercises");
                } else {
                  setExercises(groupedExercises);
                }
              })
              .catch((err) => {
                console.error(err);
                Alert.alert("Error", "Failed loading exercises");
              });
        })
        .catch(console.error);
  }, [id]);

  const handleUpdate = async (updated: Omit<Plan, "user_id">) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await Plans.update(Number(id), updated as Plan);

      const existing = await Plans.getExercises(Number(id));

      await Promise.all(
          existing.exercises.map((ex: any) =>
              Plans.deleteExercise(Number(id), ex.id)
          )
      );

      let orderIndex = 1;

      const requests = exercises.flatMap((exercise) => {
        const days = exercise.day.length ? exercise.day : ["monday"];

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

      AsyncStorage.removeItem("ExercisesScreen.navData");
      AsyncStorage.removeItem("PlanForm.data");

    } catch (err) {
      console.error(err);
      Alert.alert("Update failed");
    } finally {
      setIsSaving(false);
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

  if (!plan)
    return (
        <ActivityIndicator
            size={32}
            color={"#ccff00"}
            style={styles.container}
        />
    );

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <PlanForm
            initialValues={plan}
            planId={Number(id)}
            exercises={exercises}
            submitLabel={isSaving ? "UPDATING..." : "UPDATE PLAN"}
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
});