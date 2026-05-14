import  { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as FileSystem from 'expo-file-system/legacy';

import PlanForm from "@/components/planform";
import SuccessModal from "@/components/success-plan-modal";
import useSelectedExercises from "@/hooks/use-selected-exercises";
import { supabase } from "@/lib/supabase";
import Plans from "@/api/plansApi";
import { PendingExercise } from "@/components/plan-exercises";

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
      let finalImageUrl = null;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      if (selectedImage) {
        const fileExt = selectedImage.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `plans/${fileName}`;

        const base64 = await FileSystem.readAsStringAsync(selectedImage, {
          encoding: 'base64' as any,
        });

        const arrayBuffer = base64ToArrayBuffer(base64);

        const { error: uploadError } = await supabase.storage
            .from('plans')
            .upload(filePath, arrayBuffer, {
              contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
              upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('plans')
            .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      return Plans.create({
        name: data.name,
        difficulty: data.difficulty,
        duration_minutes: parseInt(data.duration_minutes),
        image_url: finalImageUrl,
        user_id: session.user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setModalVisible(true);
      setSelectedImage(null);
      AsyncStorage.removeItem(IMAGE_STORAGE_KEY);
      AsyncStorage.removeItem(FORM_DATA_KEY);
    },
    onError: (error: any) => {
      console.error("Creation Error:", error);
      Alert.alert("Error", error.message || "Failed to create plan");
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
