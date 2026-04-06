import { Pressable, StyleSheet, Text } from "react-native";

import { Fonts, Kinetic } from "@/constants/theme";

type ExerciseCategoryChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function ExerciseCategoryChip({
  label,
  selected,
  onPress,
}: ExerciseCategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed && styles.chipPressed,
      ]}>
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minWidth: 72,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  chipIdle: {
    backgroundColor: "#1f1f1f",
  },
  chipPressed: {
    opacity: 0.82,
  },
  chipSelected: {
    backgroundColor: Kinetic.accentPrimary,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  labelIdle: {
    color: "rgba(255,255,255,0.65)",
  },
  labelSelected: {
    color: "#17190d",
  },
});
