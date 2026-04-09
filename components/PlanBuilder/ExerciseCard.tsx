import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PlanExercise } from '@/api/MyPlansService';
import { randomExerciseImages } from '@/constants/PlanBuilderImages';

interface ExerciseCardProps {
    item: PlanExercise;
    index: number;
    onDelete: (id: number) => void;
}

export const ExerciseCard = ({ item, index, onDelete }: ExerciseCardProps) => {
    return (
        <View style={styles.exerciseCard}>
            <View style={styles.cardAccent} />
            <View style={styles.cardInner}>
                <Image
                    source={{ uri: item.image_url || randomExerciseImages[index % randomExerciseImages.length] }}
                    style={styles.exerciseThumb}
                />
                <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <MaterialIcons name="repeat" size={14} color="#cefc22" />
                            <Text style={styles.statText}>{item.sets} SETS</Text>
                        </View>
                        <View style={styles.statItem}>
                            <MaterialIcons name="fitness-center" size={14} color="#cefc22" />
                            <Text style={styles.statText}>{item.reps} REPS</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="edit" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: 'rgba(213,61,24,0.1)' }]}
                        onPress={() => onDelete(item.id)}
                    >
                        <MaterialIcons name="delete" size={22} color="#ff7351" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    exerciseCard: { backgroundColor: '#131313', borderRadius: 15, marginBottom: 15, overflow: 'hidden' },
    cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: '#cefc22' },
    cardInner: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    exerciseThumb: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#262626' },
    exerciseInfo: { flex: 1, marginLeft: 15 },
    exerciseName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    statsRow: { flexDirection: 'row', marginTop: 8, gap: 12 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { color: '#adaaaa', fontSize: 10, fontWeight: 'bold' },
    actionButtons: { flexDirection: 'row', gap: 10 },
    iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#262626', justifyContent: 'center', alignItems: 'center' },
});