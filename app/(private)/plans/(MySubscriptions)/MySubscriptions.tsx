import {useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

import { myPlansService } from '@/api/MyPlansService';
import { Header } from '@/components/MySubscriptionsScreen/Header';
import { SubscriptionCard } from '@/components/MySubscriptionsScreen/SubscriptionCard';
import { EmptyState } from '@/components/MySubscriptionsScreen/EmptyState';

const CACHE_KEY = '@my_subscriptions_cache';

const MySubscriptionsScreen = () => {
    const { data: subscriptions = [], isLoading, error, refetch } = useQuery({
        queryKey: ['userSubscriptions'],
        queryFn: myPlansService.getUserSubscriptions,
        staleTime: 0,
        initialData: undefined,
    });

    useEffect(() => {
        if (subscriptions && subscriptions.length > 0) {
            AsyncStorage.setItem(CACHE_KEY, JSON.stringify(subscriptions))
                .catch(console.error);
        }
    }, [subscriptions]);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (isLoading && subscriptions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#cefc22" />
                    <Text style={styles.loadingText}>Loading your workouts...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && subscriptions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>
                    Error loading subscriptions
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="MY WORKOUTS" />

            <FlatList
                data={subscriptions}
                renderItem={({ item, index }) => <SubscriptionCard item={item} index={index} />}
                keyExtractor={(item, index) => item?.id ? item.id.toString() : `sub-${index}`}
                ListEmptyComponent={EmptyState}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0e0e0e' },
    listContent: { padding: 20, paddingBottom: 40 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#adaaaa',
        fontSize: 16,
        marginTop: 16,
    },
});

export default MySubscriptionsScreen;