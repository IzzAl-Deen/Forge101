import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface MuscleFilterChipsProps {
  filters: string[];
  selectedMuscle: string;
  onSelectMuscle: (muscle: string) => void;
}

export function MuscleFilterChips({
  filters,
  selectedMuscle,
  onSelectMuscle,
}: MuscleFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {filters.map((item) => {
        const isActive = selectedMuscle === item;

        return (
          <Pressable
            key={item}
            onPress={() => onSelectMuscle(item)}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive,
              ]}
            >
              {item.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    paddingBottom: 18,
    gap: 10,
  },
  filterChip: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 17,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: "#d7ff17",
  },
  filterChipText: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  filterChipTextActive: {
    color: "#121212",
  },
});
