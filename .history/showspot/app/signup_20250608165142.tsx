import { useState } from "react";
import { Image, StyleSheet, Text, View, TextInput, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

const SignUp = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.error("Sign-up error:", error);
      router.push("/failure");
      return;
    }

    const { error: insertError } = await supabase.from("spotters").insert([
      {
        id: data.user.id,
        full_name: fullName,
        email,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      router.push("/failure");
      return;
    }

    router.push({ pathname: "/success", params: { name: fullName } });
  };

  return (
    <SafeAreaView style={styles.signUp}>
      <Image style={styles.logo} resizeMode="cover" source={require("../assets/showspotlogo.png")} />
      <Text style={styles.title}>sign up for showspot</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        placeholderTextColor="#b4b3b3"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#b4b3b3"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#b4b3b3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.buttonOutline} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

      <LinearGradient style={styles.button} colors={["#ff00ff", "#2a2882"]}>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>Log In</Text>
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signUp: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 90,
    height: 100,
    borderRadius: 30,
    marginTop: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Amiko-Regular",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#f4f4f4",
    borderColor: "#fafafa",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontFamily: "Amiko-Regular",
    fontSize: 16,
    marginBottom: 15,
  },
  buttonOutline: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderColor: "#ff00ff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontFamily: "Amiko-Regular",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SignUp;
