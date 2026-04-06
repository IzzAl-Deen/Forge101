import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Fonts, Kinetic } from "@/constants/theme";

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>BUILDER PREVIEW</Text>
        <Text style={styles.title}>Exercise selector screen</Text>
        <Text style={styles.body}>
          This preview route reads exercises from the backend and lets you test the full selection UI
          before the plan builder flow is connected.
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/Plans/create",
              params: {
                planId: "draft-plan",
                planName: "New Builder Plan",
              },
            })
          }
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>
            OPEN SELECT EXERCISES
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    color: Kinetic.textMuted,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: Kinetic.accentPrimary,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: "#17190d",
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.8,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#0d0d0d",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  eyebrow: {
    color: Kinetic.accentLight,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: Kinetic.white,
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  safeArea: {
    backgroundColor: "#0d0d0d",
    flex: 1,
  },
});
