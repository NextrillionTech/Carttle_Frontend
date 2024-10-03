import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useFonts } from "expo-font";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DriverLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    "poppins-medium": require("../assets/Poppins-Medium.ttf"),
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignUp = () => {
    navigation.navigate("DriverSignUp");
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      alert("Please enter both phone number and password.");
      return;
    }

    try {
      const response = await fetch("http://10.11.52.77:3000/auth/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phonenumber: phoneNumber,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // Store user ID in AsyncStorage
        await AsyncStorage.setItem("userId", data._id); // Assuming data._id is the user ID

        // Retrieve and log the user ID to check if it's stored
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("Stored User ID:", storedUserId);

        navigation.navigate("HomeScreen"); // Navigate to home screen after login
      } else {
        alert(data.msg || "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  const handleSignupPress = () => {
    navigation.navigate("DriverSignup");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={require("../assets/back.png")} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Log in with your phone number</Text>
      <TextInput
        style={[styles.input, { marginBottom: SCREEN_HEIGHT * 0.01 }]}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        selectionColor="black"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        selectionColor="black"
      />
      <TouchableOpacity style={styles.commonButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require("../assets/gmail.png")}
          style={styles.socialIcon1}
        />
        <Text style={styles.socialButtonText}>Log in with Gmail</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require("../assets/apple.png")}
          style={styles.socialIcon2}
        />
        <Text style={styles.socialButtonText}>Log in with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <Text style={styles.signUpLink}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.05,
    backgroundColor: "WHITE",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: SCREEN_HEIGHT * 0.08,
    left: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  backIcon: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  backText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: "#414141",
    fontFamily: "poppins-medium",
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.07,
    color: "#414141",
    textAlign: "left",
    marginTop: SCREEN_HEIGHT * 0.15,
    marginLeft: SCREEN_WIDTH * 0.03,
    alignSelf: "flex-start",
    fontFamily: "poppins-medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    width: "100%",
    height: SCREEN_HEIGHT * 0.07,
    padding: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_HEIGHT * 0.03,
    borderRadius: 7,
    marginBottom: SCREEN_HEIGHT * 0.02,
    fontFamily: "poppins-medium",
  },
  commonButton: {
    backgroundColor: "#000",
    padding: SCREEN_HEIGHT * 0.02,
    width: "100%",
    borderRadius: 7,
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  buttonText: {
    color: "#fff",
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: "poppins-medium",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SCREEN_HEIGHT * 0.03,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: SCREEN_WIDTH * 0.03,
    color: "#d0d0d0",
    fontFamily: "poppins-medium",
  },
  socialButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: SCREEN_WIDTH * 0.03,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 7,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  socialIcon1: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_WIDTH * 0.09,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  socialIcon2: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_WIDTH * 0.085,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  socialButtonText: {
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: "center",
    color: "#5a5a5a",
    fontFamily: "poppins-medium",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    justifyContent: "center",
  },
  signUpText: {
    color: "#5a5a5a",
    fontFamily: "poppins-medium",
  },
  signUpLink: {
    color: "#4a73da",
    fontWeight: "bold",
    fontFamily: "poppins-medium",
  },
});

export default DriverLogin;
