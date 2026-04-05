import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, ImageBackground, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { supabase } from "@/lib/supabase";
import { Kinetic } from "@/constants/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,}$/;

type FormData = { name: string; email: string; password: string };

export default function RegisterScreen() {
	const router = useRouter();
	const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
		defaultValues: { name: "", email: "", password: "" },
	});

	async function onSubmit(data: FormData) {
		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: { data: { full_name: data.name } },
		});
		if (error) {
			Alert.alert("Registration failed", error.message);
		} else {
			router.replace("/(private)/(tabs)");
		}
	}

	return (
		<ImageBackground source={{ uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900" }} style={styles.bg} blurRadius={Platform.OS === "web" ? 0 : 2}>
			<View style={styles.overlay} />
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<View style={styles.card}>
					<Text style={styles.brand}>FORGE</Text>

					<Text style={styles.title}>Create Your Account</Text>
					<Text style={styles.subtitle}>Ignite your performance. Join the elite network of Forge101 athletes.</Text>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>NAME</Text>
						<Controller
							control={control}
							name="name"
							rules={{ required: "Full name is required." }}
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={[styles.input, errors.name ? styles.inputError : null]}
									placeholder="Full Name"
									placeholderTextColor={Kinetic.textFaint}
									value={value}
									onChangeText={onChange}
								/>
							)}
						/>
						{errors.name ? <Text style={styles.errorText}>{errors.name.message}</Text> : null}
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>EMAIL</Text>
						<Controller
							control={control}
							name="email"
							rules={{
								required: "Email is required.",
								pattern: { value: EMAIL_REGEX, message: "Enter a valid email address." },
							}}
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={[styles.input, errors.email ? styles.inputError : null]}
									placeholder="example@gmail.com"
									placeholderTextColor={Kinetic.textFaint}
									autoCapitalize="none"
									keyboardType="email-address"
									value={value}
									onChangeText={onChange}
								/>
							)}
						/>
						{errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>PASSWORD</Text>
						<Controller
							control={control}
							name="password"
							rules={{
								required: "Password is required.",
								pattern: { value: PASSWORD_REGEX, message: "7+ chars, uppercase, lowercase, number, and special character." },
							}}
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={[styles.input, errors.password ? styles.inputError : null]}
									placeholder="••••••••"
									placeholderTextColor={Kinetic.textFaint}
									secureTextEntry
									value={value}
									onChangeText={onChange}
								/>
							)}
						/>
						{errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}
					</View>

					<Pressable style={styles.btnWrapper} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
						<LinearGradient colors={["#e7f7c6", "#b8ff1a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
							<Text style={styles.btnText}>{isSubmitting ? "Registering..." : "Register →"}</Text>
						</LinearGradient>
					</Pressable>

					<Pressable style={styles.loginLink} onPress={() => router.push("/(public)/login")}>
						<Text style={styles.loginLinkText}>
							Already have an account? <Text style={styles.loginLinkAccent}>Login</Text>
						</Text>
					</Pressable>

					<View style={styles.divider} />

					<View style={styles.featureRow}>
						{[
							["SECURITY", "AES-256"],
							["SYNC", "REAL-TIME"],
							["PRIVACY", "ENCRYPTED"],
						].map(([label, value]) => (
							<View key={label} style={styles.featureCol}>
								<Text style={styles.featureLabel}>{label}</Text>
								<Text style={styles.featureValue}>{value}</Text>
							</View>
						))}
					</View>

					<View style={styles.pillWrapper}>
						<View style={styles.pill}>
							<View style={styles.statusDot} />
							<Text style={styles.pillText}>SYSTEM ACTIVE</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	bg: { flex: 1, backgroundColor: "#0a0a0a" },
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Kinetic.overlayBg,
	},
	decorText: {
		position: "absolute",
		right: -20,
		top: "15%",
		fontSize: 220,
		fontWeight: "800",
		color: "rgba(255,255,255,0.06)",
		zIndex: 0,
	},
	scroll: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
		paddingHorizontal: 16,
	},
	card: {
		width: "100%",
		maxWidth: 460,
		backgroundColor: Kinetic.cardBg,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Kinetic.cardBorder,
		padding: 32,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 20 },
		shadowOpacity: 0.6,
		shadowRadius: 40,
		elevation: 20,
	},
	brand: {
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 4,
		color: Kinetic.accentLight,
		marginBottom: 12,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: Kinetic.white,
		lineHeight: 38,
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 14,
		color: Kinetic.textMuted,
		lineHeight: 22,
		maxWidth: 300,
		marginBottom: 32,
	},
	fieldGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 11,
		letterSpacing: 1.5,
		fontWeight: "600",
		color: "rgba(255,255,255,0.5)",
		marginBottom: 6,
	},
	input: {
		height: 44,
		borderRadius: 6,
		backgroundColor: Kinetic.inputBg,
		borderWidth: 1,
		borderColor: Kinetic.inputBorder,
		paddingHorizontal: 14,
		fontSize: 14,
		color: Kinetic.white,
	},
	inputError: {
		borderColor: "#ff4d4d",
	},
	errorText: {
		marginTop: 5,
		fontSize: 11,
		color: "#ff4d4d",
	},
	btnWrapper: {
		marginTop: 28,
		borderRadius: 10,
		overflow: "hidden",
		shadowColor: "#a6ff00",
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
	loginLink: {
		marginTop: 14,
		alignItems: "center",
	},
	loginLinkText: {
		fontSize: 13,
		color: "rgba(255,255,255,0.55)",
	},
	loginLinkAccent: {
		color: Kinetic.accentGlow,
		fontWeight: "500",
	},
	divider: {
		height: 1,
		backgroundColor: Kinetic.divider,
		marginVertical: 26,
	},
	featureRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	featureCol: {
		alignItems: "center",
	},
	featureLabel: {
		fontSize: 10,
		letterSpacing: 1,
		color: "rgba(255,255,255,0.35)",
		marginBottom: 4,
	},
	featureValue: {
		fontSize: 12,
		fontWeight: "600",
		color: Kinetic.white,
	},
	pillWrapper: {
		alignItems: "center",
		marginTop: 18,
	},
	pill: {
		height: 30,
		paddingHorizontal: 14,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.05)",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Kinetic.accentGlow,
	},
	pillText: {
		fontSize: 10,
		letterSpacing: 1,
		color: "rgba(255,255,255,0.65)",
	},
});
