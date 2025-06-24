// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import LogIn from "./app/login";
import Signup from "./app/signup";
import Success from "./app/success";
import Failure from "./app/failure";
import Picture from "./app/picture";
import Profile from "./components/profile";
import Search from "./components/search";
import Create from "./components/create";
import Player from "./components/player";
import MapHome from "./components/mapHome";
import ArtistSignup from './app/artistSignup';
import ArtistPicture from './app/artistPicture';
import VenueSignup from './app/venueSignup';
import VenuePicture from './app/venuePicture';
import { UserProvider } from "./context/userContext"; 
// 👈 import context

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Success: undefined;
  Failure: undefined;
  Picture: undefined;
  MapHome: undefined;
  ArtistSignup: undefined;
  ArtistPicture: undefined;
  VenueSignup: undefined;
  VenuePicture: undefined;
  Search: undefined;
  Create: undefined;
  Player: undefined;
  Profile: { name: string };
};

console.log("Home Component:", Map);

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  console.log("Home Component:", Map);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          id={undefined}
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LogIn} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Success" component={Success} />
          <Stack.Screen name="Failure" component={Failure} />
          <Stack.Screen name="Picture" component={Picture} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="MapHome" component={MapHome} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Create" component={Create} />
          <Stack.Screen name="Player" component={Player} />
          <Stack.Screen name="ArtistSignup" component={ArtistSignup} />
          <Stack.Screen name="ArtistPicture" component={ArtistPicture} />
          <Stack.Screen name="VenueSignup" component={VenueSignup} />
          <Stack.Screen name="VenuePicture" component={VenuePicture} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
