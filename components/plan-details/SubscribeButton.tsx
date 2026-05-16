import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export function SubscribeButton({
  loading,
  onPress,
}: {
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#4b5f00" />
      ) : (
        <Text style={styles.text}>SUBSCRIBE TO PLAN</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d9ff2f",
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 34,
  },
  text: { color: "#4b5f00", fontSize: 20, fontWeight: "900", letterSpacing: 2 },
});