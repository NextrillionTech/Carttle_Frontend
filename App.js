import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import OpeningScreen from "./components/OpeningScreen";
import InitialScreens from "./components/InitialScreens";
import LocationScreen from "./components/LocationScreen";
import ChooseRoleScreen from "./components/ChooseRoleScreen";
import TravellerWelcome from "./components/TravellerWelcome";
import DriverWelcome from "./components/DriverWelcome";
import DriverLogin from "./components/DriverLogin";
import DriverSignup from "./components/DriverSignup";
import HomeScreen from "./components/HomeScreen";
import MessageScreen from "./components/MessageScreen";
import MapScreen from "./components/MapScreen";
import NotificationScreen from "./components/NotificationScreen";
import RidesScreen from "./components/NotificationScreen";
import DriverVerification from "./components/DriverVerification";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OpeningScreen">
        <Stack.Screen
          name="OpeningScreen"
          component={OpeningScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InitialScreens"
          component={InitialScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationScreen"
          component={LocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseRole"
          component={ChooseRoleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravellerWelcome"
          component={TravellerWelcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverWelcome"
          component={DriverWelcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverLogin"
          component={DriverLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverSignup"
          component={DriverSignup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverVerification"
          component={DriverVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RidesScreen"
          component={RidesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
