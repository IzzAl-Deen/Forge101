import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export type PendingExercise = {
    exercise_id: number;
    name: string;
    sets: string;
    reps: string;
    day: string[];
};

type Props = {
    exercises?: PendingExercise[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (
        index: number,
        field: "sets" | "reps",
        value: string
    ) => void;
};

export default function PlanExercises({
    exercises,
    onAdd,
    onRemove,
    onChange,
}: Props) {
    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.label}>EXERCISES</Text>

                <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
                    <Text style={styles.addText}>+ Add Exercise</Text>
                </TouchableOpacity>

            </View>
            {exercises?.map((ex, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.name}>
                        {ex.name ?? `Exercise ${index + 1}`}
                    </Text>

                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={ex.sets}
                        placeholder="Sets"
                        placeholderTextColor="#777"
                        onChangeText={(t) =>
                            onChange(index, "sets", t)
                        }
                    />

                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={ex.reps}
                        placeholder="Reps"
                        placeholderTextColor="#777"
                        onChangeText={(t) =>
                            onChange(index, "reps", t)
                        }
                    />

                    <Text style={styles.dayText}>
                        Days: {ex.day.length > 0 ? ex.day.join(", ") : "None"}
                    </Text>

                    <TouchableOpacity onPress={() => onRemove(index)}>
                        <Text style={styles.remove}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}


        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 18,
        marginBottom: 6,
        letterSpacing: 1,
    },

    card: {
        backgroundColor: "#1A1A1A",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
    },

    name: {
        color: "#fff",
        marginBottom: 8,
        fontWeight: "600",
    },

    input: {
        backgroundColor: "#121212",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        marginTop: 6,
    },

    remove: {
        color: "#ff6767",
        marginTop: 10,
        fontWeight: "bold",
    },

    dayText: {
        color: "#bbb",
        marginTop: 10,
    },

    addBtn: {
        marginTop: 14,
        alignItems: "center",
    },

    addText: {
        color: "#ccff00",
        fontWeight: "600",
    },
});
