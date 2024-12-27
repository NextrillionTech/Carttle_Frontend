import React, { useEffect, useState, useRef } from "react";
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
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const { width, height } = Dimensions.get("window");

const carImage = require("../assets/travel.png");

const TravellerWelcome = () => {
  const navigation = useNavigation();
  const travelerOpacity = useRef(new Animated.Value(1)).current; // Use useRef
  const driverOpacity = useRef(new Animated.Value(1)).current; // Use useRef
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset opacity values when screen is focused
      travelerOpacity.setValue(1);
      driverOpacity.setValue(1);
    }, [travelerOpacity, driverOpacity])
  );

  const handleTravelerPress = () => {
    Animated.timing(travelerOpacity, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      navigation.navigate("TravellerSignup");
    });
  };

  const handleDriverPress = () => {
    Animated.timing(driverOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      navigation.navigate("TravellerLogin");
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={carImage} style={styles.image} />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Have a great traveling experience,{"\n"} Bon Voyage!!
      </Text>
      <View style={styles.buttonContainer}>
        <Animated.View
          style={{ ...styles.buttonWrapper, opacity: travelerOpacity }}
        >
          <TouchableOpacity style={styles.button} onPress={handleTravelerPress}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{ ...styles.buttonWrapper, opacity: driverOpacity }}
        >
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleDriverPress}
          >
            <Text style={styles.outlineButtonText}>Log In</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: width * 0.9,
    height: height * 0.4,
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
    fontFamily: "poppins",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginBottom: 30,
    fontFamily: "poppins",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.1,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  button: {
    width: width * 0.8,
    height: 54,
    backgroundColor: "black",
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
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

export default TravellerWelcome;
