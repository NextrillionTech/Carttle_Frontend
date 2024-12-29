import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "./BottomNav";

const RideCard = ({ ride }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image
        source={require("../assets/profilePic.jpg")}
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
    {/* Conditionally render the "View Earnings Breakup" button */}
    {ride.currentStatus === "Completed" && (
      <TouchableOpacity style={styles.earningsButton}>
        <Text style={styles.earningsText}>View Earnings Breakup</Text>
      </TouchableOpacity>
    )}
  </View>
);

const RidesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("RidesScreen");
  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [userName, setUserName] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [rides, setRides] = useState([]);

  const fetchNewRide = async () => {
    try {
      const storedOrigin = await AsyncStorage.getItem("originName");
      const storedDestination = await AsyncStorage.getItem("destinationName");
      const userName = await AsyncStorage.getItem("userName");

      const originStreet = storedOrigin?.split(",")[0] || "Unknown Origin";
      const destinationStreet =
        storedDestination?.split(",")[0] || "Unknown Destination";

      const newRide = {
        id: `${Date.now()}-${Math.random()}`, // Unique ID based on timestamp and random number
        name: userName || "Unknown User",
        location1: originStreet,
        location2: destinationStreet,
        earning: "", // Add appropriate values if needed
        timestamp: new Date().toLocaleString(),
        review: "",
        currentStatus: "Current Ride",
      };

      // Add the new ride only if it is unique
      setRides((prevRides) => {
        const isDuplicate = prevRides.some(
          (ride) =>
            ride.name === newRide.name &&
            ride.location1 === newRide.location1 &&
            ride.location2 === newRide.location2 &&
            ride.currentStatus === newRide.currentStatus
        );

        if (!isDuplicate) {
          return [newRide, ...prevRides]; // Prepend the new ride
        }

        console.log("Duplicate ride detected. Skipping tile creation.");
        return prevRides; // Return the original array if duplicate
      });
    } catch (error) {
      console.error("Error fetching ride data:", error);
    }
  };

  useEffect(() => {
    fetchNewRide(); // Fetch the first ride on screen load
  }, []);

  const handleOpenWebsite = () => {
    const url = "https://nextrilliontech.infinityfreeapp.com/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem("userName");
        if (name !== null) {
          setUserName(name); // Set the user name if it exists
        } else {
          Alert.alert("No user found", "User name is not available.");
        }
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        Alert.alert("Error", "Failed to fetch user name.");
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        const storedOrigin = await AsyncStorage.getItem("originName");
        const storedDestination = await AsyncStorage.getItem("destinationName");

        // Extract street names before the first comma
        const originStreet = storedOrigin?.split(",")[0] || "Unknown Origin";
        const destinationStreet =
          storedDestination?.split(",")[0] || "Unknown Destination";

        setOriginName(originStreet);
        setDestinationName(destinationStreet);
      } catch (error) {
        console.error("Error fetching location names:", error);
      }
    };

    fetchLocationNames();
  }, []);
  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };
  const toggleMenu = () => {
    if (isMenuVisible) {
      closeMenu();
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

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
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../assets/nav_icon.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Rides</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/Bell_icon.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={rides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.id}
      />
      {isMenuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View
            style={[
              styles.sideMenu,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuBackground}>
              <Image
                source={require("../assets/profilePic.jpg")}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{userName}</Text>
              <View style={styles.menuOptions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.menuOptionText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenWebsite}>
                  <Text style={styles.menuOptionText}>About</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("HelpScreen")}
                >
                  <Text style={styles.menuOptionText}>Help</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.menuOptionText}>Sign Out</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
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
  profileImage: {
    width: 80,
    height: 80,
    top: 25,
    borderRadius: 40,
    marginBottom: 30,
  },

  horizontalRuler2: {
    width: "150%", // Adjust this to control the width of the ruler
    height: 1,
    backgroundColor: "#d3d3d3", // Grey color
    alignSelf: "center", // Center align the ruler
    marginVertical: 10, // Optional: Adjust vertical spacing
  },

  profileImage: {
    width: 80,
    height: 80,
    top: "10%",
    borderRadius: 40,
    marginBottom: 30,
  },
  userName: {
    fontSize: 20,
    fontFamily: "poppins",
    marginTop: "20%",
  },

  menuOptionText: {
    fontSize: 18,
    alignContent: "center",
    alignItems: "center",
    fontFamily: "poppins",
    paddingVertical: 10,
    marginTop: 50,
  },
  slideMenu: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "80%", // or desired width
    backgroundColor: "#fff",
    transform: [{ translateX: -250 }], // Set initial hidden position
  },
});

export default RidesScreen;
