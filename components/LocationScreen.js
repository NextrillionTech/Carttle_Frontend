import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const mapBackground = require("../assets/map-background.jpg");
const locationIcon = require("../assets/location-icon-removebg-preview.png");

const LocationScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const handleLocationPress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    navigation.navigate("ChooseRole");
  };

  return (
    <ImageBackground source={mapBackground} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity onPress={handleLocationPress}>
            <Image source={locationIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.title1}>Enable your location</Text>
          <Text style={styles.subtitle}>
            Choose your location to find travelers around you
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleLocationPress}>
            <Text style={styles.buttonText}>Use my location</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1,
  },
  card: {
    width: "90%",
    height: "52%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#0000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title1: {
    fontSize: width * 0.06,
    textAlign: "center",
    color: "#414141",
    marginBottom: 11,
    fontFamily: "poppins",
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#a0a0a0",
    marginBottom: 8,
    fontFamily: "poppins",
  },
  button: {
    width: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
    fontFamily: "poppins",
  },
  skipText: {
    fontSize: width * 0.04,
    color: "#b8b8b8",
    fontFamily: "poppins",
  },
});

export default LocationScreen;
