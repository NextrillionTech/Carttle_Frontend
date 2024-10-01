import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const { width, height } = Dimensions.get("window");

// Load fonts
const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const DriverVerification = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [carRegNumber, setCarRegNumber] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(""); // State for user ID

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await fetchFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();

    // Retrieve user ID from AsyncStorage
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId"); // Use the key you stored it under
        if (id) {
          setUserId(id);
        } else {
          Alert.alert("Error", "User ID not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error retrieving user ID:", error);
      }
    };

    getUserId();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleConfirm = async () => {
    if (!licenseNumber || !carRegNumber || !date) {
      Alert.alert("Validation Error", "Please fill all the required fields.");
      return;
    }

    // Convert the date to DD-MM-YYYY format
    const dobFormatted = new Date(date)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-"); // Example: "27-08-2000"

    const dlData = {
      userId: userId, // Using dynamic user ID
      dlnumber: licenseNumber,
      dob: dobFormatted,
    };

    const rcData = {
      userId: userId, // Using dynamic user ID
      regNumber: carRegNumber,
    };

    setIsSubmitting(true);

    try {
      // First, verify driving license
      const dlResponse = await axios.post(
        "http://10.11.52.77:3000/verify-dl",
        dlData
      );

      if (dlResponse.status === 200) {
        // If DL verification is successful, proceed with RC verification
        const rcResponse = await axios.post(
          "http://10.11.52.77:3000/verify-rc",
          rcData
        );

        if (rcResponse.status === 200) {
          Alert.alert("Success", "Your DL and RC details have been verified!");
          navigation.navigate("HomeScreen");
        } else {
          Alert.alert(
            "RC Verification Failed",
            rcResponse.data.error || "Unknown error occurred"
          );
        }
      } else {
        Alert.alert(
          "DL Verification Failed",
          dlResponse.data.error || "Unknown error occurred"
        );
      }
    } catch (error) {
      console.error(
        "Error verifying driving license or registration:",
        error.response ? error.response.data : error.message
      );

      Alert.alert("Error", "Failed to verify your details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate("HomeScreen");
  };

  const showDatepicker = () => {
    setShow(true);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Please fill up the below details to start sharing rides & Happy
        Earnings!!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder="Driving License Number*"
          placeholderTextColor="#7C7C7C"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={carRegNumber}
          onChangeText={setCarRegNumber}
          placeholder="Car Registration Number*"
          placeholderTextColor="#7C7C7C"
        />
      </View>

      <TouchableOpacity onPress={showDatepicker} style={styles.inputContainer}>
        <Text style={styles.placeholder}>
          {date ? date.toDateString() : "Date of Birth (DD/MM/YYYY)"}
          <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {/* Grouped Confirm button, line1, and skip text */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.Confirmbutton}
          onPress={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.line1}>
          You would not be able to provide rides if you,
        </Text>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>Skip For Now </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  heading: {
    fontFamily: "poppins",
    fontSize: 25,
    marginTop: 120,
    textAlign: "left",
    marginBottom: 25,
    color: "#000",
  },
  input: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#000",
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 5,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  placeholder: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#7C7C7C",
    paddingHorizontal: 15,
  },
  Confirmbutton: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "poppins",
  },
  line1: {
    fontFamily: "poppins",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
    color: "#5A5A5A",
  },
  skip: {
    color: "#4a73da",
    fontFamily: "poppins-medium",
    fontSize: 15,
    textAlign: "center",
  },
  requiredAsterisk: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#000",
  },
  inputContainer: {
    marginBottom: 18,
    paddingVertical: 10,
  },
  footer: {
    flex: 1, // Take up remaining space
    justifyContent: "flex-end", // Push content to the bottom
    paddingBottom: 20, // Add some padding at the bottom
  },
  contentContainer: {
    marginTop: 28, // Adjust this value to move the content down
  },
};

export default DriverVerification;
