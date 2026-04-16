import { myPlansService } from '@/api/MyPlansService';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type WorkoutItem = {
  planExerciseId: number;
  exerciseId: number;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: number;
  day: string;
  orderIndex: number;
  imageUrl: string | null;
  isCompleted: boolean;
};

type WorkoutSessionData = {
  subscription: any;
  plan: any;
  items: WorkoutItem[];
  completedCount: number;
  remainingCount: number;
  progressPercent: number;
};

const BRAND = '#d8ff63';
const CARD = '#1b1b1b';
const BG = '#090909';

async function fetchWorkoutSession(subscriptionId: number): Promise<WorkoutSessionData> {
  const subscriptionRow: any = await myPlansService.getUserPlanById(subscriptionId);

  if (!subscriptionRow) {
    throw new Error('Failed to load subscription');
  }

  const planRow: any =
    subscriptionRow.plan || (await myPlansService.getPlanById(String(subscriptionRow.plan_id)));

  if (!planRow) {
    throw new Error('Failed to load plan');
  }

  const planExercises: any[] = await myPlansService.getPlanExercises(String(subscriptionRow.plan_id));

  const completedIds = new Set<number>(
    ((subscriptionRow.completed_exercises || []) as any[]).map((item: any) =>
      Number(item.exercise_id ?? item.id)
    )
  );

  const items: WorkoutItem[] = planExercises.map((exercise: any, index: number) => ({
    planExerciseId: Number(exercise.id ?? index + 1),
    exerciseId: Number(exercise.exercise_id ?? exercise.id),
    name: exercise.name || 'Exercise',
    targetMuscle: exercise.target_muscle || 'Workout',
    sets: Number(exercise.sets ?? 0),
    reps: Number(exercise.reps ?? 0),
    day: exercise.day || 'Workout Day',
    orderIndex: Number(exercise.order_index ?? index + 1),
    imageUrl: exercise.image_url || null,
    isCompleted: completedIds.has(Number(exercise.exercise_id ?? exercise.id)),
  }));

  const completedCount = items.filter((item) => item.isCompleted).length;
  const remainingCount = Math.max(items.length - completedCount, 0);
  const progressPercent = Number(subscriptionRow.progress_percent || 0);

  return {
    subscription: {
      ...subscriptionRow,
      completed: progressPercent === 100,
    },
    plan: planRow,
    items,
    completedCount,
    remainingCount,
    progressPercent,
  };
}

async function toggleExerciseCompletion(
  subscriptionId: number,
  exerciseId: number,
  alreadyCompleted: boolean
) {
  if (alreadyCompleted) {
    return;
  }

  await myPlansService.completeExercise(subscriptionId, exerciseId);
}

async function unsubscribeFromPlan(subscriptionId: number) {
  await myPlansService.unsubscribeUserPlan(subscriptionId);
}

function dayLabel(value: string) {
  return value?.toUpperCase?.() || 'WORKOUT DAY';
}

function ExerciseCheckbox({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked ? <Ionicons name="checkmark" size={18} color="#0b0b0b" /> : null}
    </Pressable>
  );
}

export default function WorkoutSessionRefinedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const subscriptionId = Number(id);

  const sessionQuery = useQuery({
    queryKey: ['workout-session', subscriptionId],
    queryFn: () => fetchWorkoutSession(subscriptionId),
    enabled: Number.isFinite(subscriptionId) && subscriptionId > 0,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      exerciseId,
      alreadyCompleted,
    }: {
      exerciseId: number;
      alreadyCompleted: boolean;
    }) => {
      await toggleExerciseCompletion(subscriptionId, exerciseId, alreadyCompleted);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workout-session', subscriptionId] });
      await queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
    },
    onError: (error: any) => {
      Alert.alert('Update failed', error?.message || 'Could not update exercise progress.');
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: () => unsubscribeFromPlan(subscriptionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Could not unsubscribe', error?.message || 'Please try again.');
    },
  });

  const initials = 'U';

  if (!Number.isFinite(subscriptionId) || subscriptionId <= 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorTitle}>Invalid workout session</Text>
      </SafeAreaView>
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND} />
        <Text style={styles.loadingText}>Loading workout session...</Text>
      </SafeAreaView>
    );
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorTitle}>Could not load this workout</Text>
        <Text style={styles.errorText}>
          {(sessionQuery.error as any)?.message || 'Something went wrong.'}
        </Text>
        <Pressable style={styles.retryButton} onPress={() => sessionQuery.refetch()}>
          <Text style={styles.retryButtonText}>TRY AGAIN</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { plan, items, progressPercent, remainingCount } = sessionQuery.data;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={BRAND} />
            </Pressable>
            <Text style={styles.brandText}>KINETIC NOIR</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.activePlanLabel}>ACTIVE PLAN</Text>
          <Text style={styles.title}>{plan?.name || 'Workout Plan'}</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            OVERALL PROGRESS <Text style={styles.progressHighlight}>{progressPercent}%</Text>{' '}
            <Text style={styles.progressMuted}>COMPLETED</Text>
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(progressPercent, 4)}%` }]} />
          </View>
          <Text style={styles.progressDescription}>
            {progressPercent >= 100
              ? 'You finished every exercise in this plan. Strong work.'
              : progressPercent >= 50
              ? "You're crushing your weekly targets. Keep the intensity high!"
              : "You're building momentum. Keep stacking completed exercises."}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>EXERCISES IN THIS PLAN</Text>
          <Text style={styles.sectionMeta}>{remainingCount} REMAINING</Text>
        </View>

        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.planExerciseId} style={styles.exerciseCard}>
              <View style={styles.exerciseAccent} />
              <View style={styles.exerciseMain}>
                <View style={styles.exerciseTextWrap}>
                  <Text style={[styles.exerciseName, item.isCompleted && styles.exerciseNameDone]}>
                    {item.name}
                  </Text>
                  <Text style={styles.exerciseMeta}>
                    <Text style={styles.metaHighlight}>{item.sets} SETS</Text>
                    <Text style={styles.metaDot}> · </Text>
                    <Text>{item.reps} REPS</Text>
                    <Text style={styles.metaDot}> · </Text>
                    <Text>{dayLabel(item.day)}</Text>
                  </Text>
                </View>

                <ExerciseCheckbox
                  checked={item.isCompleted}
                  onPress={() => {
                    if (item.isCompleted) {
                      Alert.alert(
                        'Already completed',
                        'This exercise is already marked as completed.'
                      );
                      return;
                    }

                    toggleMutation.mutate({
                      exerciseId: item.exerciseId,
                      alreadyCompleted: item.isCompleted,
                    });
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.unsubscribeButton}
          onPress={() =>
            Alert.alert(
              'Unsubscribe from plan?',
              'This will remove this workout from your active subscriptions.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Unsubscribe',
                  style: 'destructive',
                  onPress: () => unsubscribeMutation.mutate(),
                },
              ]
            )
          }
        >
          <Text style={styles.unsubscribeText}>
            {unsubscribeMutation.isPending ? 'UNSUBSCRIBING...' : 'UNSUBSCRIBE FROM PLAN'}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          CHANGES WILL TAKE EFFECT AT THE END OF YOUR CURRENT BILLING CYCLE.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#b9b9b9',
    marginTop: 14,
    fontSize: 15,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },
  errorText: {
    color: '#b5b5b5',
    textAlign: 'center',
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: BRAND,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#060606',
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerRow: {
    marginTop: 8,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
  },
  brandText: {
    color: BRAND,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3c3c3c',
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  titleBlock: {
    marginBottom: 18,
  },
  activePlanLabel: {
    color: BRAND,
    fontSize: 11,
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
    maxWidth: '75%',
  },
  progressCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#232323',
  },
  progressTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 14,
  },
  progressHighlight: {
    color: BRAND,
  },
  progressMuted: {
    color: '#a9a9a9',
    fontWeight: '500',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#2a2a2a',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: BRAND,
  },
  progressDescription: {
    color: '#a7a7a7',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  sectionMeta: {
    color: '#a9a9a9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  list: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242424',
    flexDirection: 'row',
  },
  exerciseAccent: {
    width: 3,
    backgroundColor: BRAND,
  },
  exerciseMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 10,
  },
  exerciseTextWrap: {
    flex: 1,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 8,
  },
  exerciseNameDone: {
    color: '#bdbdbd',
  },
  exerciseMeta: {
    color: '#7f7f7f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  metaHighlight: {
    color: BRAND,
    fontWeight: '900',
  },
  metaDot: {
    color: '#5e5e5e',
  },
  checkbox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#5c5c5c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#232323',
  },
  checkboxChecked: {
    borderColor: BRAND,
    backgroundColor: '#edfdb6',
  },
  unsubscribeButton: {
    marginTop: 26,
    borderWidth: 1,
    borderColor: '#5b140d',
    backgroundColor: '#24100d',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  unsubscribeText: {
    color: '#ff6b56',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  disclaimer: {
    marginTop: 14,
    color: '#6d6d6d',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 15,
    paddingHorizontal: 16,
  },
});