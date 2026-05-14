import  {useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

import { myPlansService } from '@/api/MyPlansService';
import { Header } from '@/components/MyPlansScreen/Header';
import { PlanCard } from '@/components/MyPlansScreen/PlanCard';
import { AddButton } from '@/components/ui/MyPlansScreen/AddButton';
import { EmptyState } from '@/components/ui/MyPlansScreen/EmptyState';

const CACHE_KEY = '@my_plans_cache';

const MyPlansScreen = () => {
    const { data: plans = [], isLoading, error, refetch } = useQuery({
        queryKey: ['plans'],
        queryFn: myPlansService.getPlans,
        staleTime: 0,
        initialData: undefined,
    });


    useEffect(() => {
        const loadCache = async () => {
            try {
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                if (cached && (!plans || plans.length === 0)) {

                }
            } catch (e) {
                console.error(e);
            }
        };
        loadCache();
    }, [plans]);

    useEffect(() => {
        if (plans && plans.length > 0) {
            AsyncStorage.setItem(CACHE_KEY, JSON.stringify(plans)).catch(console.error);
        }
    }, [plans]);

    useFocusEffect(
       useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (isLoading && plans.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator style={{ flex: 1 }} color="#f4ffc9" size="large" />
                <Text style={styles.loadingText}>Loading your plans...</Text>
            </SafeAreaView>
        );
    }

    if (error && plans.length === 0) {
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
                    data={plans}
                    renderItem={({ item, index }) => <PlanCard plan={item} index={index} />}
                    keyExtractor={(item, index) => item?.id ? item.id.toString() : `plan-${index}`}
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
    },  loadingText: {
        color: '#adaaaa',
        fontSize: 16,
        marginTop: 16,
    },
});

export default MyPlansScreen;