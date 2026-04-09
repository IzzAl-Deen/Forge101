import { Plan } from "@/types/plan";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


type Props = {
    lable: string;
    inputtype:  "name" | "difficulty" | "duration_minutes";
    value: string | number; 
    onChange: (val: string) => void;
    leftsidetext?: string;
    placeholder?: string;
}

export default function PlaninputForm(Props: Props) {
    return (
        <View>
            <Text style={styles.label}>{Props.lable}</Text>
            <View style={styles.inputWrapper}>
                <View style={Props.leftsidetext === "MIN" && styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder={`e.g, ${Props.placeholder}`}
                        placeholderTextColor="#777"
                        value={String(Props.value)}
                        onChangeText={(t) => Props.onChange(t)}
                    />
                    <Text style={styles.minText}>{Props.leftsidetext}</Text>
                </View>
                <View style={styles.inputBottomGlow} />
            </View>
        </View>
    );
}


export const PlaninputFormDifficulty = (Props: Props) => {
    const difficulties = ["Easy", "Medium", "Hard", "Extreme"];
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <View>
            <Text style={styles.label}>{Props.lable}</Text>
            <View style={styles.inputWrapper}>
                <TouchableOpacity
                    style={[styles.inputRowDifficulty, styles.inputRow]}
                    onPress={() => setDropdownVisible(true)}
                >
                    <Text style={styles.inputText}>{Props.value}</Text>
                    <Ionicons name="chevron-down" size={18} color="#aaa" />
                </TouchableOpacity>

                <Modal transparent visible={dropdownVisible} animationType="fade">
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setDropdownVisible(false)}
                    >
                        <View style={styles.dropdown}>
                            {difficulties.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        Props.onChange(level)
                                        setDropdownVisible(false);
                                    }}
                                >
                                    <Text style={styles.dropdownText}>{level}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
                <View style={styles.inputBottomGlow} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 18,
        marginBottom: 6,
        marginLeft: 4,
        letterSpacing: 1,
    },


    input: {
        backgroundColor: "#1A1A1A",
        padding: 16,
        borderRadius: 14,
        color: "#fff",
    },

    inputRowDifficulty: {
        padding: 16,
    },

    inputRow: {
        backgroundColor: "#1A1A1A",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    inputText: {
        color: "#fff",
    },

    inputWrapper: {
        backgroundColor: "#1A1A1A",
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        overflow: "hidden",
    },

    inputBottomGlow: {
        height: 2,
        backgroundColor: "rgb(255, 255, 255)",
    },

    minText: {
        color: "#888",
        fontSize: 12,
        paddingHorizontal: 16,
    },





    // Dropdown styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        padding: 40,
    },

    dropdown: {
        backgroundColor: "#1A1A1A",
        borderRadius: 14,
    },

    dropdownItem: {
        padding: 16,
    },

    dropdownText: {
        color: "#fff",
        fontSize: 16,
    },
});