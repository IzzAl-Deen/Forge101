import { Plan } from "@/types/plan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Props = {
  planId?: number;
  form: Omit<Plan, "user_id">;
};

export const useAddExercise = ({ planId, form }: Props) => {
  const router = useRouter();

  const addExercise = async () => {
    const navData = {
      planId: planId ? String(planId) : "",
      returnTo: planId
        ? "/(private)/plans/edit/[id]"
        : "/(private)/plans/create",
      returnId: planId ? String(planId) : "",
      planName: form.name,
      planDifficulty: form.difficulty,
      planDuration: String(form.duration_minutes),
    };

    await AsyncStorage.setItem(
      "ExercisesScreen.navData",
      JSON.stringify(navData),
    );
    router.push("/(private)/exercises/ExercisesScreen");
  };

  return { addExercise };
};
