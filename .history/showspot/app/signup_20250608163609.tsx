import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

const SignUp = () => {

    const navigation = useNavigation<NavigationProp>(); 

  return (
<SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="cover"
        source={require("../assets/showspotlogo.png")}
      />

      <Text style={styles.title}>Sign Up for ShowSpot</Text>

      <View style={styles.input}>
        <Text style={styles.inputText}>Enter Full Name</Text>
      </View>

      <View style={styles.input}>
        <Text style={styles.inputText}>Enter Email</Text>
      </View>

      <View style={styles.input}>
        <Text style={styles.inputText}>Enter Password</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Continue</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <LinearGradient
            colors={["#ff00ff", "#2a2882"]}
            style={styles.gradientButton}
          >
            <Text style={styles.gradientButtonText}>Log In</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logo: {
    marginTop: 60,
    width: 90,
    height: 100,
    borderRadius: 20,
  },
  title: {
    marginVertical: 30,
    fontSize: 24,
    fontFamily: "Amiko-Regular",
    color: "#000",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputText: {
    color: "#b4b3b3",
    fontFamily: "Amiko-Regular",
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: "auto",
    width: "100%",
    marginBottom: 40,
  },
  outlineButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff00ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  outlineButtonText: {
    fontFamily: "Amiko-Regular",
    fontSize: 16,
    color: "#222",
  },
  gradientButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientButtonText: {
    fontFamily: "Amiko-Regular",
    fontSize: 16,
    color: "#fff",
  },
});

export default SignUp;
