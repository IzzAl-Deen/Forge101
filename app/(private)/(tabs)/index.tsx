import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";

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
			<Button title="Sign Out" onPress={handleSignOut} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
	emailLabel: { fontSize: 13, color: "#888" },
	email: { fontSize: 15, fontWeight: "600", color: "#fff" },
});
