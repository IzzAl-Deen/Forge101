import Plans from "@/api/plansApi";
import { PendingExercise } from "@/components/plan-exercises";
import PlanForm from "@/components/planform";
import SuccessModal from "@/components/success-plan-modal";
import useSelectedExercises from "@/hooks/use-selected-exercises";
import { supabase } from "@/lib/supabase";
import { Plan } from "@/types/plan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

export default function CreatePlanScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);

  useSelectedExercises(setExercises);

  const handleCreate = async (data: Omit<Plan, "user_id">) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      const createdPlan = await Plans.create({
        ...data,
        user_id: session.user.id,
      });

      const createdPlanId = Number(
        createdPlan?.id ?? createdPlan?.plan?.id ?? createdPlan?.data?.id,
      );

      if (!createdPlanId) {
        console.error("Create plan response:", createdPlan);
        Alert.alert("Error", "Plan created but id was not found");
        return;
      }

      let orderIndex = 1;

      for (const exercise of exercises) {
        const days = exercise.day.length > 0 ? exercise.day : ["monday"];

        for (const day of days) {
          await Plans.attachExercise(createdPlanId, {
            exercise_id: exercise.exercise_id,
            sets: Number(exercise.sets) || 0,
            reps: Number(exercise.reps) || 0,
            day,
            order_index: orderIndex,
          });

          orderIndex += 1;
        }
      }

      setModalVisible(true);
      AsyncStorage.removeItem("ExercisesScreen.navData").catch(console.error);
      AsyncStorage.removeItem("PlanForm.data").catch(console.error);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Create failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlanForm
        exercises={exercises}
        submitLabel="SAVE PLAN"
        onSubmit={handleCreate}
        onExercisesChange={setExercises}
      />

      <SuccessModal
        visible={modalVisible}
        message="Plan created successfully!"
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
