import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

const SignUp = () => {

    const navigation = useNavigation<NavigationProp>(); 

  return (
    <SafeAreaView style={styles.signUp}>
      <Image
        style={styles.aiImage}
        resizeMode="cover"
        source={require("../assets/showspotlogo.png")}
      />
      <Text style={styles.signUpFor}>sign up for showspot</Text>

      <View style={[styles.input, styles.inputLayout]}>
        <Text style={[styles.enterFullName, styles.enterClr]}>enter full name</Text>
      </View>

      <View style={[styles.input1, styles.inputLayout]}>
        <Text style={[styles.enterEmail, styles.continuePosition]}>enter email</Text>
      </View>

      <View style={[styles.input2, styles.inputLayout]}>
        <Text style={[styles.enterEmail, styles.continuePosition]}>enter password</Text>
      </View>

      <View style={[styles.button, styles.buttonLayout]}>
        <Text style={[styles.continue, styles.continuePosition]}>continue</Text>
      </View>

      <LinearGradient
        style={[styles.button1, styles.buttonLayout]}
        locations={[0, 1]}
        colors={["#ff00ff", "#2a2882"]}
        useAngle={true}
        angle={180}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={[styles.getStarted, styles.continuePosition]}>log in</Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputLayout: {
    height: 40,
    width: 352,
    borderColor: "#fafafa",
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderStyle: "solid",
    position: "absolute",
    overflow: "hidden",
  },
  enterClr: {
    color: "#b4b3b3",
    left: 10,
  },
  continuePosition: {
    marginTop: -10,
    fontSize: 16,
    top: "50%",
    textAlign: "center",
    fontFamily: "Amiko-Regular",
    position: "absolute",
  },
  buttonLayout: {
    height: 50,
    width: 353,
    borderRadius: 12,
    marginLeft: -176.5,
    left: "50%",
    position: "absolute",
    overflow: "hidden",
  },
  aiImage: {
    marginLeft: -44.5,
    top: 125,
    borderRadius: 30,
    width: 90,
    height: 100,
    left: "50%",
    position: "absolute",
  },
  signUpFor: {
    top: 251,
    left: 71,
    fontSize: 24,
    color: "#000",
    textAlign: "center",
    fontFamily: "Amiko-Regular",
    position: "absolute",
  },
  enterFullName: {
    marginTop: -11,
    fontSize: 16,
    top: "50%",
    color: "#b4b3b3",
    left: 10,
    textAlign: "center",
    fontFamily: "Amiko-Regular",
    position: "absolute",
  },
  input: {
    top: 326,
    left: 20,
    height: 40,
    width: 352,
    borderColor: "#fafafa",
    backgroundColor: "#f4f4f4",
  },
  enterEmail: {
    color: "#b4b3b3",
    left: 10,
    marginTop: -10,
  },
  input1: {
    top: 398,
    left: 20,
    height: 40,
    width: 352,
    borderColor: "#fafafa",
    backgroundColor: "#f4f4f4",
  },
  input2: {
    top: 469,
    left: 21,
  },
  continue: {
    marginLeft: -35.5,
    color: "#222",
    left: "50%",
  },
  button: {
    top: 661,
    borderColor: "#ff00ff",
    borderWidth: 1,
    borderStyle: "solid",
    height: 50,
    width: 353,
    borderRadius: 12,
    marginLeft: -176.5,
  },
  getStarted: {
    marginLeft: -21.5,
    color: "#fff",
    left: "50%",
  },
  button1: {
    top: 743,
    backgroundColor: "transparent",
  },
  signUp: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 852,
    overflow: "hidden",
  },
});

export default SignUp;
