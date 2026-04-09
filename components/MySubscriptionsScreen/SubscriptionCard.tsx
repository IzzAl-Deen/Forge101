import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UserPlan } from '@/api/MyPlansService';
import { subscriptionImages } from '@/constants/MySubscriptionsScreenImages';

interface SubscriptionCardProps {
    item: UserPlan;
    index: number;
}

export const SubscriptionCard = ({ item, index }: SubscriptionCardProps) => {
    const router = useRouter();
    const isFinished = item.is_completed || item.progress_percent === 100;

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: item.plan.image_url || subscriptionImages[index % subscriptionImages.length] }}
                style={styles.cardImage}
            />
            <View style={styles.overlay} />

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.planName}>{item.plan.name}</Text>
                    <View style={[styles.difficultyBadge, isFinished && { borderColor: '#cefc22' }]}>
                        <Text style={styles.difficultyText}>{item.plan.difficulty.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressLabel}>PROGRESS</Text>
                        <Text style={[styles.progressValue, isFinished && { color: '#cefc22' }]}>
                            {item.progress_percent}%
                        </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${item.progress_percent}%` },
                                isFinished && { backgroundColor: '#cefc22' }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.statusBox}>
                        <MaterialIcons
                            name={isFinished ? "check-circle" : "pending"}
                            size={18}
                            color={isFinished ? "#cefc22" : "#adaaaa"}
                        />
                        <Text style={[styles.statusText, { color: isFinished ? "#cefc22" : "#adaaaa" }]}>
                            {isFinished ? "COMPLETED" : "IN PROGRESS"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.viewBtn, isFinished && { backgroundColor: '#cefc22' }]}
                        onPress={() => router.push(`/WorkoutSession/${item.id}`)}
                    >
                        <Text style={styles.viewBtnText}>
                            {isFinished ? "VIEW SUMMARY" : "VIEW PROGRESS"}
                        </Text>
                        <MaterialIcons name="arrow-forward" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 230,
        borderRadius: 25,
        marginBottom: 25,
        overflow: 'hidden',
        backgroundColor: '#131313',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#1a1a1a'
    },
    cardImage: { width: '100%', height: '100%', position: 'absolute' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.65)'
    },
    cardContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    planName: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 },
    difficultyBadge: {
        backgroundColor: 'rgba(206,252,34,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(206,252,34,0.3)'
    },
    difficultyText: { color: '#cefc22', fontSize: 10, fontWeight: 'bold' },
    progressSection: { marginBottom: 15 },
    progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { color: '#adaaaa', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    progressValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
    progressBarFill: { height: '100%', backgroundColor: '#cefc22', borderRadius: 3 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
    viewBtn: {
        backgroundColor: '#cefc22',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 5
    },
    viewBtnText: { color: '#000', fontSize: 11, fontWeight: '900' },
});