import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { Fonts, Kinetic } from "@/constants/theme";

export default function HomeScreen() {
	const router = useRouter();
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setEmail(data.session?.user.email ?? null);
		});
	}, []);

	async function handleSignOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			Alert.alert("Sign out failed", error.message);
		} else {
			router.replace("/(public)");
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.emailLabel}>Logged in as</Text>
			<Text style={styles.email}>{email}</Text>

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
				style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
				<Text style={styles.primaryButtonText}>Open Select Exercises</Text>
			</Pressable>

			<Pressable onPress={handleSignOut} style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
				<Text style={styles.secondaryButtonText}>Sign Out</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonPressed: {
		opacity: 0.88,
	},
	container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, backgroundColor: "#0d0d0d", paddingHorizontal: 24 },
	emailLabel: { fontSize: 13, color: "#888" },
	email: { fontSize: 15, fontWeight: "600", color: "#fff", marginBottom: 8 },
	primaryButton: {
		backgroundColor: Kinetic.accentPrimary,
		borderRadius: 16,
		paddingHorizontal: 22,
		paddingVertical: 16,
		minWidth: 240,
	},
	primaryButtonText: {
		color: "#17190d",
		fontFamily: Fonts.sans,
		fontSize: 15,
		fontWeight: "900",
		textAlign: "center",
	},
	secondaryButton: {
		backgroundColor: "rgba(255,255,255,0.08)",
		borderColor: "rgba(255,255,255,0.12)",
		borderRadius: 16,
		borderWidth: 1,
		paddingHorizontal: 22,
		paddingVertical: 14,
		minWidth: 240,
	},
	secondaryButtonText: {
		color: "#fff",
		fontFamily: Fonts.sans,
		fontSize: 15,
		fontWeight: "700",
		textAlign: "center",
	},
});
