import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function PrivateLayout() {
	const [session, setSession] = useState<Session | null | undefined>(undefined);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	if (session === undefined) return <View style={{ flex: 1, backgroundColor: "#0a0a0a" }} />;

	if (!session) return <Redirect href="/(public)" />;

	return <Stack screenOptions={{ headerShown: false }} />;
}
