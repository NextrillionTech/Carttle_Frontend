import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const { width, height } = Dimensions.get("window");
const carImage = require("../assets/travel.jpg");

const DriverWelcome = () => {
  const navigation = useNavigation();
  const travelerOpacity = new Animated.Value(1);
  const driverOpacity = new Animated.Value(1);

  let [fontsLoaded] = useFonts({
    "poppins-medium": require("../assets/Poppins-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  useFocusEffect(
    useCallback(() => {
      travelerOpacity.setValue(1);
      driverOpacity.setValue(1);
    }, [])
  );

  const handleTravelerPress = () => {
    navigation.navigate("DriverSignup");
    Animated.timing(travelerOpacity, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const handleDriverPress = () => {
    navigation.navigate("DriverLogin");
    Animated.timing(driverOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  return (
    <View style={styles.container}>
      <Image source={carImage} style={styles.image} />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Have a great traveling experience,
        {"\n"} Bon Voyage!!
      </Text>
      <Animated.View
        style={{ ...styles.buttonContainer, opacity: travelerOpacity }}
      >
        <TouchableOpacity style={styles.button} onPress={handleTravelerPress}>
          <Text style={styles.buttonText}>Create an Account</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={{ ...styles.buttonContainer, opacity: driverOpacity }}
      >
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={handleDriverPress}
        >
          <Text style={styles.outlineButtonText}>Log In</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05,
    backgroundColor: "#ffff",
    fontFamily: "poppins-medium",
  },
  image: {
    width: width * 0.9,
    height: height * 0.35,
    resizeMode: "contain",
    marginBottom: height * 0.03,
    marginTop: height * 0.15,
  },
  title: {
    fontSize: width * 0.06,
    textAlign: "center",
    marginBottom: height * 0.02,
    fontFamily: "poppins-medium",
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#888",
    marginBottom: height * 0.1,
    fontFamily: "poppins-medium",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.02, // Reduced margin bottom
  },
  button: {
    width: width * 0.8,
    height: 54,
    backgroundColor: "black",
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01, // Reduced space between buttons
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
    fontFamily: "poppins-medium",
  },
  outlineButton: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: width * 0.02,
    width: width * 0.8,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineButtonText: {
    color: "black",
    fontSize: width * 0.04,
    fontFamily: "poppins-medium",
  },
});

export default DriverWelcome;
