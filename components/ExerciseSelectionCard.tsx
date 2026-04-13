import { Exercise } from "@/api/exerciseApi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface ExerciseSelectionCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onPress: () => void;
}

export function ExerciseSelectionCard({
  exercise,
  isSelected,
  onPress,
}: ExerciseSelectionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {exercise.image_url ? (
        <Image source={{ uri: exercise.image_url }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <MaterialIcons name="fitness-center" size={22} color="#6f6f6f" />
        </View>
      )}

      <View style={styles.cardBody}>
        <Text style={styles.cardTag}>
          {(exercise.target_muscle || exercise.category || "exercise")
            .replace(/_/g, " ")
            .toUpperCase()}
        </Text>
        <Text style={styles.cardTitle}>{exercise.name}</Text>
        <Text style={styles.cardMeta}>
          {exercise.category
            ? exercise.category[0].toUpperCase() + exercise.category.slice(1)
            : "Strength"}{" "}
          • {exercise.video_url ? "Video" : "Equipment"}
        </Text>
      </View>

      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <MaterialIcons name="check" size={22} color="#101010" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  cardSelected: {
    backgroundColor: "#1a1a18",
    borderColor: "rgba(215,255,23,0.26)",
    shadowColor: "#d7ff17",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: 78,
    height: 78,
    borderRadius: 12,
    backgroundColor: "#202020",
    marginRight: 16,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    paddingRight: 12,
  },
  cardTag: {
    color: "#e7efbb",
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 6,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 4,
  },
  cardMeta: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 15,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171717",
  },
  checkboxSelected: {
    backgroundColor: "#d7ff17",
    borderColor: "#d7ff17",
  },
});
