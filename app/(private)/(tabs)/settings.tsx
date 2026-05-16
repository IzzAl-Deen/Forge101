import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import authApi from "@/api/authApi";
import { Kinetic, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { authenticateWithBiometrics, disableBiometrics, enableBiometrics, isBiometricAvailable, isBiometricEnabled } from "@/hooks/use-biometric-auth";
import { supabase } from "@/lib/supabase";

type FormData = {
	name: string;
	avatarUrl: string;
};

export default function SettingsScreen() {
	const { signOut } = useAuth();
	const qc = useQueryClient();

	const [biometricAvailable, setBiometricAvailable] = useState(false);
	const [biometricEnabled, setBiometricEnabled] = useState(false);
	const [togglingBiometric, setTogglingBiometric] = useState(false);

	const { data: profileData } = useQuery({
		queryKey: ["profile"],
		queryFn: authApi.getProfile,
	});

	const defaultValues = useMemo<FormData>(() => ({ name: profileData?.name ?? "", avatarUrl: profileData?.avatar_url ?? "" }), [profileData]);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({ defaultValues });

	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	useEffect(() => {
		async function loadBiometric() {
			const available = await isBiometricAvailable();
			setBiometricAvailable(available);
			if (available) setBiometricEnabled(await isBiometricEnabled());
		}
		loadBiometric();
	}, []);

	const updateMutation = useMutation({
		mutationFn: authApi.updateProfile,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["profile"] });
			Alert.alert("Saved", "Your profile has been updated.");
		},
		onError: (err: Error) => Alert.alert("Save failed", err.message),
	});

	const handleSave = useCallback(
		(data: FormData) => {
			updateMutation.mutate({ name: data.name, avatar_url: data.avatarUrl || null });
		},
		[updateMutation],
	);

	const handleBiometricToggle = useCallback(async (value: boolean) => {
		setTogglingBiometric(true);
		try {
			if (value) {
				const result = await authenticateWithBiometrics();
				if (result !== "success") return;
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (!session?.refresh_token) {
					Alert.alert("Error", "No active session found.");
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
		} finally {
			setTogglingBiometric(false);
		}
	}, []);

	const handleSignOut = useCallback(() => {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Sign Out", style: "destructive", onPress: signOut },
		]);
	}, [signOut]);

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<View style={styles.header}>
					<Text style={styles.brand}>FORGE</Text>
					<Text style={styles.pageTitle}>SETTINGS</Text>
				</View>

				<View style={styles.avatarSection}>
					{profileData?.avatar_url ? (
						<Image source={{ uri: profileData.avatar_url }} style={styles.avatar} />
					) : (
						<View style={styles.avatarPlaceholder}>
							<MaterialIcons name="person" size={40} color={Kinetic.textFaint} />
						</View>
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>PROFILE</Text>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>FULL NAME</Text>
						<Controller
							control={control}
							name="name"
							rules={{ required: "Name is required." }}
							render={({ field: { onChange, value } }) => (
								<View style={[styles.inputRow, errors.name ? styles.inputRowError : null]}>
									<MaterialIcons name="person-outline" size={16} color={Kinetic.textFaint} style={styles.inputIcon} />
									<TextInput style={styles.input} placeholder="Your full name" placeholderTextColor={Kinetic.textFaint} value={value} onChangeText={onChange} />
								</View>
							)}
						/>
						{errors.name ? <Text style={styles.errorText}>{errors.name.message}</Text> : null}
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>AVATAR URL</Text>
						<Controller
							control={control}
							name="avatarUrl"
							render={({ field: { onChange, value } }) => (
								<View style={styles.inputRow}>
									<MaterialIcons name="image" size={16} color={Kinetic.textFaint} style={styles.inputIcon} />
									<TextInput style={styles.input} placeholder="https://example.com/avatar.jpg" placeholderTextColor={Kinetic.textFaint} value={value} onChangeText={onChange} autoCapitalize="none" keyboardType="url" />
								</View>
							)}
						/>
					</View>

					<Pressable style={styles.btnWrapper} onPress={handleSubmit(handleSave)} disabled={updateMutation.isPending}>
						<LinearGradient colors={[Kinetic.accentLight, Kinetic.accentPrimary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
							<Text style={styles.btnText}>{updateMutation.isPending ? "Saving..." : "SAVE CHANGES"}</Text>
						</LinearGradient>
					</Pressable>
				</View>

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

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>ACCOUNT</Text>
					<View style={styles.infoRow}>
						<MaterialIcons name="lock-outline" size={16} color={Kinetic.textFaint} />
						<Text style={styles.infoText}>Email and password can only be changed via your account provider.</Text>
					</View>
				</View>

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
	inputRowError: {
		borderColor: Kinetic.error,
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
	errorText: {
		fontSize: 11,
		color: Kinetic.error,
		marginTop: 4,
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
