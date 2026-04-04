import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, ImageBackground, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { supabase } from "@/lib/supabase";
import { Kinetic, Spacing } from "@/constants/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormData = {
	email: string;
	password: string;
};

export default function LoginScreen() {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({ defaultValues: { email: "", password: "" } });

	async function onSubmit(data: FormData) {
		const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
		if (error) {
			Alert.alert("Login failed", error.message);
		} else {
			router.replace("/(private)/(tabs)");
		}
	}

	return (
		<ImageBackground source={{ uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900" }} style={styles.bg} blurRadius={Platform.OS === "web" ? 0 : 2}>
			<View style={styles.overlay} />
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<View style={styles.card}>
					<View style={styles.headerRow}>
						<Text style={styles.brand}>FORGE</Text>
						<Pressable>
							<MaterialIcons name="person-outline" size={22} color={Kinetic.textMuted} />
						</Pressable>
					</View>

					<View style={styles.hero}>
						<Text style={styles.heroTitle}>
							WELCOME{"\n"}
							<Text style={styles.heroAccent}>BACK</Text>
						</Text>
						<Text style={styles.subtitle}>Enter your credentials to access the pulse.</Text>
					</View>

					<View style={styles.formCard}>
						<View style={styles.fieldGroup}>
							<Text style={styles.label}>EMAIL ADDRESS</Text>
							<Controller
								control={control}
								name="email"
								rules={{
									required: "Email is required.",
									pattern: { value: EMAIL_REGEX, message: "Enter a valid email address." },
								}}
								render={({ field: { onChange, value } }) => (
									<View style={[styles.inputRow, errors.email ? styles.inputRowError : null]}>
										<MaterialIcons name="mail-outline" size={16} color={Kinetic.textFaint} style={styles.inputIcon} />
										<TextInput style={styles.input} placeholder="example@gmail.com" placeholderTextColor={Kinetic.textFaint} autoCapitalize="none" keyboardType="email-address" value={value} onChangeText={onChange} />
									</View>
								)}
							/>
							{errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}
						</View>

						<View style={styles.fieldGroup}>
							<View style={styles.labelRow}>
								<Text style={styles.label}>PASSWORD</Text>
								<Pressable>
									<Text style={styles.forgotLink}>FORGOT PASSWORD?</Text>
								</Pressable>
							</View>
							<Controller
								control={control}
								name="password"
								rules={{ required: "Password is required." }}
								render={({ field: { onChange, value } }) => (
									<View style={[styles.inputRow, errors.password ? styles.inputRowError : null]}>
										<MaterialIcons name="lock-outline" size={16} color={Kinetic.textFaint} style={styles.inputIcon} />
										<TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Kinetic.textFaint} secureTextEntry value={value} onChangeText={onChange} />
									</View>
								)}
							/>
							{errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}
						</View>
					</View>

					<Pressable style={styles.btnWrapper} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
						<LinearGradient colors={[Kinetic.accentLight, Kinetic.accentPrimary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
							<Text style={styles.btnText}>{isSubmitting ? "Logging in..." : "LOGIN ⚡"}</Text>
						</LinearGradient>
					</Pressable>

					<View style={styles.dividerRow}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>OR CONNECT VIA</Text>
						<View style={styles.dividerLine} />
					</View>

					<View style={styles.socialRow}>
						<Pressable style={styles.socialBtn}>
							<MaterialIcons name="g-mobiledata" size={20} color={Kinetic.white} />
							<Text style={styles.socialText}>Google</Text>
						</Pressable>
						<Pressable style={styles.socialBtn}>
							<MaterialIcons name="apple" size={18} color={Kinetic.white} />
							<Text style={styles.socialText}>Apple ID</Text>
						</Pressable>
					</View>
				</View>

				<Pressable style={styles.footer} onPress={() => router.push("/(public)/register")}>
					<Text style={styles.footerText}>
						Don't have an account? <Text style={styles.footerAccent}>Register</Text>
					</Text>
				</Pressable>
			</ScrollView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	bg: {
		flex: 1,
		backgroundColor: Kinetic.dark,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Kinetic.overlayBg,
	},
	decorText: {
		position: "absolute",
		right: -20,
		top: "10%",
		fontSize: 220,
		fontWeight: "800",
		color: "rgba(255,255,255,0.06)",
		zIndex: 0,
	},
	scroll: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: Spacing.xxl,
		paddingHorizontal: Spacing.sm + 4,
	},
	card: {
		width: "100%",
		maxWidth: 460,
		backgroundColor: Kinetic.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Kinetic.cardBorder,
		padding: Spacing.xl,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 20 },
		shadowOpacity: 0.6,
		shadowRadius: 40,
		elevation: 20,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: Spacing.lg,
	},
	brand: {
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 4,
		color: Kinetic.accentLight,
	},
	hero: {
		marginBottom: Spacing.xl,
	},
	heroTitle: {
		fontSize: 40,
		fontWeight: "800",
		color: Kinetic.white,
		lineHeight: 46,
		marginBottom: Spacing.sm,
	},
	heroAccent: {
		color: Kinetic.accentPrimary,
	},
	subtitle: {
		fontSize: 14,
		color: Kinetic.textMuted,
		lineHeight: 22,
	},
	formCard: {
		backgroundColor: Kinetic.cardSecondary,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Kinetic.cardBorder,
		padding: Spacing.md,
		marginBottom: Spacing.xs,
	},
	fieldGroup: {
		marginBottom: Spacing.md,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: Spacing.xs,
	},
	label: {
		fontSize: 11,
		letterSpacing: 1.5,
		fontWeight: "600",
		color: "rgba(255,255,255,0.5)",
		marginBottom: Spacing.xs,
	},
	forgotLink: {
		fontSize: 10,
		letterSpacing: 1,
		fontWeight: "600",
		color: Kinetic.accentGlow,
		marginBottom: Spacing.xs,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		height: 44,
		borderRadius: 6,
		backgroundColor: Kinetic.inputBg,
		borderWidth: 1,
		borderColor: Kinetic.inputBorder,
		paddingHorizontal: 14,
	},
	inputIcon: {
		marginRight: Spacing.xs + 2,
	},
	input: {
		flex: 1,
		fontSize: 14,
		color: Kinetic.white,
		height: "100%",
	},
	btnWrapper: {
		marginTop: Spacing.lg + 2,
		borderRadius: 10,
		overflow: "hidden",
		shadowColor: Kinetic.accentPrimary,
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.35,
		shadowRadius: 20,
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
		marginTop: Spacing.lg,
		marginBottom: Spacing.md,
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
	socialRow: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	socialBtn: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.xs,
		height: 44,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Kinetic.outlineBorder,
		backgroundColor: Kinetic.cardSecondary,
	},
	socialText: {
		fontSize: 13,
		fontWeight: "500",
		color: Kinetic.white,
	},
	footer: {
		marginTop: Spacing.lg,
		alignItems: "center",
	},
	footerText: {
		fontSize: 13,
		color: Kinetic.textMuted,
	},
	footerAccent: {
		color: Kinetic.accentGlow,
		fontWeight: "500",
	},
	inputRowError: {
		borderColor: Kinetic.error,
	},
	errorText: {
		fontSize: 11,
		color: Kinetic.error,
		marginTop: 4,
	},
});
