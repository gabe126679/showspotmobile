import * as React from "react";
import {StyleSheet, View, Image, Text} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeIcon from "../assets/home-icon.svg"
import SearchIcon from "../assets/search-icon.svg"
import PlayerIcon from "../assets/player-icon.svg"
import CreateIcon from "../assets/create-icon.svg"
import ProfileIcon from "../assets/profile-icon.svg"


const Player = () => {
  return (
    <SafeAreaView style={styles.spotterProfile}>
        <View style={styles.view}>
            <View style={[styles.footerProfile, styles.profileLayout]}>
                <View style={[styles.homeIcon, styles.iconLayout]}>
                <HomeIcon width={60} height={60} />
                </View>
                <View style={[styles.searchIcon, styles.iconLayout]}>
                    <SearchIcon width={60} height={60} />
                </View>
                <View style={[styles.playerIcon, styles.iconLayout]}>
                    <PlayerIcon width={60} height={60} />
                </View>
                <View style={[styles.createIcon, styles.iconLayout]}>
                    <CreateIcon width={60} height={60} />
                </View>
                <View style={[styles.profileIcon, styles.iconLayout]}>
                    <ProfileIcon width={60} height={60} />
                </View>
            </View>
        </View>
        <Text style={styles.joshHanley}>Create</Text>
    </SafeAreaView>
  )
} 

const styles = StyleSheet.create({
    spotterProfile: {
        backgroundColor: "#fff",
        flex: 1
    },
    profileLayout: {
        height: 85,
        borderWidth: 1.5,
        borderColor: "#ff00ff",
        borderStyle: "solid",
        width: 393,
        left: 0,
        position: "absolute",
        overflow: "hidden",
        backgroundColor: "#fff"
    },
    iconLayout: {
        height: 60,
        position: "absolute",
        overflow: "hidden"
    },
    swipeUpIconPosition: {
        width: 393,
        position: "absolute",
        left: 0,
        overflow: "hidden"
    },
    userPosition: {
        width: 131,
        borderColor: "#fafafa",
        marginTop: -42.5,
        left: "50%",
        top: "50%",
        height: 85,
        borderWidth: 1.5,
        borderStyle: "solid",
        position: "absolute",
        overflow: "hidden"
    },
    venuePosition: {
        color: "#b4b3b3",
        fontFamily: "Amiko-Regular",
        fontSize: 24,
        marginTop: -15.5,
        textAlign: "center",
        left: "50%",
        top: "50%",
        position: "absolute"
    },
    homeIcon: {
        marginLeft: -176.5,
        marginTop: -29.5,
        top: "50%",
        left: "50%"
    },
    searchIcon: {
        marginLeft: -103.5,
        marginTop: -29.5,
        top: "50%",
        left: "50%"
    },
    playerIcon: {
        marginLeft: 42.5,
        marginTop: -29.5,
        top: "50%",
        left: "50%"
    },
    createIcon: {
        marginLeft: -30.5,
        marginTop: -29.5,
        top: "50%",
        left: "50%"
    },
    profileIcon: {
        right: 20,
        marginTop: -29.5,
        top: "50%"
    },
    footerProfile: {
        top: 768
    },
    fa6deaa7b10361d6d6c42a4db9368Icon: {
        marginTop: -343.5,
        marginLeft: -196.57,
        height: 688,
        left: "50%",
        top: "50%",
        width: 393,
        position: "absolute"
    },
    joshHanley: {
        marginTop: -20,
        marginLeft: -120,
        fontSize: 32,
        fontFamily: "Audiowide-Regular",
        textAlign: "center",
        color: "#fff",
        left: "50%",
        top: "50%",
        position: "absolute"
    },
    name: {
        bottom: 56,
        width: 250,
        height: 60,
        left: 0
    },
    swipeUpIcon: {
        bottom: 0
    },
    spotterProfilePicture: {
        top: 83,
        height: 685,
        backgroundColor: "#fff"
    },
    artist: {
        marginLeft: -33.5
    },
    userStatus: {
        marginLeft: -65.5,
        backgroundColor: "#f4f4f4",
        width: 131,
        borderColor: "#fafafa",
        marginTop: -42.5
    },
    spotter: {
        marginLeft: -45.5,
        fontFamily: "Amiko-Regular",
        fontSize: 24,
        marginTop: -15.5,
        textAlign: "center",
        color: "#fff",
        left: "50%",
        top: "50%",
        position: "absolute"
    },
    userStatus1: {
        marginLeft: -196.5,
        backgroundColor: "transparent",
        width: 131,
        borderColor: "#fafafa",
        marginTop: -42.5
    },
    venue: {
        marginLeft: -38.5
    },
    userStatus2: {
        marginLeft: 65.5,
        backgroundColor: "#f4f4f4",
        width: 131,
        borderColor: "#fafafa",
        marginTop: -42.5
    },
    profileHeader: {
        top: 0
    },
    view: {
        width: "100%",
        height: 852,
        overflow: "hidden",
        backgroundColor: "#fff",
        flex: 1
    }
});
export default Player;