import React from "react";
import { Alert } from "react-native";
import PlanForm from "@/components/planform";
import Plans from "@/api/plansApi";
import { supabase } from "@/lib/supabase";
import { Plan } from "@/types/plan";

export default function CreatePlanScreen() {

  const handleCreate = async (
    data: Omit<Plan, "user_id">
  ) => {
    try {
      const { data: { session } } =
        await supabase.auth.getSession();

      if (!session?.user) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      await Plans.create({
        ...data,
        user_id: session.user.id,
      });

      Alert.alert("Success", "Plan created");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Create failed");
    }
  };

  return (
    <PlanForm
      submitLabel="Create Plan"
      onSubmit={handleCreate}
    />
  );
}