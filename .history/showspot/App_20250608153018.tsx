import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
    return (
        <SafeAreaView style={styles.welcome}>
            <Image style={styles.aiImage3c690b9c3c724afeB0Icon} resizeMode="cover" source={require("./assets/showspotlogo.png")} />
            <Text style={styles.showspot}>ShowSpot</Text>
            <LinearGradient style={[styles.button, styles.buttonLayout]} locations={[0,1]} colors={['#ff00ff','#2a2882']} useAngle={true} angle={180}>
                <Text style={[styles.getStarted, styles.logInPosition]}>Get Started</Text>
            </LinearGradient>
            <View style={[styles.button1, styles.buttonLayout]}>
                <Text style={[styles.logIn, styles.logInPosition]}>log In</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonLayout: {
        height: 50,
        width: 353,
        borderRadius: 12,
        left: 20,
        position: "absolute",
        overflow: "hidden"
    },
        logInPosition: {
        fontFamily: "Amiko-Regular",
        fontSize: 16,
        top: "50%",
        marginTop: -10,
        textAlign: "center",
        left: "50%",
        position: "absolute"
    },
        aiImage3c690b9c3c724afeB0Icon: {
        marginLeft: -150.5,
        top: 165,
        borderRadius: 40,
        width: 301,
        height: 335,
        left: "50%",
        position: "absolute"
    },
    showspot: {
        marginLeft: -92.5,
        top: 202,
        fontSize: 32,
        fontFamily: "Audiowide-Regular",
        textAlign: "center",
        color: "#222",
        left: "50%",
        position: "absolute"
    },
    getStarted: {
        marginLeft: -45.5,
        color: "#fff"
    },
    button: {
        top: 743,
        backgroundColor: "transparent"
    },
    logIn: {
        marginLeft: -22.5,
        color: "#222",
        fontSize: 16,
        top: "50%",
        marginTop: -10
    },
    button1: {
        top: 660,
        borderStyle: "solid",
        borderColor: "#ff00ff",
        borderWidth: 1
    },
    welcome: {
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        height: 852,
        overflow: "hidden"
    }
});

export default App;