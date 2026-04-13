import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ExerciseDetailsHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable
        hitSlop={10}
        onPress={() => router.back()}
        style={styles.headerIconButton}
      >
        <MaterialIcons name="arrow-back" size={24} color="#eef6c8" />
      </Pressable>

      <Text style={styles.headerTitle}>EXERCISE DETAILS</Text>

      <View style={styles.headerRightSpace} />
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
  headerRightSpace: {
    width: 28,
  },
});
