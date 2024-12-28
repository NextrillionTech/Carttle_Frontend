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
import SelectTimeScreen from "./components/SelectTimeScreen";

import DriverSignup from "./components/DriverSignup";
import DriverVerification from "./components/DriverVerification";
import HomeScreen from "./components/HomeScreen";
import MessageScreen from "./components/MessageScreen";
import MapScreen from "./components/MapScreen";
import NotificationScreen from "./components/NotificationScreen";
import RidesScreen from "./components/RidesScreen";
import RideSuccessful from "./components/RideSuccessful";
import Profile from "./components/Profile";
import HelpScreen from "./components/HelpScreen";
import ChangePasswordScreen from "./components/ChangePasswordScreen";
import ContactUsScreen from "./components/ContactUsScreen";
import TravellerSignup from "./components/TravellerSignup";
import TravellerLogin from "./components/TravellerLogin";
import TravellerHomeScreen from "./components/TravellerHomeScreen";
import RideList from "./components/RideList";
import TravelerSelectTime from "./components/TravelerSelectTime";
import TripHistory from "./components/TripHistory";
import TravelerBottomNav from "./components/TravelerBottomNav";
import TravellerBooking from "./components/TravellerBooking";
import PaymentScreen from "./components/PaymentSuccess";
import TravellerRideDetails from "./components/TravellerRideDetails";
import DeleteAccountScreen from "./components/DeleteAcc";
import TravelerProfile from "./components/TravelerProfile";

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
          name="SelectTimeScreen"
          component={SelectTimeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelpScreen"
          component={HelpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContactUsScreen"
          component={ContactUsScreen}
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
        <Stack.Screen
          name="RideSuccessful"
          component={RideSuccessful}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TravellerLogin"
          component={TravellerLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravellerSignup"
          component={TravellerSignup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravellerHomeScreen"
          component={TravellerHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelerSelectTime"
          component={TravelerSelectTime}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelerBottomNav"
          component={TravelerBottomNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TripHistory"
          component={TripHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RideList"
          component={RideList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeleteAccountScreen"
          component={DeleteAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravellerBooking"
          component={TravellerBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravellerRideDetails"
          component={TravellerRideDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelerProfile"
          component={TravelerProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
