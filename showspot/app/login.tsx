import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LogIn = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogIn = async () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error);
        Alert.alert("Login Failed", error.message);
        navigation.navigate("Failure");
        return;
      }

      navigation.navigate("Success", { name: email });
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "An unexpected error occurred");
      navigation.navigate("Failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="cover"
        source={require("../assets/showspotlogo.png")}
      />

      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#b4b3b3"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#b4b3b3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.outlineButton, { opacity: loading ? 0.5 : 1 }]}
          onPress={handleLogIn}
          disabled={loading}
        >
          <Text style={styles.outlineButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <LinearGradient
            colors={["#ff00ff", "#2a2882"]}
            style={styles.gradientButton}
          >
            <Text style={styles.gradientButtonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
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

export default LogIn;
