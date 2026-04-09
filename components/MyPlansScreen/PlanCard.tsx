import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Plan } from '@/api/MyPlansService';
import { randomPlanImages } from '@/constants/MyPlansScreenImages';

interface PlanCardProps {
    plan: Plan;
    index: number;
}

export const PlanCard = ({ plan, index }: PlanCardProps) => {
    const router = useRouter();

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: plan.image_url || randomPlanImages[index % randomPlanImages.length] }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {plan.difficulty?.toUpperCase() || 'BEGINNER'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.planTitle}>{plan.name}</Text>

                <View style={styles.infoRow}>
                    <View>
                        <Text style={styles.infoLabel}>DURATION</Text>
                        <Text style={styles.infoValue}>{plan.duration_minutes} MINS</Text>
                    </View>

                    {plan.frequency && (
                        <View style={{ marginLeft: 24 }}>
                            <Text style={styles.infoLabel}>FREQUENCY</Text>
                            <Text style={styles.infoValue}>{plan.frequency}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => router.push({
                            pathname: '/plans/PlanBuilderScreen/[id]',
                            params: { id: plan.id.toString() }
                        })}
                    >
                        <Text style={styles.viewBtnText}>VIEW EXERCISES</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => router.push({
                            pathname: '/plans/edit/[id]',
                            params: { id: plan.id.toString() }
                        })}
                    >
                        <MaterialIcons name="edit" size={24} color="#f4ffc9" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#131313',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    imageContainer: { height: 180, position: 'relative' },
    cardImage: { width: '100%', height: '100%' },
    badge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(206,252,34,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cefc22',
    },
    badgeText: { color: '#cefc22', fontSize: 10, fontWeight: '900' },
    cardContent: { padding: 20 },
    planTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    infoRow: { flexDirection: 'row', marginBottom: 20 },
    infoLabel: { color: '#767575', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    infoValue: { color: '#cefc22', fontSize: 16, fontWeight: 'bold' },
    buttonsRow: { flexDirection: 'row', gap: 12 },
    viewBtn: {
        flex: 1,
        backgroundColor: '#262626',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    viewBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
    editBtn: {
        width: 50,
        height: 50,
        backgroundColor: '#262626',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});