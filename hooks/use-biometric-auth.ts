import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";

const BIOMETRIC_ENABLED_KEY = "biometric_enabled";
const BIOMETRIC_REFRESH_TOKEN_KEY = "biometric_refresh_token";

export async function isBiometricAvailable(): Promise<boolean> {
	if (Platform.OS === "web") return false;
	const hasHardware = await LocalAuthentication.hasHardwareAsync();
	if (!hasHardware) return false;
	const isEnrolled = await LocalAuthentication.isEnrolledAsync();
	return isEnrolled;
}

export async function isBiometricEnabled(): Promise<boolean> {
	try {
		const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
		return value === "true";
	} catch {
		return false;
	}
}

export async function enableBiometrics(refreshToken: string): Promise<void> {
	await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, "true");
	await SecureStore.setItemAsync(BIOMETRIC_REFRESH_TOKEN_KEY, refreshToken);
}

export async function disableBiometrics(): Promise<void> {
	await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
	await SecureStore.deleteItemAsync(BIOMETRIC_REFRESH_TOKEN_KEY);
}

export async function authenticateWithBiometrics(): Promise<"success" | "cancelled" | "error"> {
	const result = await LocalAuthentication.authenticateAsync({
		promptMessage: "Log in to Forge101",
		fallbackLabel: "Use password",
		cancelLabel: "Cancel",
	});

	if (!result.success) {
		return result.error === "user_cancel" || result.error === "system_cancel" ? "cancelled" : "error";
	}

	const refreshToken = await SecureStore.getItemAsync(BIOMETRIC_REFRESH_TOKEN_KEY);
	if (!refreshToken) return "error";

	const { error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
	if (error) return "error";

	// Update stored refresh token with the newly rotated one
	const { data: { session } } = await supabase.auth.getSession();
	if (session?.refresh_token) {
		await SecureStore.setItemAsync(BIOMETRIC_REFRESH_TOKEN_KEY, session.refresh_token);
	}

	return "success";
}
