import React from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planService, PlanExercise } from '@/Api2/planService'; 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const PlanBuilderScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  
const { data: exercises = [], isLoading: isExercisesLoading,  } = useQuery({
    queryKey: ['planExercises', id],
    queryFn: () => planService.getPlanExercises(id!),
    enabled: !!id,
    refetchInterval: 9000,        
   refetchOnWindowFocus: true,
    
  });

const { data: planData, isLoading: isPlanLoading } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => planService.getPlanById(id!), 
    enabled: !!id,
  });


  const deleteMutation = useMutation({
    mutationFn: (exerciseId: number) => planService.detachExercise(id!, exerciseId),

    onSuccess: () => {
      console.log('Exercise deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['planExercises', id] });
      queryClient.invalidateQueries({ queryKey: ['plan', id] });
    },

    onError: (error: any) => {
      console.error('Delete failed:', error?.response?.data || error);
    }
  });

  const handleRemove = (exerciseId: number) => {
    console.log(`Attempting to delete exercise ID: ${exerciseId} from plan ${id}`);
    deleteMutation.mutate(exerciseId);
  };

  const isLoading = isPlanLoading || isExercisesLoading;

  

const randomImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000',
  'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1000',
  'https://images.unsplash.com/photo-1599058917212-7f5c2f3c4c4f?q=80&w=1000',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca5d8a?q=80&w=1000',
  'https://images.unsplash.com/photo-1541534741688-6079c4a5d8e0?q=80&w=1000',
  'https://images.unsplash.com/photo-1526506118085-60b3c2d2c6c7?q=80&w=1000',
  'https://images.unsplash.com/photo-1580261453794-4c0e7f8c5f5f?q=80&w=1000',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000',
  'https://images.unsplash.com/photo-1605296867304-46e3b4d9e8c3?q=80&w=1000',
  'https://images.unsplash.com/photo-1594737625785-6c2c2e5c4b0d?q=80&w=1000',
  'https://images.unsplash.com/photo-1571019614243-6c9f6c3e3e3e?q=80&w=1000',
  'https://images.unsplash.com/photo-1605296867304-46e3b4d9e8c3?q=80&w=1000',
  'https://images.unsplash.com/photo-1549476464-37392c4814c9?q=80&w=1000',
  'https://images.unsplash.com/photo-1571902943202-507ec197f8c6?q=80&w=1000',
];

  const renderExerciseItem = ({ item, index }: { item: PlanExercise, index: number }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.cardAccent} />
      <View style={styles.cardInner}>
        <Image 
          source={{ uri: item.image_url || randomImages[index % randomImages.length] }} 
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
            <View style={styles.statItem}>
              <MaterialIcons name="calendar-today" size={14} color="#ede855" />
              <Text style={[styles.statText, { color: '#ede855' }]}>{item.day}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconBtn, { backgroundColor: 'rgba(213,61,24,0.1)' }]} 
            onPress={() => handleRemove(item.id)}
          >
            <MaterialIcons name="delete" size={20} color="#ff7351" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#cefc22" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {planData?.plan?.name || planData?.name || 'Loading Plan...'}
        </Text>

     
      </View>

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTag}>PHASE 01: FOUNDATION</Text>
            <Text style={styles.heroTitle}>REFINE THE <Text style={{ color: '#cefc22' }}>ENGINE.</Text></Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => 
         router.push({
        pathname: '/(private)/Plans/edit/[id]',
        params: { id: id }
             })
}>
            <MaterialIcons name="add-box" size={20} color="#000" />
            <Text style={styles.addBtnText}>ADD EXERCISE</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#cefc22" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No exercises added to this plan yet.</Text>
              </View>
            )}
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
  header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'rgba(14,14,14,0.7)' },
  backBtn: { padding: 8 },
  headerTitle: { color: '#cefc22', fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1 },
  content: { flex: 1, paddingHorizontal: 20 },
  heroSection: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 30, gap: 15 },
  heroTag: { color: '#cefc22', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 5 },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
  addBtn: { backgroundColor: '#cefc22', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10 },
  addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
  exerciseCard: { backgroundColor: '#131313', borderRadius: 15, marginBottom: 15, overflow: 'hidden' },
  cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: '#cefc22' },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  exerciseThumb: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#262626' },
  exerciseInfo: { flex: 1, marginLeft: 15 ,marginTop: 10},
  exerciseName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', marginTop: 8, gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { color: '#adaaaa', fontSize: 10, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', gap: 10 , marginBottom: 20},
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#262626', justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#adaaaa', fontSize: 16 }
});

export default PlanBuilderScreen;
