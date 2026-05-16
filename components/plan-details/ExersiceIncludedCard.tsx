import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const ExerciseIncludedCard = memo(function ExerciseIncludedCard({
  exercise,
}: {
  exercise: any;
}) {
  return (
    <View style={styles.card}>
      {exercise.image_url ? (
        <Image source={{ uri: exercise.image_url }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.body}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.sub}>Primary Compound Movement</Text>

        <View style={styles.metaBox}>
          <Text style={styles.meta}>{exercise.sets} SETS</Text>
          <Text style={styles.meta}>{exercise.reps} REPS</Text>
          <Text style={[styles.meta, styles.day]}>{exercise.day?.[0] || "DAY"}</Text>
        </View>
      </View>

      <Text style={styles.arrow}>›</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  image: { width: 78, height: 78, borderRadius: 8 },
  placeholder: { width: 78, height: 78, backgroundColor: "#333", borderRadius: 8 },
  body: { flex: 1 },
  name: { color: "#fff", fontSize: 20, fontWeight: "900" },
  sub: { color: "#aaa", fontSize: 15, marginVertical: 6 },
  metaBox: { backgroundColor: "#292929", borderRadius: 9, flexDirection: "row", padding: 10, gap: 16 },
  meta: { color: "#fff", fontWeight: "900" },
  day: { color: "#d9ff2f" },
  arrow: { color: "#555", fontSize: 34 },
});