import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => {
                    router.back();
                }}
                style={styles.backBtn}
            >
                <MaterialIcons
                    style={styles.backIcon}
                    name="arrow-back-ios"
                    size={25}
                    color="#f4ffc9"
                />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 25,
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
    headerTitle: {
        color: '#f4ffc9',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'italic',
        marginLeft: 15,
        flex: 1,
    },
});