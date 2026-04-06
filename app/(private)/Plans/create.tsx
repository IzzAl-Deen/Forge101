import { useLocalSearchParams, useRouter } from "expo-router";

import { ExerciseSelectionScreen } from "@/components/exercises/exercise-selection-screen";

export default function CreatePlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    planId?: string;
    planName?: string;
  }>();

  return (
    <ExerciseSelectionScreen
      onDone={() => router.back()}
      planId={params.planId ?? null}
      planName={params.planName ?? null}
    />
  );
}
