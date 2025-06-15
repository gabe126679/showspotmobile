// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import LogIn from "./app/login";
import Signup from "./app/signup";
import Success from "./app/success";
import Failure from "./app/failure";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Success: { name: string };
  Failure: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="Failure" component={Failure} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

