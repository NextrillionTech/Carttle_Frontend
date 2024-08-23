import React from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");
const carImage = require("../assets/car-image.png");

const ChooseRoleScreen = () => {
  const navigation = useNavigation();

  // Animation values
  const buttonsPosition = new Animated.Value(-200); // Start off-screen at the top
  const imageOpacity = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "poppins-medium": require("../assets/Poppins-Medium.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        // Display the image
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        // Display the text
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        // Animate buttons to slide down
        Animated.timing(buttonsPosition, {
          toValue: 0, // Move buttons to the bottom
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    }
  }, [fontsLoaded]); // Run animation only after fonts are loaded

  const handleTravelerPress = () => {
    navigation.navigate("TravellerWelcome");
  };

  const handleDriverPress = () => {
    navigation.navigate("DriverWelcome");
  };

  if (!fontsLoaded) {
    return null; // Optionally, return a loading indicator here
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity: imageOpacity }]}>
        <Image source={carImage} style={styles.image} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: titleOpacity }]}>
        <Text style={styles.title}>How do you want to continue as?</Text>
        <Text style={styles.subtitle}>
          You can login as a driver or a traveler, select any one to continue
        </Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [
              {
                translateY: buttonsPosition,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleTravelerPress}>
          <Text style={styles.buttonText}>Traveler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={handleDriverPress}
        >
          <Text style={styles.outlineButtonText}>Driver</Text>
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
    paddingVertical: 40, // Reduced padding to move content up
    backgroundColor: "#ffff",
  },
  imageContainer: {
    width: "100%",
    height: height * 0.3, // Adjusted height to move content up
    overflow: "hidden",
    marginBottom: 15, // Reduced margin to move content up
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15, // Reduced margin to move content up
  },
  title: {
    fontSize: width * 0.06,
    color: "#292929",
    textAlign: "center",
    marginBottom: 10, // Reduced margin to move content up
    fontFamily: "poppins-medium",
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#888",
    fontFamily: "poppins-medium",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30, // Adjusted position to move content up
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: width * 0.8,
    height: 54,
    backgroundColor: "black",
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "poppins-medium",
  },
  outlineButton: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    width: width * 0.8,
    height: 54,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  outlineButtonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "poppins-medium",
  },
});

export default ChooseRoleScreen;
