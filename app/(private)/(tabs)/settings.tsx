import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { supabase } from "@/lib/supabase";
import { Kinetic, Spacing } from "@/constants/theme";
import { authenticateWithBiometrics, disableBiometrics, enableBiometrics, isBiometricAvailable, isBiometricEnabled } from "@/hooks/use-biometric-auth";

export default function SettingsScreen() {
	const [fullName, setFullName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [saving, setSaving] = useState(false);

	const [biometricAvailable, setBiometricAvailable] = useState(false);
	const [biometricEnabled, setBiometricEnabled] = useState(false);
	const [togglingBiometric, setTogglingBiometric] = useState(false);

	useEffect(() => {
		async function load() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setFullName(user.user_metadata?.full_name ?? "");
				setAvatarUrl(user.user_metadata?.avatar_url ?? "");
			}
			const available = await isBiometricAvailable();
			setBiometricAvailable(available);
			if (available) {
				const enabled = await isBiometricEnabled();
				setBiometricEnabled(enabled);
			}
		}
		load();
	}, []);

	async function handleSave() {
		setSaving(true);
		const { error } = await supabase.auth.updateUser({
			data: { full_name: fullName, avatar_url: avatarUrl },
		});
		setSaving(false);
		if (error) {
			Alert.alert("Save failed", error.message);
		} else {
			Alert.alert("Saved", "Your profile has been updated.");
		}
	}

	async function handleBiometricToggle(value: boolean) {
		setTogglingBiometric(true);
		try {
			if (value) {
				// Verify identity before enabling
				const result = await authenticateWithBiometrics();
				if (result !== "success") {
					setTogglingBiometric(false);
					return;
				}
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (!session?.refresh_token) {
					Alert.alert("Error", "No active session found.");
					setTogglingBiometric(false);
					return;
				}
				await enableBiometrics(session.refresh_token);
				setBiometricEnabled(true);
			} else {
				await disableBiometrics();
				setBiometricEnabled(false);
			}
		} catch {
			Alert.alert("Error", "Failed to update biometric setting.");
		}
		setTogglingBiometric(false);
	}

	async function handleSignOut() {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Sign Out",
				style: "destructive",
				onPress: async () => {
					await disableBiometrics();
					await supabase.auth.signOut();
				},
			},
		]);
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.brand}>FORGE</Text>
					<Text style={styles.pageTitle}>SETTINGS</Text>
				</View>

				{/* Avatar preview */}
				<View style={styles.avatarSection}>
					{avatarUrl ? (
						<Image source={{ uri: avatarUrl }} style={styles.avatar} />
					) : (
						<View style={styles.avatarPlaceholder}>
							<MaterialIcons name="person" size={40} color={Kinetic.textFaint} />
						</View>
					)}
				</View>

				{/* Profile section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>PROFILE</Text>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>FULL NAME</Text>
						<View style={styles.inputRow}>
							<MaterialIcons name="person-outline" size={16} color={Kinetic.textFaint} style={styles.inputIcon} />
							<TextInput style={styles.input} placeholder="Your full name" placeholderTextColor={Kinetic.textFaint} value={fullName} onChangeText={setFullName} />
						</View>
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>AVATAR URL</Text>
						<View style={styles.inputRow}>
							<MaterialIcons name="image" size={16} color={Kinetic.textFaint} style={styles.inputIcon} />
							<TextInput style={styles.input} placeholder="https://example.com/avatar.jpg" placeholderTextColor={Kinetic.textFaint} value={avatarUrl} onChangeText={setAvatarUrl} autoCapitalize="none" keyboardType="url" />
						</View>
					</View>

					<Pressable style={styles.btnWrapper} onPress={handleSave} disabled={saving}>
						<LinearGradient colors={[Kinetic.accentLight, Kinetic.accentPrimary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
							<Text style={styles.btnText}>{saving ? "Saving..." : "SAVE CHANGES"}</Text>
						</LinearGradient>
					</Pressable>
				</View>

				{/* Security section */}
				{biometricAvailable && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>SECURITY</Text>
						<View style={styles.rowItem}>
							<View style={styles.rowItemLeft}>
								<MaterialIcons name={Platform.OS === "ios" ? "face" : "fingerprint"} size={20} color={Kinetic.accentPrimary} />
								<View style={styles.rowItemText}>
									<Text style={styles.rowItemTitle}>{Platform.OS === "ios" ? "Face ID / Touch ID" : "Fingerprint Login"}</Text>
									<Text style={styles.rowItemSubtitle}>Log in without a password</Text>
								</View>
							</View>
							<Switch value={biometricEnabled} onValueChange={handleBiometricToggle} disabled={togglingBiometric} trackColor={{ false: Kinetic.inputBorder, true: Kinetic.accentPrimary }} thumbColor={biometricEnabled ? Kinetic.dark : Kinetic.textMuted} />
						</View>
					</View>
				)}

				{/* Account section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>ACCOUNT</Text>
					<View style={styles.infoRow}>
						<MaterialIcons name="lock-outline" size={16} color={Kinetic.textFaint} />
						<Text style={styles.infoText}>Email and password can only be changed via your account provider.</Text>
					</View>
				</View>

				{/* Sign out */}
				<Pressable style={styles.signOutBtn} onPress={handleSignOut}>
					<MaterialIcons name="logout" size={18} color={Kinetic.error} />
					<Text style={styles.signOutText}>SIGN OUT</Text>
				</Pressable>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0a0a0a",
	},
	scroll: {
		flexGrow: 1,
		paddingHorizontal: Spacing.md,
		paddingTop: Spacing.xxl + 8,
		paddingBottom: Spacing.xxl,
	},
	header: {
		marginBottom: Spacing.xl,
	},
	brand: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 4,
		color: Kinetic.accentLight,
		marginBottom: 4,
	},
	pageTitle: {
		fontSize: 28,
		fontWeight: "800",
		color: Kinetic.white,
		letterSpacing: 3,
	},
	avatarSection: {
		alignItems: "center",
		marginBottom: Spacing.xl,
	},
	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		borderWidth: 2,
		borderColor: Kinetic.accentPrimary,
	},
	avatarPlaceholder: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: Kinetic.cardSecondary,
		borderWidth: 2,
		borderColor: Kinetic.outlineBorder,
		justifyContent: "center",
		alignItems: "center",
	},
	section: {
		backgroundColor: Kinetic.cardBg,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Kinetic.cardBorder,
		padding: Spacing.md,
		marginBottom: Spacing.md,
	},
	sectionTitle: {
		fontSize: 11,
		letterSpacing: 2,
		fontWeight: "600",
		color: Kinetic.accentPrimary,
		marginBottom: Spacing.md,
	},
	fieldGroup: {
		marginBottom: Spacing.md,
	},
	label: {
		fontSize: 11,
		letterSpacing: 1.5,
		fontWeight: "600",
		color: "rgba(255,255,255,0.5)",
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
		marginTop: Spacing.sm,
		borderRadius: 10,
		overflow: "hidden",
		shadowColor: Kinetic.accentPrimary,
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 6,
	},
	btn: {
		height: 46,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	btnText: {
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: 1,
		color: Kinetic.dark,
	},
	rowItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rowItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
		flex: 1,
	},
	rowItemText: {
		flex: 1,
	},
	rowItemTitle: {
		fontSize: 14,
		fontWeight: "500",
		color: Kinetic.white,
	},
	rowItemSubtitle: {
		fontSize: 12,
		color: Kinetic.textMuted,
		marginTop: 2,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: Spacing.sm,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		color: Kinetic.textMuted,
		lineHeight: 20,
	},
	signOutBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.sm,
		height: 46,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "rgba(255,77,77,0.3)",
		backgroundColor: "rgba(255,77,77,0.08)",
		marginTop: Spacing.sm,
	},
	signOutText: {
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 1.5,
		color: Kinetic.error,
	},
});
