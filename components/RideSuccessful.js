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
  const { rideDetails } = route.params; // Get ride details from route parameters
  const [currentLocationName, setCurrentLocationName] = useState(""); // State for current location name
  const [destinationName, setDestinationName] = useState(""); // State for destination name

  console.log("Ride Details:", rideDetails);
  const rideId = rideDetails.__id;

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
      // Extract place name from response
      const address = response.data.address;
      const placeName =
        address.name ||
        address.shop ||
        address.amenity ||
        address.poi ||
        address.road ||
        address.street ||
        "Place name not found"; // Use specific commercial attributes if available
      return placeName; // Return the best available name
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Error fetching place name"; // Handle error
    }
  };

  // Function to format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch place names when component mounts
  useEffect(() => {
    const fetchPlaceNames = async () => {
      // Get current location name
      const currentName = await getPlaceName(
        rideDetails.currentLocation.latitude,
        rideDetails.currentLocation.longitude
      );
      setCurrentLocationName(currentName);

      // Get destination name
      const destinationName = await getPlaceName(
        rideDetails.destination.latitude,
        rideDetails.destination.longitude
      );
      setDestinationName(destinationName);
    };

    fetchPlaceNames();
  }, [rideDetails]);

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
          <Text style={styles.detailValue}>{currentLocationName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To:</Text>
          <Text style={styles.detailValue}>{destinationName} </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Available Seats</Text>
          <Text style={styles.detailValue}>{rideDetails.availableSeats}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Per Seat</Text>
          <Text style={styles.detailValue}>{rideDetails.amountPerSeat}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timestamp</Text>
          <Text style={styles.detailValue}>
            {formatDate(rideDetails.date)},{rideDetails.time}
          </Text>
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
