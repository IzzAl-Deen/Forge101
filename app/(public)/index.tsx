import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Kinetic, Spacing } from "@/constants/theme";

export default function LandingScreen() {
	const router = useRouter();

	return (
		<ImageBackground source={{ uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900" }} style={styles.bg} blurRadius={Platform.OS === "web" ? 0 : 2}>
			<View style={styles.overlay} />
			<View style={styles.container}>
				<View style={styles.brandRow}>
					<Text style={styles.brandLabel}>FORGE</Text>
					<View style={styles.pill}>
						<View style={styles.statusDot} />
						<Text style={styles.pillText}>SYSTEM ACTIVE</Text>
					</View>
				</View>

				<View style={styles.hero}>
					<Text style={styles.heroEyebrow}>PERFORMANCE TRAINING</Text>
					<Text style={styles.heroTitle}>
						FORGE YOUR{"\n"}
						<Text style={styles.heroAccent}>LIMITS.</Text>
					</Text>
					<Text style={styles.heroSubtitle}>The elite training platform built for athletes who refuse to stop.</Text>
				</View>

				<View style={styles.card}>
					<Pressable style={styles.btnWrapper} onPress={() => router.push("/(public)/register")}>
						<LinearGradient colors={[Kinetic.accentLight, Kinetic.accentPrimary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
							<Text style={styles.btnText}>Get Started →</Text>
						</LinearGradient>
					</Pressable>

					<Pressable style={styles.previewBtn} onPress={() => router.push("/(public)/exercise-preview")}>
						<Text style={styles.previewBtnText}>Preview Exercise Builder</Text>
					</Pressable>

					<View style={styles.dividerRow}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>ALREADY A MEMBER</Text>
						<View style={styles.dividerLine} />
					</View>

					<Pressable style={styles.loginBtn} onPress={() => router.push("/(public)/login")}>
						<Text style={styles.loginBtnText}>Sign In</Text>
					</Pressable>
				</View>

				<View style={styles.featureRow}>
					{[
						["MEMBERS", "12K+"],
						["PROGRAMS", "300+"],
						["COACHES", "50+"],
					].map(([label, value]) => (
						<View key={label} style={styles.featureCol}>
							<Text style={styles.featureValue}>{value}</Text>
							<Text style={styles.featureLabel}>{label}</Text>
						</View>
					))}
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	bg: { flex: 1, backgroundColor: Kinetic.dark },
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Kinetic.overlayBg,
	},
	decorText: {
		position: "absolute",
		right: -10,
		top: "8%",
		fontSize: 220,
		fontWeight: "800",
		color: "rgba(255,255,255,0.04)",
		zIndex: 0,
	},
	container: {
		flex: 1,
		paddingHorizontal: Spacing.xl,
		paddingTop: Spacing.xxl + 16,
		paddingBottom: Spacing.xl,
		justifyContent: "space-between",
	},
	brandRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	brandLabel: {
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 4,
		color: Kinetic.accentLight,
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.xs,
		height: 28,
		paddingHorizontal: Spacing.sm,
		borderRadius: 20,
		backgroundColor: Kinetic.inputBg,
		borderWidth: 1,
		borderColor: Kinetic.cardBorder,
	},
	statusDot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: Kinetic.accentGlow,
	},
	pillText: {
		fontSize: 9,
		letterSpacing: 1,
		color: Kinetic.textMuted,
	},
	hero: {
		flex: 1,
		justifyContent: "center",
		paddingVertical: Spacing.xl,
	},
	heroEyebrow: {
		fontSize: 11,
		letterSpacing: 3,
		fontWeight: "600",
		color: Kinetic.accentGlow,
		marginBottom: Spacing.sm,
	},
	heroTitle: {
		fontSize: 52,
		fontWeight: "800",
		color: Kinetic.white,
		lineHeight: 58,
		marginBottom: Spacing.md,
	},
	heroAccent: {
		color: Kinetic.accentPrimary,
	},
	heroSubtitle: {
		fontSize: 15,
		color: Kinetic.textMuted,
		lineHeight: 24,
		maxWidth: 300,
	},
	card: {
		backgroundColor: Kinetic.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Kinetic.cardBorder,
		padding: Spacing.xl,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 20 },
		shadowOpacity: 0.5,
		shadowRadius: 30,
		elevation: 16,
	},
	btnWrapper: {
		borderRadius: 10,
		overflow: "hidden",
		shadowColor: Kinetic.accentPrimary,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.35,
		shadowRadius: 16,
		elevation: 8,
	},
	btn: {
		height: 50,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	btnText: {
		fontSize: 16,
		fontWeight: "600",
		color: Kinetic.dark,
	},
	dividerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: Spacing.md,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: Kinetic.divider,
	},
	dividerText: {
		fontSize: 10,
		letterSpacing: 1.5,
		color: Kinetic.textFaint,
		marginHorizontal: Spacing.sm,
	},
	loginBtn: {
		height: 46,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: Kinetic.outlineBorder,
		backgroundColor: Kinetic.cardSecondary,
	},
	loginBtnText: {
		fontSize: 15,
		fontWeight: "500",
		color: Kinetic.white,
	},
	previewBtn: {
		height: 46,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(184,255,26,0.28)",
		backgroundColor: "rgba(184,255,26,0.07)",
		marginTop: Spacing.sm,
	},
	previewBtnText: {
		fontSize: 15,
		fontWeight: "600",
		color: Kinetic.accentLight,
	},
	featureRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: Spacing.lg,
	},
	featureCol: {
		alignItems: "center",
	},
	featureValue: {
		fontSize: 20,
		fontWeight: "700",
		color: Kinetic.white,
		marginBottom: 4,
	},
	featureLabel: {
		fontSize: 10,
		letterSpacing: 1.5,
		color: Kinetic.textFaint,
	},
});
