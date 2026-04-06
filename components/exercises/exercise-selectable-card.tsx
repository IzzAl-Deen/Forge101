import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Fonts, Kinetic } from "@/constants/theme";
import type { Exercise } from "@/types/exercise";

type ExerciseSelectableCardProps = {
  exercise: Exercise;
  selected: boolean;
  onToggle: () => void;
};

function titleCase(value: string) {
  return value
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getSubtitle(exercise: Exercise) {
  return `${titleCase(exercise.category)} / ${titleCase(exercise.difficulty)}`;
}

export function ExerciseSelectableCard({
  exercise,
  selected,
  onToggle,
}: ExerciseSelectableCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardIdle,
        pressed && styles.cardPressed,
      ]}>
      {exercise.image_url ? (
        <Image
          contentFit="cover"
          source={{ uri: exercise.image_url }}
          style={styles.image}
          transition={150}
        />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>
            {exercise.name
              .split(" ")
              .slice(0, 2)
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.targetMuscle}>
          {exercise.target_muscle.toUpperCase()}
        </Text>
        <Text numberOfLines={2} style={styles.name}>
          {exercise.name}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {getSubtitle(exercise)}
        </Text>
      </View>

      <View style={[styles.checkbox, selected ? styles.checkboxSelected : styles.checkboxIdle]}>
        {selected ? <Feather color="#17190d" name="check" size={22} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#171717",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    padding: 16,
  },
  cardIdle: {
    borderColor: "rgba(255,255,255,0.04)",
  },
  cardPressed: {
    opacity: 0.94,
  },
  cardSelected: {
    backgroundColor: "#1b1b18",
    borderColor: "rgba(184,255,26,0.35)",
    shadowColor: Kinetic.accentPrimary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  checkbox: {
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    marginLeft: "auto",
    width: 34,
  },
  checkboxIdle: {
    borderColor: "rgba(255,255,255,0.2)",
  },
  checkboxSelected: {
    backgroundColor: Kinetic.accentPrimary,
    borderColor: Kinetic.accentPrimary,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  image: {
    backgroundColor: "#222",
    borderRadius: 12,
    height: 80,
    width: 80,
  },
  imageFallback: {
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 12,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  imageFallbackText: {
    color: "rgba(255,255,255,0.45)",
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  meta: {
    color: Kinetic.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  name: {
    color: Kinetic.white,
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  targetMuscle: {
    color: Kinetic.accentLight,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.1,
  },
});
