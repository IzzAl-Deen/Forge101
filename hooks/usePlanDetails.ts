import { useQuery } from "@tanstack/react-query";
import { myPlansService } from "../api/MyPlansService";

export function usePlanDetails(planId?: string) {
  const planQuery = useQuery({
    queryKey: ["plan-details", planId],
    queryFn: () => myPlansService.getPlanById(String(planId)),
    enabled: !!planId,
    retry: 1,
  });

  const exercisesQuery = useQuery({
    queryKey: ["plan-exercises", planId],
    queryFn: () => myPlansService.getPlanExercises(String(planId)),
    enabled: !!planId,
    retry: 1,
  });

  return {
    planQuery,
    exercisesQuery,
  };
}