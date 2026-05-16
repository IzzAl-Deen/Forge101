import { initDatabase } from "@/api/db/database";
import { NavProvider } from "@/contexts/NavContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/queryClient";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NavProvider>
          <ThemeProvider
            value={colorScheme === "light" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(public)" />
              <Stack.Screen name="(private)" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </NavProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
