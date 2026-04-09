import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { myPlansService, UserPlan } from '@/api/MyPlansService';

import { Header } from '@/components/MySubscriptionsScreen/Header';
import { SubscriptionCard } from '@/components/MySubscriptionsScreen/SubscriptionCard';
import { EmptyState } from '@/components/MySubscriptionsScreen/EmptyState';

const MySubscriptionsScreen = () => {
    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['userSubscriptions'],
        queryFn: myPlansService.getUserSubscriptions,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#cefc22" />
                    <Text style={styles.loadingText}>Loading your workouts...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="MY WORKOUTS" />

            <FlatList
                data={subscriptions}
                renderItem={({ item, index }) => <SubscriptionCard item={item} index={index} />}
                keyExtractor={(item) => item.id.toString()}
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