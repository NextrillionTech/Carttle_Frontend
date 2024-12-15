import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For the back icon
import { useFonts } from "expo-font";

const RideSuccessful = ({ route }) => {
  // Get ride details and rideId from route params
  const {
    originName,
    destinationName,
    availableSeats,
    amountPerSeat,
    date,
    time,
    rideId, // Extract rideId from params
  } = route.params;

  console.log("Ride Details:", {
    originName,
    destinationName,
    availableSeats,
    amountPerSeat,
    date,
    time,
    rideId, // Log the rideId
  });

  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "poppins-medium": require("../assets/Poppins-Medium.ttf"),
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Function to convert latitude and longitude to place name
  const getPlaceName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const address = response.data.address;
      const placeName =
        address.name ||
        address.shop ||
        address.amenity ||
        address.poi ||
        address.road ||
        address.street ||
        "Place name not found"; // Use specific commercial attributes if available
      return placeName;
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Error fetching place name";
    }
  };

  // Function to format date to DD/MM/YYYY
  const getCurrentDateTime = () => {
    const now = new Date();

    // Format the date as DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Format the time as HH:MM AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    const formattedTime = `${String(hours).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;

    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={require("../assets/back.png")} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color="black" />
      </View>

      <Text style={styles.successText}>Ride Created Successfully</Text>

      <Text style={styles.rideId}>{rideId}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From:</Text>
          <Text style={styles.detailValue}>{originName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To:</Text>
          <Text style={styles.detailValue}>{destinationName} </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Available Seats</Text>
          <Text style={styles.detailValue}>{availableSeats}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Per Seat</Text>
          <Text style={styles.detailValue}>{amountPerSeat}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timestamp</Text>
          <Text style={styles.detailValue}>
            {getCurrentDateTime(date)}, {time}
          </Text>
        </View>
        {/* Display the rideId */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ride ID</Text>
          <Text style={styles.detailValue}>{rideId}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RidesScreen")}
      >
        <Text style={styles.buttonText}>Back to Rides</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 80,
    left: 15,
    marginBottom: 5,
  },
  backIcon: {
    width: 26,
    height: 26,
    marginRight: 2,
  },
  backText: {
    fontSize: 18,
    color: "#414141",
    fontFamily: "poppins-medium",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 110,
  },
  successText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "poppins-medium",
    marginTop: 20,
  },
  rideId: {
    textAlign: "center",
    fontSize: 16,
    color: "#7C7C7C",
    fontFamily: "poppins-medium",
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: "#7C7C7C",
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "poppins-medium",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    marginTop: 155,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "poppins-medium",
  },
});

export default RideSuccessful;
