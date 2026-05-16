import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { myPlansService } from "../api/MyPlansService";

export function usePlanActions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const subscribe = useMutation({
    mutationFn: (planId: number) =>
      myPlansService.subscribe(planId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      router.back();
    },
  });

  const unsubscribe = useMutation({
    mutationFn: (userPlanId: number) =>
      myPlansService.unsubscribe(userPlanId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      router.back();
    },
  });

  const completeExercise = useMutation({
    mutationFn: ({
      userPlanId,
      exerciseId,
    }: {
      userPlanId: number;
      exerciseId: number;
    }) =>
      myPlansService.completeExercise(userPlanId, exerciseId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-session"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
  });

  return {
    subscribe,
    unsubscribe,
    completeExercise,
  };
}