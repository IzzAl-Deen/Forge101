import { ExerciseFiltersProvider } from "@/contexts/ExerciseFiltersContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExerciseFiltersProvider>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="index"
        />
      </ExerciseFiltersProvider>
    </QueryClientProvider>
  );
}
