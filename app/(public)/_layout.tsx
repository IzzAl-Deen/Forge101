import { SelectedExercisesProvider } from "@/contexts/SelectedExercisesContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedExercisesProvider>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="index"
        />
      </SelectedExercisesProvider>
    </QueryClientProvider>
  );
}
