
import { ImageBackground, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


export default function ImageSection() {
    return (
        <ImageBackground
            source={require("@/assets/images/create-plan-background.png")}
            style={styles.header}
            imageStyle={styles.headerImageRadius}
        >

            <LinearGradient

                colors={['transparent', 'rgba(0,0,0,0.4)', '#121212']}
                style={[styles.shadow, styles.headerImageRadius]}
                locations={[0, 0.5, 1]}
            />

            <View style={styles.headerOverlay}>
                <Text style={styles.smallTitle}>NEW ROUTINE</Text>
                <Text style={styles.bigTitle}>
                    UNLEASH{"\n"}POTENTIAL
                </Text>
            </View>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({

    header: {
        height: 220,
        width: "100%",
        justifyContent: "flex-end",
    },

    headerImageRadius: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    shadow: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '80%',
    },

    headerOverlay: {
        padding: 18,
    },



    smallTitle: {
        color: "#ccff00",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1.5,
    },

    bigTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        lineHeight: 30,
        marginTop: 4,
    },



})