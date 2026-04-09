import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const EmptyState = () => {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <MaterialIcons name="playlist-add" size={50} color="#adaaaa" />
            </View>
            <Text style={styles.emptyTitle}>No exercises added yet</Text>
            <Text style={styles.emptySubtitle}>
                Start adding exercises to this plan
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#262626',
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#767575',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});