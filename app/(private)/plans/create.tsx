import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import PlanForm from "@/components/planform";
import SuccessModal from "@/components/success-plan-modal";
import useSelectedExercises from "@/hooks/use-selected-exercises";
import { supabase } from "@/lib/supabase";
import Plans from "@/api/plansApi";
import { PendingExercise } from "@/components/plan-exercises";

export default function CreatePlanScreen() {
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useSelectedExercises(setExercises);

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      let imageUrl: string | null = null;

      // رفع الصورة
      if (selectedImage) {
        const fileExt = selectedImage.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `plans/${fileName}`;

        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
            .from('plans')
            .upload(filePath, blob, {
              contentType: `image/${fileExt}`,
              upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
            .from('plans')
            .getPublicUrl(filePath);

        imageUrl = publicUrl.publicUrl;
      }

      // 1. إنشاء الـ Plan
      const createdPlan = await Plans.create({
        name: data.name,
        difficulty: data.difficulty,
        duration_minutes: parseInt(data.duration_minutes),
        image_url: imageUrl,
        user_id: session.user.id,
      });

      const planId = createdPlan.id || createdPlan.plan?.id || createdPlan.data?.id;

      if (!planId) throw new Error("Failed to get plan ID");

      // 2. إضافة التمارين (نفس طريقة الـ Edit)
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

      return createdPlan;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setModalVisible(true);
      setSelectedImage(null);
    },

    onError: (error: any) => {
      console.error(error);
      Alert.alert("Error", error?.message || "Failed to create plan");
    }
  });

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <PlanForm
            exercises={exercises}
            submitLabel={createPlanMutation.isPending ? "CREATING PLAN..." : "SAVE PLAN"}
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
    padding: 24
  },
});