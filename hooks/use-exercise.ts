import Exercises from "@/api/exerciseApi";
import { useQuery } from "@tanstack/react-query";

export function useExercise(id?: string) {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: () => Exercises.getById(Number(id)),
    enabled: !!id,
  });
}