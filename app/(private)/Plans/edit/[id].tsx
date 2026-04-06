import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import Plans from "@/api/plansApi";
import PlanForm from "@/components/planform";
import { Plan } from "@/types/plan";

export default function EditPlanScreen() {
  const { id } = useLocalSearchParams();

  const [plan, setPlan] =
    useState<Omit<Plan, "user_id"> | null>(null);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
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
  };

  const handleUpdate = async (
    updated: Omit<Plan, "user_id">
  ) => {
    try {
      await Plans.update(Number(id), updated as Plan);

      Alert.alert("Success", "Plan updated");
    } catch (err) {
      console.error(err);
      Alert.alert("Update failed");
    }
  };

  if (!plan) return <ActivityIndicator />;

  return (
    <PlanForm
      initialValues={plan}
      submitLabel="Update Plan"
      onSubmit={handleUpdate}
    />
  );
}