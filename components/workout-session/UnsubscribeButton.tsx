import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function UnsubscribeButton({ onPress }: { onPress: () => void }) {
  return (
    <>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>UNSUBSCRIBE FROM PLAN</Text>
      </TouchableOpacity>
      <Text style={styles.note}>CHANGES WILL TAKE EFFECT AT THE END OF YOUR CURRENT BILLING CYCLE.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#5b1b12",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
  },
  text: { color: "#ff6a3a", fontWeight: "900", fontSize: 11, letterSpacing: 1 },
  note: { color: "#555", textAlign: "center", fontSize: 9, marginTop: 12, letterSpacing: 1 },
});