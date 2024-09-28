import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
const { width, height } = Dimensions.get("window");

// Load fonts
const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const DriverVerification = () => {
  const navigation = useNavigation(); // Accessing the navigation object
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
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
  }, []);

  // Date picker change handler
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // Keep it open on iOS, close on Android
    setDate(currentDate);
  };

  const handleConfirm = () => {
    navigation.navigate("MapScreen");
  };

  const handleSkip = () => {
    navigation.navigate("MapScreen");
  };

  // Show date picker on tap
  const showDatepicker = () => {
    setShow(true);
  };

  // If fonts are not yet loaded, show loading indicator
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Please fill up the below details to start sharing rides & Happy
        Earnings!!
      </Text>

      <View style={styles.inputContainer1}>
        <Text style={styles.placeholder}>
          Driving License Number<Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.inputContainer1}>
        <Text style={styles.placeholder}>
          Car Registration Number (Number Plate)
          <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput style={styles.input} />
      </View>

      <TouchableOpacity onPress={showDatepicker} style={styles.inputContainer}>
        <Text style={styles.placeholder1}>
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
      <TouchableOpacity
        style={[styles.Confirmbutton]}
        onPress={handleConfirm}
      >
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      <Text style={styles.line1}>
        You would not be able to provide rides if you,
      </Text>
      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skip}>Skip For Now </Text>
      </TouchableOpacity>
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
    fontFamily: "poppins",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
    color: "#000",
  },
  input: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#000",
    paddingVertical: 10,
    height: 25,
    borderRadius: 5,
  },
  placeholder: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 7,
    paddingHorizontal: 15,
    textAlign: 'left',
    top: 12,
  },
  placeholder1: {
    fontFamily: "poppins",
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 7,
    paddingHorizontal: 15,
    textAlign: 'left',
  },
  Confirmbutton: {
    backgroundColor: "#000",
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    alignItems: "center",
    marginTop: height * 0.17,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
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
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 18,
    paddingVertical: 10,
  },
  inputContainer1: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 18,
    paddingVertical: 1,
  },
};

export default DriverVerification;