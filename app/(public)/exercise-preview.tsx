import { useRouter } from "expo-router";

import { ExerciseSelectionScreen } from "@/components/exercises/exercise-selection-screen";
import { exercisePreviewData } from "@/constants/exercise-preview-data";

export default function PublicExercisePreviewScreen() {
  const router = useRouter();

  return (
    <ExerciseSelectionScreen
      helperText="Public preview mode: using schema-shaped demo exercises so you can test on the emulator without signing in."
      initialExercises={exercisePreviewData}
      onDone={() => router.back()}
      planId="preview-plan"
      planName="Preview Builder Plan"
      useLiveCatalog={false}
    />
  );
}
