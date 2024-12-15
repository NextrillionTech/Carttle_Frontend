import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import BottomNav from "./BottomNav"; // Ensure BottomNav is correctly imported
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const RideItem = ({ ride }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={require("../assets/driver_avatar.png")}
          style={styles.profilePic}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{ride.name}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {ride.rating}</Text>
            <Text style={styles.ratingCount}>({ride.ratingCount})</Text>
          </View>
          <Text style={styles.location}>{ride.pickup}</Text>
          <Text style={styles.location}>{ride.destination}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{ride.time}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.detailValue}>{ride.price}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Vehicle</Text>
          <Text style={styles.detailValue}>{ride.vehicle}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{ride.rideTime}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.requestButtonText} onPress={handleRequestPress}>
          Request Ride
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const RidesList = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("rides");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      navigation.navigate("HomeScreen");
    } else if (tab === "rides") {
      navigation.navigate("RidesScreen");
    } else if (tab === "message") {
      navigation.navigate("MessageScreen");
    }
  };

  const handleRequestPress = () => {
    navigation.navigate("TravelBooking");
  };

  const openMenu = () => {
    // Logic to open the menu
    console.log("Menu opened");
  };

  const openNotifications = () => {
    navigation.navigate("NotificationScreen");
  };

  const rides = [
    {
      id: "1",
      image: "https://via.placeholder.com/150",
      name: "Alex Brim",
      rating: "4.7",
      ratingCount: "1",
      pickup: "ESIC Hospital, Sector9A, 122001",
      destination: "Udyog Vihar, Phase 1, 122001",
      price: "₹200",
      vehicle: "Silver Suzuki WagonR",
      rideTime: "5:20pm",
      time: "Coming in 5 mins",
    },
    // Add more rides here
  ];

  return (
    <View style={styles.container}>
      {/* Header with Menu and Notification Icons */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={openMenu}>
          <Image
            source={require("../assets/nav_icon.png")} // Ensure this path is correct
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={openNotifications}>
          <Image
            source={require("../assets/Bell_icon.png")} // Ensure this path is correct
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rides}
        renderItem={({ item }) => <RideItem ride={item} />}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.bottomNav}>
        <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    position: "absolute", // Positioning the header at the top
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontFamily: "poppins",
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#FFA500",
    fontFamily: "poppins",
    marginRight: 5,
  },
  ratingCount: {
    color: "#888",
    fontFamily: "poppins",
  },
  location: {
    fontSize: 12,
    fontFamily: "poppins",
    color: "#666",
  },
  timeContainer: {
    backgroundColor: "#E5F7FF",
    padding: 5,
    borderRadius: 10,
    height: 40,
  },
  time: {
    color: "#007AFF",
    fontFamily: "poppins",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  detail: {
    alignItems: "center",
  },
  detailLabel: {
    color: "#888",
    fontSize: 12,
    fontFamily: "poppins",
  },
  detailValue: {
    fontFamily: "poppins",
    fontSize: 14,
  },
  requestButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  requestButtonText: {
    color: "#fff",
    fontFamily: "poppins",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default RidesList;
