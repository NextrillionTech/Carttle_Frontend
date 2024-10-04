import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For the back icon
import { useFonts } from "expo-font";

const RideSuccessful = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "poppins-medium": require("../assets/Poppins-Medium.ttf"),
  });
  const handleBack = () => {
    navigation.goBack();
  };
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
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
      <Text style={styles.rideId}>01859-489562</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From</Text>
          <Text style={styles.detailValue}>Udyog Vihar, Phase 1...</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>To</Text>
          <Text style={styles.detailValue}>Ambience Mall, Gur...</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Available Seats</Text>
          <Text style={styles.detailValue}>3</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Per Seat</Text>
          <Text style={styles.detailValue}>₹100.00</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timestamp</Text>
          <Text style={styles.detailValue}>01/11/22, 10:45PM</Text>
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
