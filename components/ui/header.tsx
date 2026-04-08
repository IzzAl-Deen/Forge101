import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';


export default function Header({ title }: { title: string }) {
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
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#727272',
        marginHorizontal: -25, 
        marginTop: -25,
        marginBottom: 15, 
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backIcon: {
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
        letterSpacing: 1,
    },
});