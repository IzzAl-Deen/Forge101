import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { myPlansService } from '@/api/MyPlansService';
import { Header } from '@/components/MyPlansScreen/Header';
import { PlanCard } from '@/components/MyPlansScreen/PlanCard';
import { AddButton } from '@/components/ui/MyPlansScreen/AddButton';
import { EmptyState } from '@/components/ui/MyPlansScreen/EmptyState';

const MyPlansScreen = () => {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: myPlansService.getPlans,
      refetchInterval: 5000,
      refetchOnWindowFocus:true,   
  });

  if (isLoading) {
    return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator style={{ flex: 1 }} color="#f4ffc9" size="large" />
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.container}>
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>
            Error loading plans
          </Text>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <Header title="Forge" />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>MY PLANS</Text>
            <AddButton title="ADD NEW PLAN" route="/plans/create" />
          </View>

          <FlatList
              data={plans || []}
              renderItem={({ item, index }) => <PlanCard plan={item} index={index} />}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={EmptyState}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  content: { flex: 1, padding: 20 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
});

export default MyPlansScreen;