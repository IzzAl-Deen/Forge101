import { useQuery } from "@tanstack/react-query";
import { myPlansService } from "../api/MyPlansService";
import { workoutStorage } from "../storage/WorkoutSessionStorage";

export function useWorkoutSession(userPlanId?: string) {
  return useQuery({
    queryKey: ["workout-session", userPlanId],
    queryFn: async () => {
      await workoutStorage.saveLastPlan(String(userPlanId));
      return myPlansService.getUserPlanById(String(userPlanId));
    },
    enabled: !!userPlanId,
    retry: 1,
  });
}