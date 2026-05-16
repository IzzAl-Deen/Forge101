import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { myPlansService } from "../api/MyPlansService";

export function usePlanActions(userPlanId?: string, planId?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const completeExercise = useMutation({
    mutationFn: (exerciseId: number) =>
      myPlansService.completeExercise(Number(userPlanId), exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-session", userPlanId] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
  });

  const unsubscribe = useMutation({
    mutationFn: () => myPlansService.unsubscribe(Number(userPlanId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      router.back();
    },
  });

  const subscribe = useMutation({
    mutationFn: () => myPlansService.subscribe(Number(planId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      router.back();
    },
  });

  return {
    completeExercise,
    unsubscribe,
    subscribe,
  };
}