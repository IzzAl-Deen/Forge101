import { Kinetic } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ExercisesScreenHeaderProps {
  onDone?: () => void;
}

export function ExercisesScreenHeader({ onDone }: ExercisesScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable
        hitSlop={10}
        onPress={() => router.back()}
        style={styles.headerIconButton}
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={Kinetic.accentLight}
        />
      </Pressable>

      <Text style={styles.headerTitle}>SELECT EXERCISES</Text>

      <Pressable hitSlop={10} onPress={onDone || (() => router.back())}>
        <Text style={styles.doneText}>DONE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerIconButton: {
    width: 28,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    color: "#eef6c8",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginLeft: 8,
  },
  doneText: {
    color: "#eef6c8",
    fontSize: 15,
    fontWeight: "800",
  },
});
