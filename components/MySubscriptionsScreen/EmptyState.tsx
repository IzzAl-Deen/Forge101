import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const EmptyState = () => {
    const router = useRouter();

    return (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="fitness-center" size={80} color="#262626" />
            <Text style={styles.emptyTitle}>No Active Subscriptions</Text>
            <Text style={styles.emptySubtitle}>
                {" You haven't subscribed to any plans yet. Explore plans to get started!"}
            </Text>
            <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => router.push('/(private)/plans/(MyPlansScreen)/MyPlansScreen')}
            >
                <Text style={styles.exploreBtnText}>EXPLORE PLANS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        paddingHorizontal: 40
    },
    emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    emptySubtitle: { color: '#adaaaa', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 },
    exploreBtn: {
        backgroundColor: '#cefc22',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 30
    },
    exploreBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});