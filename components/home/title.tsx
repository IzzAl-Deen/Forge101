import { StyleSheet, Text, View } from "react-native";

export default function SectionTitle({ title, rightText, }: { title: string; rightText?: string; }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,

    },
    sectionTitle: {
        color: "#f4f4f4",
        fontSize: 18,
        fontWeight: 700,
    },

    rightText: {
        color: "#f4f4f4",
        fontSize: 14,
        opacity: 0.6,
    }
});