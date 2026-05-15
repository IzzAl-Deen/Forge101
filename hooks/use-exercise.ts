import { supabase } from "@/lib/supabase";
import type { Exercise } from "@/types/exercise";
import { useQuery } from "@tanstack/react-query";

async function fetchExercise(id: string) {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Exercise;
}

export function useExercise(id?: string) {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: () => fetchExercise(id as string),
    enabled: !!id,
  });
}