import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import SearchIcon from "../assets/search-icon.svg";
import PlayerIcon from "../assets/player-icon.svg";
import CreateIcon from "../assets/create-icon.svg";
import ProfileIcon from "../assets/profile-icon.svg";

const MapHome = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign out failed", error.message);
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Welcome" as never }] });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Search" as never)}>
          <SearchIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Create" as never)}>
          <CreateIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Player" as never)}>
          <PlayerIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile" as never)}>
          <ProfileIcon width={60} height={60} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", backgroundColor: "#fff" },
  content: { alignItems: "center", marginTop: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: "#2a2882" },
  signOutButton: {
    marginTop: 30,
    backgroundColor: "#ff00ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
});

export default MapHome;
