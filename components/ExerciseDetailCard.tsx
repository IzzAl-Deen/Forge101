import { ExerciseFormItem } from "@/hooks/use-exercise-details";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface ExerciseDetailCardProps {
  item: ExerciseFormItem;
  onUpdateItem: (
    exerciseId: number,
    field: "sets" | "reps",
    value: string,
  ) => void;
  onToggleDay: (exerciseId: number, day: string) => void;
  weekDays: string[];
}

export function ExerciseDetailCard({
  item,
  onUpdateItem,
  onToggleDay,
  weekDays,
}: ExerciseDetailCardProps) {
  return (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <MaterialIcons name="fitness-center" size={22} color="#6f6f6f" />
        </View>
      )}

      <View style={styles.cardBody}>
        <Text style={styles.cardTag}>
          {(item.target_muscle || item.category || "exercise")
            .replace(/_/g, " ")
            .toUpperCase()}
        </Text>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SETS</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={item.sets}
            onChangeText={(value) =>
              onUpdateItem(item.exercise_id, "sets", value)
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>REPS</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={item.reps}
            onChangeText={(value) =>
              onUpdateItem(item.exercise_id, "reps", value)
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DAY</Text>
          <View style={styles.daysRow}>
            {weekDays.map((day) => {
              const isSelected = item.day.includes(day);

              return (
                <Pressable
                  key={day}
                  style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                  onPress={() => onToggleDay(item.exercise_id, day)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      isSelected && styles.dayChipTextSelected,
                    ]}
                  >
                    {day.slice(0, 3).toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#202020",
    marginBottom: 14,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardTag: {
    color: "#e7efbb",
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 6,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#232323",
    color: "#f4f4f4",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayChip: {
    minWidth: 48,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#232323",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dayChipSelected: {
    backgroundColor: "#d7ff17",
  },
  dayChipText: {
    color: "#f4f4f4",
    fontSize: 12,
    fontWeight: "800",
  },
  dayChipTextSelected: {
    color: "#121212",
  },
});
