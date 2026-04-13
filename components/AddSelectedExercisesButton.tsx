import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AddSelectedExercisesButtonProps {
  selectedCount: number;
  onPress: () => void;
}

export function AddSelectedExercisesButton({
  selectedCount,
  onPress,
}: AddSelectedExercisesButtonProps) {
  return (
    <Pressable
      style={[
        styles.ctaWrapper,
        selectedCount === 0 && styles.ctaWrapperDisabled,
      ]}
      disabled={selectedCount === 0}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#eff8c6", "#d0ff00"]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaText}>ADD SELECTED EXERCISES</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{selectedCount}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ctaWrapper: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 28,
    borderRadius: 14,
    shadowColor: "#d7ff17",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 10,
  },
  ctaWrapperDisabled: {
    opacity: 0.5,
  },
  ctaButton: {
    minHeight: 58,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  ctaText: {
    color: "#4e5912",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    paddingHorizontal: 8,
  },
  countText: {
    color: "#506100",
    fontSize: 15,
    fontWeight: "900",
  },
});
