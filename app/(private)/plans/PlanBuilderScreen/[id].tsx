import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myPlansService } from '@/api/MyPlansService';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Header } from '@/components/PlanBuilder/Header';
import { ExerciseCard } from '@/components/PlanBuilder/ExerciseCard';
import { AddButton } from '@/components/ui/PlanBuilder/AddButton';
import { EmptyState } from '@/components/ui/PlanBuilder/EmptyState';

const PlanBuilderScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: planData, isLoading: isPlanLoading } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => myPlansService.getPlanById(id!),
    enabled: !!id,
  });

  const { data: exercises = [], isLoading: isExercisesLoading } = useQuery({
    queryKey: ['planExercises', id],
    queryFn: () => myPlansService.getPlanExercises(id!),
    enabled: !!id,
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
  });

  const isLoading = isPlanLoading || isExercisesLoading;

  const deleteMutation = useMutation({
    mutationFn: (exerciseId: number) => myPlansService.detachExercise(id!, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planExercises', id] });
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
    }
  });

  const handleRemove = (exerciseId: number) => {
    deleteMutation.mutate(exerciseId);
  };

  return (
      <SafeAreaView style={styles.container}>
        <Header title={planData?.plan?.name || planData?.name || 'Loading Plan...'} />

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
                  pathname: '/(private)/plans/edit/[id]',
                  params: { id: id }
                }}
            />       </View>

          {isLoading ? (
              <ActivityIndicator color="#cefc22" style={{ marginTop: 50 }} />
          ) : (
              <FlatList
                  data={exercises}
                  renderItem={({ item, index }) => (
                      <ExerciseCard
                          item={item}
                          index={index}
                          onDelete={handleRemove}
                      />
                  )}
                  keyExtractor={(item) => item.id.toString()}
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
  heroTag: { color: '#cefc22', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 5 },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
});

export default PlanBuilderScreen;