// screens/WelcomeScreen.tsx
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.welcome}>
      <Image
        style={styles.aiImage}
        resizeMode="cover"
        source={require("./../assets/showspotlogo.png")}
      />
      <Text style={styles.showspot}>ShowSpot</Text>

      <LinearGradient
        style={[styles.button, styles.buttonLayout]}
        locations={[0, 1]}
        colors={["#ff00ff", "#2a2882"]}
        useAngle
        angle={180}
      >
        <Text style={[styles.getStarted, styles.buttonText]}>Get Started</Text>
      </LinearGradient>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <View style={[styles.button1, styles.buttonLayout]}>
          <Text style={[styles.logIn, styles.buttonText]}>Log In</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // your existing styles here
  // rename aiImage3c690... to just aiImage to simplify
  aiImage: {
    marginLeft: -150.5,
    top: 165,
    borderRadius: 40,
    width: 301,
    height: 335,
    left: "50%",
    position: "absolute",
  },
  showspot: {
    marginLeft: -92.5,
    top: 202,
    fontSize: 32,
    fontFamily: "Audiowide-Regular",
    textAlign: "center",
    color: "#222",
    left: "50%",
    position: "absolute",
  },
  buttonLayout: {
    height: 50,
    width: 353,
    borderRadius: 12,
    left: 20,
    position: "absolute",
    overflow: "hidden",
  },
  getStarted: {
    marginLeft: -45.5,
    color: "#fff",
  },
  logIn: {
    marginLeft: -22.5,
    color: "#222",
    fontSize: 16,
    marginTop: -10,
  },
  buttonText: {
    fontFamily: "Amiko-Regular",
    fontSize: 16,
    top: "50%",
    textAlign: "center",
    position: "absolute",
    left: "50%",
  },
  button: {
    top: 743,
    backgroundColor: "transparent",
  },
  button1: {
    top: 660,
    borderStyle: "solid",
    borderColor: "#ff00ff",
    borderWidth: 1,
  },
  welcome: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 852,
    overflow: "hidden",
  },
});

export default WelcomeScreen;
