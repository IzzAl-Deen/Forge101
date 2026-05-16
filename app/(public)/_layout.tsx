import { useAuth } from "@/hooks/use-auth";
import { ExerciseFiltersProvider } from "@/contexts/ExerciseFiltersContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";

export default function PublicLayout() {
  const { session, isLoading } = useAuth();

  if (!isLoading && session) return <Redirect href="/(private)" />;

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
