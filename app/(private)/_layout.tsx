import { useAuth } from "@/hooks/use-auth";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function PrivateLayout() {
	const { session, isLoading } = useAuth();

	if (isLoading) return <View style={{ flex: 1, backgroundColor: "#0a0a0a" }} />;

	if (!session) return <Redirect href="/(public)" />;

	return <Stack screenOptions={{ headerShown: false }} />;
}
