import React from "react";
import { Alert } from "react-native";
import PlanForm from "@/components/planform";
import Plans from "@/api/plansApi";
import { supabase } from "@/lib/supabase";
import { Plan } from "@/types/plan";
import { ScrollView } from "react-native";
import { StyleSheet, Text } from "react-native";
import SuccessModal from "@/components/success-plan-modal";
import { useState } from "react";


export default function CreatePlanScreen() {
  const [modalVisible, setModalVisible] = useState(false);

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

      setModalVisible(true);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Create failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlanForm submitLabel="SAVE PLAN" onSubmit={handleCreate} />

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