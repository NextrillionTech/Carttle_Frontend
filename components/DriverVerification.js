import React, { useState, useEffect } from "react";
import {
  View,
  Text,    
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Load fonts
const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const DriverVerification = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts and hide splash screen when ready
  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    };

    loadFonts();
  }, []);

  // Date picker change handler
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // Keep it open on iOS, close on Android
    setDate(currentDate);
  };

  // Show date picker on tap
  const showDatepicker = () => {
    setShow(true);
  };

  // If fonts are not yet loaded, return null
  if (!fontsLoaded) {
    return null; // While fonts are loading, render nothing
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Please fill up the below details to start sharing rides & Happy
        Earnings!!
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.placeholder}>
          Driving License Number<Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.placeholder}>
          Car Registration Number (Number Plate)
          <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput style={styles.input} />
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
          display="default" // Default style for mobile
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  heading: {
    fontFamily: "poppins", // Matches the font you loaded
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },

  input: {
    fontFamily: "poppins", // Matches the font you loaded
    fontSize: 14, // Reduced font size
    color: "#000",
    paddingVertical: 10, // Keep this value for overall box size
    height: 40, // Adjust height to fit the text
    borderRadius: 5, // Adjust the border radius
  },

  placeholder: {
    fontFamily: "poppins", // Matches the font you loaded
    fontSize: 14, // Reduced font size for placeholder
    color: "#7C7C7C", // Placeholder color
    marginTop: 5, // Move placeholder text down
  },

  inputContainer: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 1,
    paddingVertical: 10,
  },

  requiredAsterisk: {
    fontFamily: "poppins",
    fontSize: 14, // Same size for consistency
    color: "#000", // Black color for asterisk
  },
};

export default DriverVerification;
