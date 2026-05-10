import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import PlanForm from "@/components/planform";
import SuccessModal from "@/components/success-plan-modal";
import useSelectedExercises from "@/hooks/use-selected-exercises";
import { supabase } from "@/lib/supabase";
import Plans from "@/api/plansApi";
import { PendingExercise } from "@/components/plan-exercises";

const IMAGE_STORAGE_KEY = "PlanForm.selectedImage";
const FORM_DATA_KEY = "PlanForm.data";
export default function CreatePlanScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<PendingExercise[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const queryClient = useQueryClient();
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
      AsyncStorage.setItem(IMAGE_STORAGE_KEY, selectedImage).catch(console.error);
    } else {
      AsyncStorage.removeItem(IMAGE_STORAGE_KEY).catch(console.error);
    }
  }, [selectedImage]);

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('difficulty', data.difficulty);
      formData.append('duration_minutes', data.duration_minutes.toString());

      if (selectedImage) {
        const filename = selectedImage.split('/').pop() || 'plan.jpg';
        formData.append('image', {
          uri: selectedImage,
          name: filename,
          type: 'image/jpeg',
        } as any);
      }

      return Plans.createWithImage(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });

      setModalVisible(true);
      setSelectedImage(null);
      AsyncStorage.removeItem(IMAGE_STORAGE_KEY);
      AsyncStorage.removeItem(FORM_DATA_KEY);
    },
    onError: (error: any) => {
      console.error(error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to create plan");
    }
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
