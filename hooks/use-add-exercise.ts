import { useNav } from "@/contexts/NavContext";
import { Plan } from "@/types/plan";
import { useRouter } from "expo-router";

type Props = {
  planId?: number;
  form: Omit<Plan, "user_id">;
};

export const useAddExercise = ({ planId, form }: Props) => {
  const router = useRouter();
  const { setNavData } = useNav();

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

    setNavData(navData);
    router.push("/(private)/exercises/ExercisesScreen");
  };

  return { addExercise };
};
