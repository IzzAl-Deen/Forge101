import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export function WorkoutHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <View>
        <Text style={styles.brand}>KINETIC NOIR</Text>
        <Text style={styles.subtitle}>ACTIVE PLAN</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 30,
  },

  back: {
    color: "#d9ff2f",
    fontSize: 28,
    fontWeight: "700",
  },

  brand: {
    color: "#d9ff2f",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#777",
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 1,
  },
});