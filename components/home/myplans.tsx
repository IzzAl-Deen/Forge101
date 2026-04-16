import React, { useEffect, useState } from "react";
import {ActivityIndicator,FlatList, Image,StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Plans from "@/api/plansApi";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

type PlanItem = {
  id: number;
  name: string;
  difficulty: string;
  duration_minutes: number;
  image_url?: string;
};

export default function HomePlans() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
        fetchPlans();
    }, [])
);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const response = await Plans.getAll();

      setPlans(response.data || response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ccff00"
        style={{ marginTop: 30 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plans</Text>

        <TouchableOpacity onPress={() => router.push('/(private)/plans/(MyPlansScreen)/MyPlansScreen')}>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={plans}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} 
        //    onPress={() => router.push()}
           >
            <Image
              source={{
                uri:
                  item.image_url ||
                  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
              }}
              style={styles.image}
            />

            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.difficulty.toUpperCase()}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.duration_minutes} MIN
                </Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.name}</Text>

            <Text style={styles.description}>
              Click to view details for this plan.
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  viewAll: {
    color: "#ccff00",
    fontWeight: "600",
  },

  card: {
    width: 220,
    backgroundColor: "#151515",
    borderRadius: 20,
    padding: 12,
    marginRight: 15,
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 15,
    marginBottom: 10,
  },

  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  badge: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#ccff00",
    fontSize: 10,
    fontWeight: "bold",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  description: {
    color: "#999",
    fontSize: 13,
  },
});