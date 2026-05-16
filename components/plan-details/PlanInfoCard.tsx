import { StyleSheet, Text, View } from "react-native";

export function PlanInfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1d1d1d",
    borderRadius: 15,
    padding: 28,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#d9ff2f",
  },
  label: { color: "#aaa", letterSpacing: 2, marginBottom: 12 },
  value: { color: "#fff", fontSize: 24, fontWeight: "900" },
});