// components/AddButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

interface AddButtonProps {
    title?: string;
    route: Href;
}

export const AddButton = ({
 title = "ADD NEW PLAN",
route = "/plans/create" as Href
}: AddButtonProps) => {

    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push(route)}
        >
            <MaterialIcons name="add" size={24} color="#000" />
            <Text style={styles.addBtnText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: '#cefc22',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        shadowColor: '#cefc22',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    addBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.5,
    },
});