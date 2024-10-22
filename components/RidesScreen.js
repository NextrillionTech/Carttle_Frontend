import React, { useState } from "react"; // Import useState
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BottomNav from "./BottomNav";

const rides = [
  {
    id: "1",
    name: "Alex Brim+2",
    rating: "4.7",
    location1: "ESIC Hospital, Sector9A, 122001",
    location2: "Udyog Vihar, Phase 1, 122001",
    earning: "₹200",
    timestamp: "01/11/22 | 5:20pm",
    review: "Lorem Ipsum is the...",
    currentStatus: "Completed in 45 mins",
  },
  {
    id: "2",
    name: "Alex Brim+2",
    rating: "4.7",
    location1: "ESIC Hospital, Sector9A, 122001",
    location2: "Udyog Vihar, Phase 1, 122001",
    earning: "₹200",
    timestamp: "01/11/22 | 5:20pm",
    review: "Lorem Ipsum is the...",
    currentStatus: "Current Trip",
  },
];

const RideCard = ({ ride }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image
        source={require("../assets/profilePic.jpg")} // Replace with actual profile image path
        style={styles.profilePic}
      />
      <View style={styles.rideInfo}>
        <Text style={styles.name}>{ride.name}</Text>
        <Text style={styles.location}>{ride.location1}</Text>
        <Text style={styles.location}>{ride.location2}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text
          style={
            ride.currentStatus === "Current Trip"
              ? styles.statusActive
              : styles.status
          }
        >
          {ride.currentStatus}
        </Text>
      </View>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.detailsRow}>
        <Text style={styles.detailsLabel}>Earnings</Text>
        <Text style={styles.detailsValue}>{ride.earning}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailsLabel}>Review</Text>
        <Text style={styles.detailsValue}>{ride.review}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailsLabel}>Timestamp</Text>
        <Text style={styles.detailsValue}>{ride.timestamp}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.earningsButton}>
      <Text style={styles.earningsText}>View Earnings Breakup</Text>
    </TouchableOpacity>
  </View>
);

const RidesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("RidesScreen"); // Move useState here

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image
            source={require("../assets/nav_icon.png")} // Replace with actual menu icon path
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Rides</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/Bell_icon.png")} // Replace with actual bell icon path
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rides}
        renderItem={({ item }) => <RideCard ride={item} />}
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
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 23,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rideInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#7c7c7c",
  },
  statusContainer: {
    paddingHorizontal: 10,
  },
  status: {
    backgroundColor: "#3498db",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusActive: {
    backgroundColor: "#1abc9c",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  cardBody: {
    paddingVertical: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailsLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsValue: {
    fontSize: 14,
    color: "#7c7c7c",
  },
  earningsButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  earningsText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  navIcon: {
    padding: 10,
  },
  navImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default RidesScreen;
