import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function SuccessModal({ visible, message, onClose }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 280,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  message: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ccff00",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});