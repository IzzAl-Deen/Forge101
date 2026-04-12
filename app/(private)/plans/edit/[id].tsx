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
        if (saved) {
          const parsed = JSON.parse(saved);
          if (exercises.length === 0) {
            Plans.getExercises(Number(id))
              .then((exercisesData) => {
                const oldExercises = exercisesData.exercises.map((ex: any) => ({
                  exercise_id: ex.id,
                  name: ex.name,
                  sets: String(ex.pivot?.sets || ""),
                  reps: String(ex.pivot?.reps || ""),
                  day: ex.pivot?.day ? [ex.pivot.day] : [],
                }));
                setExercises([...oldExercises, ...parsed]);
                AsyncStorage.removeItem("selectedExercises").catch(
                  console.error,
                );
              })
              .catch((err) => {
                console.error(err);
                Alert.alert("Error", "Failed loading exercises");
              });
          } else {
            setExercises((prev) => [...prev, ...parsed]);
            AsyncStorage.removeItem("selectedExercises").catch(console.error);
          }
        } else if (exercises.length === 0) {
          Plans.getExercises(Number(id))
            .then((exercisesData) => {
              setExercises(
                exercisesData.exercises.map((ex: any) => ({
                  exercise_id: ex.id,
                  name: ex.name,
                  sets: String(ex.pivot?.sets || ""),
                  reps: String(ex.pivot?.reps || ""),
                  day: ex.pivot?.day ? [ex.pivot.day] : [],
                })),
              );
            })
            .catch((err) => {
              console.error(err);
              Alert.alert("Error", "Failed loading exercises");
            });
        }
      })
      .catch(console.error);
  }, [id, exercises.length]);

  const handleUpdate = async (updated: Omit<Plan, "user_id">) => {
    try {
      await Plans.update(Number(id), updated as Plan);

      let orderIndex = 1;
      const existing = await Plans.getExercises(Number(id));
      await Promise.all(
        existing.exercises.map((ex: any) =>
          Plans.deleteExercise(Number(id), ex.id),
        ),
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
          }),
        );
      });

      await Promise.all(requests);
      setModalVisible(true);
      AsyncStorage.removeItem("ExercisesScreen.navData").catch(console.error);
      AsyncStorage.removeItem("PlanForm.data").catch(console.error);
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

  useEffect(() => {
    AsyncStorage.getItem("selectedExercises")
      .then((saved) => {
        if (saved) {
          const parsed = JSON.parse(saved);
          setExercises((prev) => [...prev, ...parsed]);
          AsyncStorage.removeItem("selectedExercises").catch(console.error);
        }
      })
      .catch(console.error);
  }, []);

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
