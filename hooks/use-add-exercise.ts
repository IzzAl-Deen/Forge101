import { Plan } from "@/types/plan";
import { useRouter } from "expo-router";

type Props = {
    planId?: number;
    form: Omit<Plan, "user_id">;
};

export const useAddExercise = ({ planId, form }: Props) => {
    const router = useRouter();

    const addExercise = () => {
        router.push({
            pathname: "/(private)/exercises/ExercisesScreen",
            params: {
                planId: planId ? String(planId) : "",
                returnTo: planId ? "/(private)/plans/edit/[id]" : "/(private)/plans/create",
                returnId: planId ? String(planId) : "",
                planName: form.name,
                planDifficulty: form.difficulty,
                planDuration: String(form.duration_minutes),
            },
        });
    }

    return {addExercise};
};