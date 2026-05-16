import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { myPlansService, PlanExercise } from "@/api/MyPlansService";
import {  CachedExercise,  getExercises,  saveExercises,} from "@/api/db/exerciseDB";

export default function TodaysFocus() {
  const [loading, setLoading] = useState(true);
  const [focusExercises, setFocusExercises] = useState<PlanExercise[]>([]);
  const [fromplan, setFromPlan] = useState<string>("");

  useEffect(() => {
    fetchTodaysExercises();
  }, []);

  const fetchTodaysExercises = async () => {
    try {
      setLoading(true);

      const cachedExercises = await getExercises();

      if (cachedExercises.length) {
        const mapped = cachedExercises.map(
          (c) =>
            ({
              id: c.id,
              name: c.name,
              image_url: c.image_url,
              sets: c.sets || 0,
              reps: c.reps || 0,
              day: c.pivot?.day ? [c.pivot.day] : [],
              originalIds: c.pivot?.originalIds || [],
            }) as PlanExercise,
        );
        setFocusExercises(mapped);
      }

      const allPlans = await myPlansService.getPlans();

      if (!allPlans.length) {
        setFocusExercises([]);
        return;
      }

      const randomPlan = allPlans[Math.floor(Math.random() * allPlans.length)];

      const response = await myPlansService.getPlanExercises(randomPlan.id);

      setFocusExercises(response || []);
      setFromPlan(randomPlan.name);

      const toCache: CachedExercise[] = response.map((e) => ({
        id: e.id,
        name: e.name,
        image_url: e.image_url,
        sets: e.sets,
        reps: e.reps,
        day: Array.isArray(e.day) ? e.day.join(",") : "",
      }));

      await saveExercises(toCache);
    } catch (err) {
      console.error(err);
      setFocusExercises([]);
    } finally {
      setLoading(false);
    }
  };

  if (!focusExercises.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🏋️</Text>

        <Text style={styles.emptyTitle}>No focus workout yet</Text>

        <Text style={styles.emptySubtitle}>
          Create a training plan to see today's focus exercises.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Focus</Text>

      <FlatList
        scrollEnabled={false}
        data={focusExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image
              source={{
                uri:
                  item.image_url ||
                  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
              }}
              style={styles.image}
            />

            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.meta}>
                {item.sets} SETS • {item.reps} REPS
                {Array.isArray(item.day) && item.day.length
                  ? ` • ${item.day.join(" • ").toUpperCase()}`
                  : ""}
              </Text>

              <Text style={styles.meta}>From: {fromplan}</Text>
            </View>

            {/* <TouchableOpacity style={styles.playBtn}>
              <Text style={styles.playText}>▶</Text>
            </TouchableOpacity> */}
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

  center: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  emptyEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  emptySubtitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  meta: {
    color: "#888",
    marginTop: 4,
    fontSize: 12,
  },

  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },

  playText: {
    color: "#ccff00",
    fontSize: 16,
    fontWeight: "bold",
  },
});
