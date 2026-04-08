import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { planService, Plan } from '@/Api2/planService';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';


const MyPlansScreen = () => {
  const router = useRouter();
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: planService.getPlans,
  });

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
  ];

  const renderPlanCard = ({ item, index }: { item: Plan; index: number }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url || randomImages[index % randomImages.length] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.difficulty ? item.difficulty.toUpperCase() : 'BEGINNER'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.planTitle}>{item.name}</Text>

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoLabel}>DURATION</Text>
            <Text style={styles.infoValue}>{item.duration_minutes} MINS</Text>
          </View>

          {item.frequency && (
            <View style={{ marginLeft: 24 }}>
              <Text style={styles.infoLabel}>FREQUENCY</Text>
              <Text style={styles.infoValue}>{item.frequency}</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              router.push({
                pathname: '/plans/PlanBuilderScreen/[id]',
                params: { id: item.id.toString() }
              })
            }
          >
            <Text style={styles.viewBtnText}>VIEW EXERCISES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              router.push({
                pathname: '/plans/edit/[id]',
                params: { id: item.id.toString() }
              })
            }
          >
            <MaterialIcons name="edit" size={24} color="#f4ffc9" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Text style={{ fontSize: 40, color: '#adaaaa' }}>+</Text>
      </View>
      <Text style={styles.emptyTitle}>No plans created yet.</Text>
      <Text style={styles.emptySubtitle}>Start building your first plan!</Text>
    </View>
  );

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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={styles.backBtn}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={28}
            color="#f4ffc9"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forge</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>MY PLANS</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => router.push('/plans/create')}
          >
            <MaterialIcons name="add" size={24} color="#000" />
            <Text style={styles.addBtnText}>ADD NEW PLAN</Text>
          </TouchableOpacity>

        </View>

        <FlatList
          data={plans || []}
          renderItem={renderPlanCard}
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
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  backIcon: {
    color: '#f4ffc9',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#f4ffc9',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
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
  addBtn: {
    backgroundColor: '#cefc22',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#cefc22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  addBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#131313',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
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
  badgeText: {
    color: '#cefc22',
    fontSize: 10,
    fontWeight: '900',
  },
  cardContent: {
    padding: 20,
  },
  planTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoLabel: {
    color: '#767575',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoValue: {
    color: '#cefc22',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#262626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  editBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#262626',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 22,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: '#767575',
    fontSize: 14,
    marginTop: 5,
  },
});

export default MyPlansScreen;