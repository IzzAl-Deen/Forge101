import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useColorScheme } from "@/hooks/use-color-scheme";
import { initDatabase } from "@/api/db/database";
import { useEffect } from "react";

export default function RootLayout() {
	const colorScheme = useColorScheme();

	useEffect(() => {
		initDatabase();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(public)" />
					<Stack.Screen name="(private)" />
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
