import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Plan from "@/api/plansApi";


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
            <ScrollView style={{ height: 225, marginTop: 10 }} >
                {exercises?.map((ex, index) => (
                    <View key={index} style={styles.card}>
                        <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center" }}>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>
                                    {ex.name ?? `Exercise ${index + 1}`}
                                </Text>

                                <Text style={styles.dayText}>
                                    Days: {ex.day.length > 0 ? ex.day.join(", ") : "None"}
                                </Text>
                            </View>

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



                            <TouchableOpacity onPress={() => onRemove(index)}>
                                <View style={styles.remove}>
                                    <AntDesign name="close" size={20} color="#121212" />
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                ))}
            </ScrollView>

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
        padding: 10,
        borderRadius: 16,
        marginTop: 10,
        alignContent: "center",
        justifyContent: "center",
    },

    name: {
        color: "#fff",
        marginBottom: 3,
        fontWeight: "600",
    },

    input: {
        backgroundColor: "#121212",
        color: "#fff",
        textAlign: "center",
        padding: 10,
        height: 35,
        alignSelf: "center",
        width: 45,
        alignItems: "center",
        borderRadius: 10,
    },

    remove: {
        backgroundColor: "#ff6767",
        borderRadius: 50,
        padding: 5,
        paddingVertical: 3,
    },

    dayText: {
        color: "#bbb",
        fontSize: 10,
        marginBottom: 10,
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
