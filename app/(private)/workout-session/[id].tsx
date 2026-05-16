import { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { WorkoutSessionProvider } from "../../../contexts/WorkoutSessionContext";

import { useWorkoutSession } from "../../../hooks/useWorkoutSession";
import { usePlanActions } from "../../../hooks/usePlanActions";

import { ExerciseCheckItem } from "../../../components/workout-session/ExerciseCheckItem";
import { ProgressCard } from "../../../components/workout-session/ProgressCard";
import { UnsubscribeButton } from "../../../components/workout-session/UnsubscribeButton";

function ScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const { data, isLoading, isError, refetch } = useWorkoutSession(id);
  const { completeExercise, unsubscribe } = usePlanActions();

  const planId = Number(id);

  const plan = data?.plan;
  const exercises = useMemo(
  () => plan?.exercises || [],
  [plan?.exercises]
  );

  const completedIds = useMemo(() => {
    return data?.progress?.map((item: any) => item.exercise_id) || [];
  }, [data]);

  const handleComplete = useCallback(
    (exerciseId: number) => {
      completeExercise.mutate({
        userPlanId: planId,
        exerciseId,
      });
    },
    [completeExercise, planId]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#d9ff2f" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>Something went wrong</Text>
        <Text style={styles.retry} onPress={() => refetch()}>
          Try again
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text style={styles.brand}>← KINETIC NOIR</Text>
        <Text style={styles.small}>ACTIVE PLAN</Text>
        <Text style={styles.title}>{plan?.name}</Text>

        <ProgressCard progress={data?.progress_percent || 0} />

        <View style={styles.row}>
          <Text style={styles.section}>EXERCISES IN THIS PLAN</Text>
          <Text style={styles.remaining}>{exercises.length} REMAINING</Text>
        </View>

        {exercises.map((exercise: any) => (
          <ExerciseCheckItem
            key={`${exercise.id}-${exercise.pivot?.id ?? ""}-${exercise.pivot?.day ?? ""}-${Math.random()}`}
            exercise={exercise}
            checked={completedIds.includes(exercise.id)}
            onPress={handleComplete}
          />
        ))}

        <UnsubscribeButton
          onPress={() => unsubscribe.mutate(planId)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function WorkoutSessionScreen() {
  return (
    <WorkoutSessionProvider>
      <ScreenContent />
    </WorkoutSessionProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  center: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 24, paddingBottom: 100 },
  brand: { color: "#d9ff2f", fontWeight: "800", letterSpacing: 2, marginBottom: 34 },
  small: { color: "#d9ff2f", fontSize: 11, letterSpacing: 2 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", marginTop: 8, marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  section: { color: "#fff", fontWeight: "900" },
  remaining: { color: "#777", fontSize: 11 },
  error: { color: "#fff", marginBottom: 10 },
  retry: { color: "#d9ff2f", fontWeight: "800" },
});