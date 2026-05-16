import { StyleSheet, Text, View } from "react-native";

export function StrategyCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>THE STRATEGY</Text>

      <Text style={styles.description}>
        Designed for those who have plateaued. Titan Hypertrophy utilizes
        progressive overload with an emphasis on time-under-tension.
        Expect heavy compound openers followed by metabolic stress finishers.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 30,
    marginTop: 26,
    borderWidth: 1,
    borderColor: "#222",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 22,
  },

  description: {
    color: "#aaa",
    fontSize: 17,
    lineHeight: 30,
  },
});