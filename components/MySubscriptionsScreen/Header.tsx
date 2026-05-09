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
    <MaterialIcons  style={styles.backIcon} name="arrow-back-ios" size={22} color="#f4ffc9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
    </View>
);
};

const styles = StyleSheet.create({
    header: {
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#262626',
        backgroundColor: '#0e0e0e',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },backIcon: {
        color: '#f4ffc9',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
});