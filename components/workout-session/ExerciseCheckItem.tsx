import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  exercise: any;
  checked: boolean;
  onPress: (id: number) => void;
};

export const ExerciseCheckItem = memo(function ExerciseCheckItem({
  exercise,
  checked,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(exercise.id)}>
      <View style={styles.line} />

      <View style={styles.info}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {exercise.pivot?.sets || 0} SETS · {exercise.pivot?.reps || 0} REPS ·{" "}
          {exercise.pivot?.day || "DAY"}
        </Text>
      </View>

      <View style={[styles.box, checked && styles.done]}>
        <Text style={styles.check}>{checked ? "✓" : ""}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#171717",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  line: { width: 3, backgroundColor: "#d9ff2f", position: "absolute", left: 0, top: 0, bottom: 0 },
  info: { flex: 1 },
  name: { color: "#fff", fontWeight: "900", marginBottom: 6 },
  meta: { color: "#d9ff2f", fontSize: 10, fontWeight: "800" },
  box: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },
  done: { backgroundColor: "#e7ff9a" },
  check: { color: "#111", fontWeight: "900" },
});