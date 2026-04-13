import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface SaveExercisesButtonProps {
  itemCount: number;
  saving: boolean;
  onPress: () => void;
}

export function SaveExercisesButton({
  itemCount,
  saving,
  onPress,
}: SaveExercisesButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        (itemCount === 0 || saving) && styles.buttonDisabled,
      ]}
      disabled={itemCount === 0 || saving}
      onPress={onPress}
    >
      <Text style={styles.ctaText}>
        {saving ? "SAVING..." : "SAVE EXERCISES"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 28,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#d7ff17",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: "#101010",
    fontSize: 15,
    fontWeight: "900",
  },
});
