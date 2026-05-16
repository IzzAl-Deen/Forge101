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
        height: 80,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(14,14,14,0.7)'
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
    headerTitle: {
        color: '#cefc22',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
        flex: 1,
        marginBottom:8


    },
});