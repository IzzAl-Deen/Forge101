import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PlanHero } from "../../../../components/plan-details/PlanHero";

import { PlanInfoCard } from "../../../../components/plan-details/PlanInfoCard";

import { ExerciseIncludedCard } from "../../../../components/plan-details/ExersiceIncludedCard";

import { SubscribeButton } from "../../../../components/plan-details/SubscribeButton";
import { usePlanDetails } from "../../../../hooks/usePlanDetails";
import { usePlanActions } from "../../../../hooks/usePlanActions";


export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const planId = Number(id);
  const { planQuery, exercisesQuery } = usePlanDetails(id);
  const { subscribe } = usePlanActions();

  const exercises = useMemo(() => exercisesQuery.data || [], [exercisesQuery.data]);

  const onSubmit = useCallback(() => {
    subscribe.mutate(planId);
  }, [subscribe, planId]);

  if (planQuery.isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#d9ff2f" />
      </SafeAreaView>
    );
  }

  if (planQuery.isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>Plan details could not be loaded</Text>
        <Text style={styles.retry} onPress={() => planQuery.refetch()}>
          Try again
        </Text>
      </SafeAreaView>
    );
  }

  const plan = planQuery.data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <PlanHero plan={plan} />

        <PlanInfoCard label="FOCUS" value="Mass & Power" />
        <PlanInfoCard label="DAYS / WEEK" value={plan?.frequency || "5 Intense Sessions"} />
        <PlanInfoCard label="EQUIPMENT" value="Full Gym Required" />

        <View style={styles.headingRow}>
          <Text style={styles.heading}>EXERCISES{"\n"}INCLUDED</Text>
          <Text style={styles.total}>{exercises.length} MOVEMENTS{"\n"}TOTAL</Text>
        </View>

        {exercises.map((exercise: any) => (
          <ExerciseIncludedCard key={`${exercise.id}-${exercise.day?.join("-")}`} exercise={exercise} />
        ))}

        <View style={styles.strategy}>
          <Text style={styles.strategyTitle}>THE STRATEGY</Text>
          <Text style={styles.strategyText}>
            Designed for those who have plateaued. Titan Hypertrophy utilizes progressive overload
            with an emphasis on time-under-tension. Expect heavy compound openers followed by
            metabolic stress finishers.
          </Text>
        </View>

        <SubscribeButton
          loading={subscribe.isPending}
          onPress={onSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070707" },
  center: {
    flex: 1,
    backgroundColor: "#070707",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 22, paddingBottom: 70 },
  headingRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 30 },
  heading: { color: "#fff", fontSize: 32, fontWeight: "900" },
  total: { color: "#e7ff9a", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  strategy: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 34,
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#222",
  },
  strategyTitle: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 26 },
  strategyText: { color: "#aaa", fontSize: 20, lineHeight: 33 },
  error: { color: "#fff", marginBottom: 10 },
  retry: { color: "#d9ff2f", fontWeight: "800" },
});