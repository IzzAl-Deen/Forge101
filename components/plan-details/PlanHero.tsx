import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function PlanHero({ plan }: { plan: any }) {
  const router = useRouter();

  return (
    <>
      <View style={styles.top}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Plan Details</Text>
      </View>

      <ImageBackground
        source={{
          uri:
            plan?.image_url ||
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        }}
        style={styles.hero}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PREMIUM PROGRAM</Text>
        </View>
        <Text style={styles.title}>{plan?.name || "TITAN HYPERTROPHY"}</Text>
        <Text style={styles.info}>DIFFICULTY: {plan?.difficulty?.toUpperCase() || "HARD"}</Text>
        <Text style={styles.info}>DURATION: {plan?.duration_minutes || 60} MINUTES</Text>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 30 },
  back: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: "#f4ffc9", fontSize: 32 },
  pageTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  hero: { height: 430, padding: 32, justifyContent: "center", marginBottom: 28 },
  image: { borderRadius: 18 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.62)", borderRadius: 18 },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e7ff9a",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginBottom: 28,
  },
  badgeText: { color: "#e7ff9a", fontWeight: "900", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 46, fontWeight: "900", marginBottom: 28 },
  info: { color: "#bbb", fontSize: 18, fontWeight: "900", marginTop: 18 },
});