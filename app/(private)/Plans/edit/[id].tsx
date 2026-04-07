import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ActivityIndicator, ScrollView } from "react-native";
import Plans from "@/api/plansApi";
import PlanForm from "@/components/planform";
import { Plan } from "@/types/plan";
import { StyleSheet, Text } from "react-native";
import SuccessModal from "@/components/success-plan-modal";



export default function EditPlanScreen() {
  const [modalVisible, setModalVisible] = useState(false);

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

  if (!plan) return <ActivityIndicator />;

  return (
    <ScrollView contentContainerStyle={styles.container}>

    <PlanForm initialValues={plan} submitLabel="UPDATE PLAN" onSubmit={handleUpdate} onDelete={handleDelete}/>
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