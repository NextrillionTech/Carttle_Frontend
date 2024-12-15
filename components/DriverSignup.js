import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const { width, height } = Dimensions.get("window");

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const countryData = [
  { label: "🇺🇸 USA", value: "+1" },
  { label: "🇮🇳 IND", value: "+91" },
  { label: "🇬🇧 UK", value: "+44" },
  // Add more countries as needed
];

const DriverSignup = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("+91");
  const [items, setItems] = useState(countryData);

  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateAccount = async () => {
    if (!name || !phone || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.43.235:3000/auth/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            phonenumber: phone,
            password: password,
            type: "driver",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store the name in AsyncStorage
        await AsyncStorage.setItem("userName", name);

        // Account created successfully
        alert("Account created successfully!");
        navigation.navigate("DriverVerification");
      } else {
        // Handle errors returned from the backend
        alert(data.msg || "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  const handlePhoneChange = (text) => {
    const phoneNumber = text.replace(/^\+\d+\s*/, "");
    setPhone(phoneNumber);
    setIsPhoneValid(phoneNumber.length === 10);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const phoneNumberWithCode = `${value} ${phone}`;

  const handleDriverPress = () => {
    navigation.navigate("DriverLogin", { name });
  };

  return (
    <FlatList
      contentContainerStyle={styles.scrollContainer}
      data={[{}]} // Dummy data to render the FlatList
      renderItem={() => (
        <View style={styles.container}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image
              source={require("../assets/back.png")}
              style={styles.backIcon}
            />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            Create an account with your phone number.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name*"
            value={name}
            onChangeText={setName}
            selectionColor="black"
          />
          <View style={styles.phoneContainer}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
            />
            <TextInput
              style={styles.phoneInput}
              placeholder="Your mobile number*"
              keyboardType="phone-pad"
              value={phoneNumberWithCode}
              onChangeText={handlePhoneChange}
              selectionColor="black"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password*"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry // This makes the password input secure
            selectionColor="black"
          />
          <TouchableOpacity
            style={[styles.button, !isPhoneValid && styles.disabledButton]}
            onPress={handleCreateAccount}
            disabled={!isPhoneValid}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.termsContainer}>
            <Image
              source={require("../assets/check-icon.png")}
              style={styles.checkIcon}
            />
            <Text style={styles.termsText}>
              By signing up, you agree to the{" "}
              <Text style={styles.link}>Terms of service</Text> and{" "}
              <Text style={styles.link}>Privacy policy</Text>.
            </Text>
          </View>
          <Text style={styles.softcopyText}>
            Please keep your driving license & RC soft-copy handy...
          </Text>
          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.separator} />
          </View>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../assets/gmail.png")}
                style={styles.socialIcon1}
              />
              <Text style={styles.socialButtonText}>Gmail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../assets/apple.png")}
                style={styles.socialIcon2}
              />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleDriverPress}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.signInLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.04,
  },
  backIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
  backText: {
    fontSize: width * 0.04,
    color: "#414141",
    fontFamily: "poppins",
  },
  title: {
    fontSize: width * 0.06,
    color: "#414141",
    marginBottom: height * 0.02,
    fontFamily: "poppins",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.02,
    fontFamily: "poppins",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  dropdownContainer: {
    width: width * 0.3,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: height * 0.07,
    borderRadius: width * 0.02,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    marginLeft: width * 0.02,
    fontFamily: "poppins",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontFamily: "poppins",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  checkIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  termsText: {
    fontSize: width * 0.03,
    color: "#b8b8b8",
    fontFamily: "poppins",
  },
  link: {
    color: "#0163e0",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: width * 0.02,
    fontSize: width * 0.035,
    color: "#888",
    fontFamily: "poppins",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    height: height * 0.07,
    borderColor: "#ccc",
    justifyContent: "center",
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.02,
  },
  socialIcon1: {
    width: width * 0.08,
    height: width * 0.1,
    marginRight: width * 0.02,
  },
  socialIcon2: {
    width: width * 0.08,
    height: width * 0.08,
    marginRight: width * 0.02,
  },
  socialButtonText: {
    fontSize: width * 0.04,
    color: "#5a5a5a",
    fontFamily: "poppins",
  },
  softcopyText: {
    fontSize: width * 0.03,
    color: "#5a5a5a",
    textAlign: "center",
    fontFamily: "poppins",
    marginBottom: height * 0.01,
  },
  footerText: {
    fontSize: width * 0.035,
    color: "#5a5a5a",
    textAlign: "center",
    fontFamily: "poppins",
  },
  signInLink: {
    color: "#0163e0",
    textDecorationLine: "underline",
  },
});

export default DriverSignup;
