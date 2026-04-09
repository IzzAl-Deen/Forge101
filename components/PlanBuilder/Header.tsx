import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <MaterialIcons name="arrow-back" size={24} color="#cefc22" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(14,14,14,0.7)'
    },
    backBtn: { padding: 8 },
    headerTitle: {
        color: '#cefc22',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        flex: 1
    },
});