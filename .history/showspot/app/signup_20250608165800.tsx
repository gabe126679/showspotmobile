import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error || !data.user) {
      router.push("/failure");
    } else {
      await supabase.from("spotters").insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
      });
      router.push({ pathname: "/success", params: { fullName } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/showspotlogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up for ShowSpot</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable onPress={handleSignUp}>
        <LinearGradient
          style={styles.button}
          colors={["#ff00ff", "#2a2882"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Amiko-Regular",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    fontFamily: "Amiko-Regular",
  },
  button: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Amiko-Regular",
  },
});

export default SignUp;
