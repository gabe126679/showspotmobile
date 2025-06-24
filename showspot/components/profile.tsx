import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
  Platform,
  Vibration,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 85;
const FOOTER_HEIGHT = 100;
const HANDLE_HEIGHT = 30;
const TAB_HEIGHT = 80;
const COLLAPSED_HEIGHT = 200;
const COLLAPSED_TRANSLATE_Y = SCREEN_HEIGHT - COLLAPSED_HEIGHT - FOOTER_HEIGHT;
const IMAGE_SECTION_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

interface TabData {
  id: string;
  title: string;
  expanded: boolean;
  data?: any[];
}

const INITIAL_TABS: TabData[] = [
  { id: "upcoming", title: "upcoming shows", expanded: false },
  { id: "promoted", title: "promoted shows", expanded: false },
  { id: "attended", title: "attended shows", expanded: false },
  { id: "purchased", title: "purchased songs", expanded: false },
  { id: "playlists", title: "playlists", expanded: false },
  { id: "artists", title: "favorite artists", expanded: false },
  { id: "bands", title: "favorite bands", expanded: false },
  { id: "venues", title: "favorite venues", expanded: false },
  { id: "info", title: "spotter info", expanded: false },
];

const Profile = () => {
  const navigation = useNavigation();
  
  // State management
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [tabs, setTabs] = useState<TabData[]>(INITIAL_TABS);
  
  // Animation refs
  const panelTranslateY = useRef(new Animated.Value(COLLAPSED_TRANSLATE_Y)).current;
  const handleOpacity = useRef(new Animated.Value(1)).current;
  const nameOpacity = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pan responder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        // Haptic feedback on touch start
        if (Platform.OS === 'ios') {
          Vibration.vibrate(10);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const currentValue = expanded ? 0 : COLLAPSED_TRANSLATE_Y;
        const newValue = currentValue + gestureState.dy;
        
        // Constrain the movement
        const constrainedValue = Math.max(0, Math.min(COLLAPSED_TRANSLATE_Y, newValue));
        panelTranslateY.setValue(constrainedValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const SWIPE_THRESHOLD = 100;
        const velocity = gestureState.vy;
        
        // Determine direction based on velocity and distance
        const shouldExpand = !expanded && (
          gestureState.dy < -SWIPE_THRESHOLD || velocity < -0.5
        );
        const shouldCollapse = expanded && (
          gestureState.dy > SWIPE_THRESHOLD || velocity > 0.5
        );

        if (shouldExpand) {
          expandPanel();
        } else if (shouldCollapse) {
          collapsePanel();
        } else {
          // Snap back to current state
          const targetValue = expanded ? 0 : COLLAPSED_TRANSLATE_Y;
          Animated.spring(panelTranslateY, {
            toValue: targetValue,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const expandPanel = useCallback(() => {
    setExpanded(true);
    
    Animated.parallel([
      Animated.spring(panelTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(handleOpacity, {
        toValue: 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nameOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [panelTranslateY, handleOpacity, nameOpacity]);

  const collapsePanel = useCallback(() => {
    setExpanded(false);
    
    // Collapse all tabs when panel closes
    setTabs(prevTabs => 
      prevTabs.map(tab => ({ ...tab, expanded: false }))
    );
    
    Animated.parallel([
      Animated.spring(panelTranslateY, {
        toValue: COLLAPSED_TRANSLATE_Y,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(handleOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [panelTranslateY, handleOpacity, nameOpacity]);

  const toggleTab = useCallback((tabId: string) => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId
          ? { ...tab, expanded: !tab.expanded }
          : { ...tab, expanded: false } // Close other tabs
      )
    );
  }, []);

  // Load spotter data
  useEffect(() => {
    const loadSpotterData = async () => {
      try {
        setError(null);
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        const userId = sessionData.session?.user?.id;
        if (!userId) throw new Error("No authenticated user found");

        const { data, error: profileError } = await supabase
          .from("spotters")
          .select("full_name, spotter_profile_picture")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;
        if (!data) throw new Error("Profile data not found");

        setName(data.full_name || "Unnamed Spotter");
        setProfileImage(data.spotter_profile_picture || null);
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        
      } catch (err) {
        console.error("Error fetching spotter profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
        setName("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    loadSpotterData();
  }, [fadeAnim]);

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2a2882" />
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={["#ff00ff", "#2a2882"]}
            style={styles.loadingGradient}
          >
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading your profile...</Text>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2a2882" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a2882" />
      <Text>ArtistSignup</Text>
      {/* Header with user types */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.statusContainer} onPress={() => navigation.navigate("ArtistSignup" as never)}>
          <Text style={styles.statusTextGray}>Artist</Text>
        </TouchableOpacity>
        <LinearGradient 
          style={styles.statusContainer} 
          colors={["#ff00ff", "#2a2882"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statusText}>Spotter</Text>
        </LinearGradient>
        <TouchableOpacity style={styles.statusContainer} onPress={() => navigation.navigate("VenueSignup" as never)}>
          <Text style={styles.statusTextGray}>Venue</Text>
        </TouchableOpacity>
      </View>

      {/* Profile image section */}
      <Animated.View 
        style={[styles.imageSection, { opacity: fadeAnim }]} 
        {...panResponder.panHandlers}
      >
        {profileImage ? (
          <Image 
            source={{ uri: profileImage }} 
            style={styles.profileImage}
            resizeMode="cover"
          />
          
        ) : (
          <LinearGradient
            colors={["#ff00ff20", "#2a288220"]}
            style={styles.imagePlaceholder}
          >
            <Text style={styles.placeholderText}>No Image</Text>
          </LinearGradient>
        )}
        
        {/* Name overlay positioned at bottom right */}
        <Animated.View 
          style={[styles.nameOverlay, { opacity: nameOpacity }]} 
          pointerEvents="none"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.nameGradient}
          >
            <Text style={styles.nameText}>{name}</Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>

      {/* Sliding panel */}
      <Animated.View
        style={[
          styles.scrollablePanel,
          {
            transform: [{ translateY: panelTranslateY }],
          },
        ]}
      >
        {/* Drag handle */}
        <Animated.View 
          style={[styles.gestureHandle, { opacity: handleOpacity }]} 
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBar} />
        </Animated.View>

        {/* Name header inside panel */}
        <LinearGradient
          colors={["#2a2882", "#ff00ff"]}
          style={styles.panelHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.nameTextInside} numberOfLines={1}>
            {name}
          </Text>
        </LinearGradient>

        {/* Scrollable tabs */}
        <ScrollView
          style={styles.tabsContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab, index) => (
            <View key={tab.id} style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.dropdownTab,
                  tab.expanded && styles.dropdownTabExpanded,
                  index === tabs.length - 1 && styles.lastTab,
                ]}
                onPress={() => toggleTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{tab.title}</Text>
                <Animated.Text
                  style={[
                    styles.arrow,
                    {
                      transform: [
                        {
                          rotate: tab.expanded ? "180deg" : "0deg",
                        },
                      ],
                    },
                  ]}
                >
                
                </Animated.Text>
              </TouchableOpacity>
              
              {/* Tab content */}
              {tab.expanded && (
                <View style={styles.tabContent}>
                  <Text style={styles.tabContentText}>
                    No {tab.title} yet
                  </Text>
                  {tab.id === "playlists" && (
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>+ Add Playlist</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["#ff00ff", "#2a2882"]}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>Become an Artist</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={["#2a2882", "#ff00ff"]}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>Become a Venue</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.signOutButton}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Brand colored bar with up arrow indicator */}
      <View style={styles.brandBar}>
        <Text style={styles.upArrow}>▲</Text>
      </View>

      {/* Footer navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("MapHome" as never)}
          style={styles.footerButton}
          activeOpacity={0.7}
        >
          <HomeIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Search" as never)}
          style={styles.footerButton}
          activeOpacity={0.7}
        >
          <SearchIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Create" as never)}
          style={styles.footerButton}
          activeOpacity={0.7}
        >
          <CreateIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Player" as never)}
          style={styles.footerButton}
          activeOpacity={0.7}
        >
          <PlayerIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton, styles.activeFooterButton]}>
          <ProfileIcon width={50} height={50} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingGradient: {
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Amiko-Regular",
    color: "#fff",
    marginTop: 15,
  },
  
  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 50,
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: "Amiko-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#ff00ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontFamily: "Amiko-Regular",
    color: "#fff",
  },
  
  // Header
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#ff00ff",
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statusText: {
    fontSize: 22,
    fontFamily: "Amiko-Regular",
    color: "#fff",
    fontWeight: "600",
  },
  statusTextGray: {
    fontSize: 22,
    fontFamily: "Amiko-Regular",
    color: "#b4b3b3",
  },
  
  // Image section
  imageSection: {
    height: IMAGE_SECTION_HEIGHT,
    position: "relative",
    backgroundColor: "#f8f8f8",
    width: "100%",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // ensures the image scales to fill
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontFamily: "Amiko-Regular",
    color: "#999",
  },
  nameOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 5,
  },

  nameGradient: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 20,
    paddingBottom: 20,
  },

  nameText: {
    fontSize: 20,
    fontFamily: "Audiowide-Regular",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  
  // Sliding panel
  scrollablePanel: {
    position: "absolute",
    top: COLLAPSED_HEIGHT,
    left: 0,
    right: 0,
    bottom: FOOTER_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  gestureHandle: {
    height: HANDLE_HEIGHT,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
  panelHeader: {
    paddingVertical: 15,
    alignItems: "center",
  },
  nameTextInside: {
    fontSize: 24,
    fontFamily: "Audiowide-Regular",
    color: "#fff",
    textAlign: "center",
  },
  
  // Tabs
  tabsContainer: {
    flex: 1,
  },
  tabsContent: {
    paddingBottom: 20,
  },
  tabContainer: {
    backgroundColor: "#fff",
  },
  dropdownTab: {
    height: TAB_HEIGHT,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  dropdownTabExpanded: {
    backgroundColor: "#f8f8f8",
    borderBottomColor: "#ff00ff",
  },
  lastTab: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 18,
    fontFamily: "Amiko-Regular",
    color: "#333",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  arrow: {
    fontSize: 16,
    color: "#ff00ff",
    fontWeight: "bold",
  },
  tabContent: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabContentText: {
    fontSize: 16,
    fontFamily: "Amiko-Regular",
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  addButton: {
    backgroundColor: "#ff00ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: "Amiko-Regular",
    color: "#fff",
    fontWeight: "600",
  },
  
  // Action buttons
  actionButtons: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    marginBottom: 10,
  },
  actionButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 18,
    fontFamily: "Amiko-Regular",
    color: "#fff",
    fontWeight: "600",
  },
  signOutButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff00ff",
    alignItems: "center",
    marginTop: 10,
  },
  signOutText: {
    fontSize: 18,
    fontFamily: "Amiko-Regular",
    color: "#ff00ff",
    fontWeight: "600",
  },
  
  // Brand bar with up arrow
  brandBar: {
    position: 'absolute',
    bottom: FOOTER_HEIGHT,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#ff00ff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  upArrow: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: -2,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    zIndex: 998,
  },
  footerButton: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFooterButton: {
    backgroundColor: "#ff00ff",
  },
});

export default Profile;