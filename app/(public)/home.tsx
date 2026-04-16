import TodaysFocus from "@/components/home/myexercises";
import HomePlans from "@/components/home/myplans";
import { SearchBar } from "@/components/SearchBar";
import Header from "@/components/ui/header";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <Header title="Home" />
            <ScrollView>

                <SearchBar value={searchQuery} onChangeText={handleSearchChange} />

                <HomePlans />
                <TodaysFocus />

                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push("/(private)/plans/(MySubscriptions)/MySubscriptions")
                    }
                >
                    <Text style={styles.buttonText}>My Subscriptions</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 24,
    },
    button: {
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#cefc22",
        alignItems: "center",
    },
    buttonText: {
        color: "#0a0a0a",
        fontSize: 16,
        fontWeight: "700",
    },
});
