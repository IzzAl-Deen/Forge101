import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Plans from "@/api/plansApi";

type FocusExercise = {
    pivot: any;
    id: number;
    name: string;
    sets: number;
    reps: number;
    day: string;
    target_muscle?: string;
    image_url?: string;
};

export default function TodaysFocus() {
    const [loading, setLoading] = useState(true);
    const [focusExercises, setFocusExercises] = useState<FocusExercise[]>([]);
    const [fromplan, setFromPlan] = useState<string>("");

    useEffect(() => {
        fetchTodaysExercises();
    }, []);

    const fetchTodaysExercises = async () => {
        try {
            setLoading(true);
            const allPlans = await Plans.getAll();

            if (!allPlans.length) return;
            const randomPlan =
                allPlans[Math.floor(Math.random() * allPlans.length)];

            const response = await Plans.getExercises(randomPlan.id);

            setFocusExercises(response.exercises);
            setFromPlan(randomPlan.name);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's Focus</Text>

            <FlatList
                scrollEnabled={false}
                data={focusExercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <Image
                            source={{
                                uri:
                                    item.image_url ||
                                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
                            }}
                            style={styles.image}
                        />

                        <View style={styles.content}>
                            <Text style={styles.name}>{item.name}</Text>

                            <Text style={styles.meta}>
                                {item.target_muscle?.toUpperCase()} • {item.pivot.sets} SETS •{" "}
                                {item.pivot.reps} REPS
                                {item.pivot.day ? ` • ${item.pivot.day.toUpperCase()}` : ""}
                            </Text>

                            <Text style={styles.meta}>From: {fromplan}</Text>
                        </View>

                        <TouchableOpacity style={styles.playBtn}>
                            <Text style={styles.playText}>▶</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
    },

    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },

    card: {
        flexDirection: "row",
        backgroundColor: "#1a1a1a",
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 12,
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },

    content: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    meta: {
        color: "#888",
        marginTop: 4,
        fontSize: 12,
    },

    playBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
    },

    playText: {
        color: "#ccff00",
        fontSize: 16,
        fontWeight: "bold",
    },
});