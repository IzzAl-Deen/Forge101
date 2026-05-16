import { StyleSheet, Text, View } from "react-native";

export function ProgressCard({ progress }: { progress: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>OVERALL PROGRESS {progress}% COMPLETED</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.text}>You're crushing your weekly targets. Keep the intensity high!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#222", borderRadius: 12, padding: 18, marginBottom: 30 },
  title: { color: "#fff", fontWeight: "900", marginBottom: 12 },
  track: { height: 9, backgroundColor: "#444", borderRadius: 20, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: "#e7ff9a" },
  text: { color: "#aaa", marginTop: 14, fontSize: 12, lineHeight: 18 },
});