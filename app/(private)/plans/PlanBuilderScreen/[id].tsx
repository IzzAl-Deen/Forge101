import {View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Alert} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { myPlansService } from '@/api/MyPlansService';
import { useLocalSearchParams,  } from 'expo-router';
import { Header } from '@/components/PlanBuilder/Header';
import { ExerciseCard } from '@/components/PlanBuilder/ExerciseCard';
import { AddButton } from '@/components/ui/PlanBuilder/AddButton';
import { EmptyState } from '@/components/ui/PlanBuilder/EmptyState';
import {useCallback, useEffect} from "react";

const PLAN_CACHE_KEY = '@plan_cache';
const EXERCISES_CACHE_KEY = '@plan_exercises_cache';

const PlanBuilderScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: planData, isLoading: isPlanLoading, refetch: refetchPlan } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => myPlansService.getPlanById(id!),
    enabled: !!id,
    staleTime: 0,
  });

  const { data: exercises = [], isLoading: isExercisesLoading, refetch: refetchExercises } = useQuery({
    queryKey: ['planExercises', id],
    queryFn: () => myPlansService.getPlanExercises(id!),
    enabled: !!id,
    staleTime: 0,
  });

  const isLoading = isPlanLoading || isExercisesLoading;

  useEffect(() => {
    if (planData) {
      AsyncStorage.setItem(`${PLAN_CACHE_KEY}_${id}`, JSON.stringify(planData))
          .catch(console.error);
    }
  }, [planData, id]);

  useEffect(() => {
    if (exercises.length > 0) {
      AsyncStorage.setItem(`${EXERCISES_CACHE_KEY}_${id}`, JSON.stringify(exercises))
          .catch(console.error);
    }
  }, [exercises, id]);

  useFocusEffect(
      useCallback(() => {
        if (id) {
          refetchPlan();
          refetchExercises();
        }
      }, [id, refetchPlan, refetchExercises])
  );
  const deleteMutation = useMutation({
    mutationFn: (exerciseId: number) => myPlansService.detachExercise(id!, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planExercises', id] });
      queryClient.invalidateQueries({ queryKey: ['plan', id] });
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
      Alert.alert("Error", "Failed to delete exercise");
    }
  });

  const handleRemove = (exerciseId: number) => {
    Alert.alert(
        "Delete Exercise",
        "Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteMutation.mutate(exerciseId)
          }
        ]
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <Header
            title={planData?.plan?.name || planData?.name || 'Loading Plan...'}
        />

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTag}>PHASE 01: FOUNDATION</Text>
              <Text style={styles.heroTitle}>
                {planData?.plan?.name ? planData.plan.name.toUpperCase() : 'REFINE THE ENGINE'}
              </Text>
            </View>

            <AddButton
                title="ADD EXERCISE"
                route={{
                  pathname: '/plans/edit/[id]',
                  params: { id: id }
                }}
            />
          </View>

          {isLoading && exercises.length === 0 ? (
              <ActivityIndicator color="#cefc22" style={{ marginTop: 50 }} />
          ) : (
              <FlatList
                  data={exercises}
                  renderItem={({ item, index }) => (
                      <ExerciseCard
                          item={item}
                          index={index}
                          onDelete={() => handleRemove(item.id)}
                      />
                  )}
                  keyExtractor={(item, index) => item?.id ? item.id.toString() : `ex-${index}`}
                  ListEmptyComponent={EmptyState}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  showsVerticalScrollIndicator={false}
              />
          )}
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  content: { flex: 1, paddingHorizontal: 20 },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 30,
    gap: 15
  },
  heroTag: {
    color: '#cefc22',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic'
  },
});

export default PlanBuilderScreen;