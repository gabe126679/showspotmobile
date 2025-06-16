// Profile.tsx
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";

import HomeIcon from "../assets/home-icon.svg";
import SearchIcon from "../assets/search-icon.svg";
import PlayerIcon from "../assets/player-icon.svg";
import CreateIcon from "../assets/create-icon.svg";
import ProfileIcon from "../assets/profile-icon.svg";
import SwipeupIcon from "../assets/swipe-up-icon.svg";

const HEADER_HEIGHT = 85;
const FOOTER_HEIGHT = 85;
const SWIPE_BAR_HEIGHT = 18;

const Profile = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("Loading...");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpotterData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) throw new Error("User not found");

        const { data, error } = await supabase
          .from("spotters")
          .select("full_name, spotter_profile_picture")
          .eq("id", userId)
          .single();

        if (error || !data) throw error;

        setName(data.full_name || "Unnamed");
        setProfileImage(data.spotter_profile_picture || null);
      } catch (err) {
        console.error("Error fetching spotter profile:", err);
        setName("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    loadSpotterData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2a2882" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.status}>
          <Text style={styles.statusTextGray}>Artist</Text>
        </View>
        <LinearGradient
          style={styles.status}
          colors={["#ff00ff", "#2a2882"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text style={styles.statusText}>Spotter</Text>
        </LinearGradient>
        <View style={styles.status}>
          <Text style={styles.statusTextGray}>Venue</Text>
        </View>
      </View>

      {/* Profile Image */}
      <View style={styles.imageSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <View style={styles.nameOverlay}>
          <Text style={styles.nameText}>{name}</Text>
        </View>

        <LinearGradient
          colors={["#ff00ff", "#2a2882"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.swipeBar}
        >
          <SwipeupIcon width={393} height={18} />
        </LinearGradient>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("MapHome" as never)}>
          <HomeIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search" as never)}>
          <SearchIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Create" as never)}>
          <CreateIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Player" as never)}>
          <PlayerIcon width={60} height={60} />
        </TouchableOpacity>
        <TouchableOpacity>
          <ProfileIcon width={60} height={60} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: "#ff00ff",
  },
  status: {
    width: 131,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fafafa",
  },
  statusText: {
    fontSize: 24,
    fontFamily: "Amiko-Regular",
    color: "#fff",
  },
  statusTextGray: {
    fontSize: 24,
    fontFamily: "Amiko-Regular",
    color: "#b4b3b3",
  },
  imageSection: {
    flex: 1,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
  },
  nameOverlay: {
    position: "absolute",
    bottom: SWIPE_BAR_HEIGHT + 10,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  nameText: {
    width: 222,
    fontSize: 32,
    fontFamily: "Audiowide-Regular",
    color: "#fff",
    textAlign: "center",
  },
  swipeBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SWIPE_BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: FOOTER_HEIGHT,
    borderTopWidth: 1.5,
    borderColor: "#ff00ff",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default Profile;
