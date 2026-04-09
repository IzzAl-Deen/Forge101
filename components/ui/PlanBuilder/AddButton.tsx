import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

interface AddButtonProps {
    title?: string;
    route: Href;
}

export const AddButton = ({
                              title = "ADD EXERCISE",
                              route
                          }: AddButtonProps) => {

    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push(route)}
        >
            <MaterialIcons name="add-box" size={20} color="#000" />
            <Text style={styles.addBtnText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: '#cefc22',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10
    },
    addBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5
    },
});