import Plans from "@/api/plansApi";
import { PendingExercise } from "@/components/plan-exercises";
import PlanForm from "@/components/planform";
import SuccessModal from "@/components/success-plan-modal";
import useSelectedExercises from "@/hooks/use-selected-exercises";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

const IMAGE_STORAGE_KEY = "PlanForm.selectedImage";
const FORM_DATA_KEY = "PlanForm.data";

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export default function CreatePlanScreen() {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useSelectedExercises(setExercises);

  useEffect(() => {
    AsyncStorage.getItem(IMAGE_STORAGE_KEY)
      .then((savedImage) => {
        if (savedImage) setSelectedImage(savedImage);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      AsyncStorage.setItem(IMAGE_STORAGE_KEY, selectedImage).catch(
        console.error,
      );
    } else {
      AsyncStorage.removeItem(IMAGE_STORAGE_KEY).catch(console.error);
    }
  }, [selectedImage]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Step 1: start");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Step 2: session", session?.user?.id);
      if (!session?.user) throw new Error("Not authenticated");

      let finalImageUrl: string | null = null;

      if (selectedImage) {
        console.log("Step 3: uploading image");
        const fileExt = selectedImage.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `plans/${fileName}`;

        const base64 = await FileSystem.readAsStringAsync(selectedImage, {
          encoding: "base64" as any,
        });

        const arrayBuffer = base64ToArrayBuffer(base64);

        const { error: uploadError } = await supabase.storage
          .from("plans")
          .upload(filePath, arrayBuffer, {
            contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("plans")
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
        console.log("Step 4: image uploaded", finalImageUrl);
      }

      console.log("Step 5: creating plan");
      const createdPlan = await Plans.create({
        name: data.name,
        difficulty: data.difficulty,
        duration_minutes: parseInt(data.duration_minutes),
        image_url: finalImageUrl,
        user_id: session.user.id,
        created_by_user_id: session.user.id,
      });
      console.log("Step 6: plan created", createdPlan);

      const planId =
        createdPlan.id || createdPlan.plan?.id || createdPlan.data?.id;
      if (!planId) throw new Error("Failed to get plan ID");

      console.log("Step 7: attaching exercises", exercises.length);
      let orderIndex = 1;
      for (const exercise of exercises) {
        const days = exercise.day?.length > 0 ? exercise.day : ["monday"];
        for (const day of days) {
          await Plans.attachExercise(planId, {
            exercise_id: exercise.exercise_id,
            sets: Number(exercise.sets) || 0,
            reps: Number(exercise.reps) || 0,
            day: day,
            order_index: orderIndex++,
          });
        }
      }
      console.log("Step 8: done");

      return createdPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setModalVisible(true);
      setSelectedImage(null);
      AsyncStorage.removeItem(IMAGE_STORAGE_KEY).catch(console.error);
      AsyncStorage.removeItem(FORM_DATA_KEY).catch(console.error);
    },
    onError: (error: any) => {
      console.error("message:", error?.message);
      console.error("status:", error?.response?.status);
      console.error("data:", error?.response?.data);
      Alert.alert("Error", error?.message || "Failed to create plan");
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlanForm
        exercises={exercises}
        submitLabel={
          createPlanMutation.isPending ? "CREATING PLAN..." : "SAVE PLAN"
        }
        onSubmit={(data) => createPlanMutation.mutate(data)}
        onExercisesChange={setExercises}
        disabled={createPlanMutation.isPending}
        selectedImage={selectedImage}
        onPickImage={pickImage}
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
});
