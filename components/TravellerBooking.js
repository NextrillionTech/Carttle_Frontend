import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Linking,
  Animated,
  Text,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import BottomNav from "./BottomNav";
import dropdownIcon from "../assets/dropdown.png";
import clockicon from "../assets/clock.png";

const { height, width } = Dimensions.get("window");

const TravellerBooking = ({ route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isYesPopupVisible, setYesPopupVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const navigation = useNavigation();
  const [TravelerUserName, setTravelerUserName] = useState(null);
  const [TraveleruserMobile, setTraveleruserMobile] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [selectedTime, setSelectedTime] = useState("");
  const [dateOptions, setDateOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [commuteBackRegularly, setCommuteBackRegularly] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [commuteRegularly, setCommuteRegularly] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [amountPerSeat, setAmountPerSeat] = useState(0);
  const [travelerprofilePic, setTravelerProfilePic] = useState(null);
  const handleOpenWebsite = () => {
    const url = "https://nextrilliontech.infinityfreeapp.com/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  useEffect(() => {
    const getProfilePic = async () => {
      const savedProfilePic = await AsyncStorage.getItem("travelerprofilePic");
      if (savedProfilePic) {
        setTravelerProfilePic(savedProfilePic); // Set the profile picture URL from AsyncStorage
      }
    };

    getProfilePic(); // Fetch the profile picture on component mount
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

  const openNotifications = () => {
    navigation.navigate("NotificationScreen");
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

  const fetchRoute = async (origin, destination) => {
    const MAPBOX_TOKEN =
      "sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ"; // Replace with your token
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.routes[0]?.geometry?.coordinates;

      if (coordinates) {
        const routeCoords = coordinates.map((point) => ({
          latitude: point[1],
          longitude: point[0],
        }));
        setRouteCoords(routeCoords);
      } else {
        setError("No route found");
      }
    } catch (error) {
      setError("Error fetching route");
    } finally {
      setLoading(false);
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

  const handleToggle = () => {
    setCommuteRegularly((prevValue) => {
      const newValue = !prevValue;
      if (newValue) {
        setYesPopupVisible(true);
      }
      return newValue;
    });
  };

  const incrementSeats = () => {
    if (seatsAvailable < 3) {
      setSeatsAvailable((prev) => prev + 1);
    }
  };

  const decrementSeats = () => {
    setSeatsAvailable((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleImageButtonPress = () => {
    console.log("Image button pressed!");
    // Add your specific functionality here
  };

  const handleFirstButtonPress = () => {
    console.log("First button pressed!");
    // Add your specific functionality here
  };

  const handleSecondButtonPress = () => {
    console.log("Second button pressed!");
    // Add your specific functionality here
  };

  return (
    <View style={styles.container}>
      {currentLocation && destination ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (currentLocation.latitude + destination.latitude) / 2,
            longitude: (currentLocation.longitude + destination.longitude) / 2,
            latitudeDelta:
              Math.abs(currentLocation.latitude - destination.latitude) * 2,
            longitudeDelta:
              Math.abs(currentLocation.longitude - destination.longitude) * 2,
          }}
        >
          <Marker
            coordinate={currentLocation}
            title="You are here"
            description="Current Location"
          >
            <Image
              source={require("../assets/car_loc.png")}
              style={styles.icon1}
            />
          </Marker>
          <Marker coordinate={destination} title="Destination">
            <Image
              source={require("../assets/curr_loc.png")}
              style={styles.icon}
            />
          </Marker>

          <Polyline
            coordinates={routeCoords}
            strokeWidth={3}
            strokeColor="black"
          />
        </MapView>
      ) : (
        <Text style={styles.errorText}>{error || "No data available"}</Text>
      )}

      <TouchableOpacity onPress={toggleMenu}>
        <Image
          source={require("../assets/nav_icon.png")}
          style={[styles.icon, styles.menuIcon]}
        />
      </TouchableOpacity>
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
                source={{ uri: travelerprofilePic }}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{TravelerUserName}</Text>
              <View style={styles.menuOptions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("TravelerProfile")}
                >
                  <Text style={styles.menuOptionText}>Profile</Text>
                </TouchableOpacity>
                <View style={styles.horizontalRuler2} />

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
                <TouchableOpacity
                  onPress={() => navigation.navigate("TravellerWecome")}
                >
                  <Text style={styles.menuOptionText}>Sign Out</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={openNotifications}
          style={{ width: 40, height: 40 }}
        >
          <Image
            source={require("../assets/Bell_icon.png")}
            style={[styles.icon, styles.notificationIcon]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.horizontalRuler1} />
          <Text style={styles.cardTitle}>
            Alex Brim can reach you in 5mins.
          </Text>
        </View>
        <View style={styles.horizontalRuler} />
        <View style={styles.cardContent}>
          <View style={styles.driverInfo}>
            <Image
              source={require("../assets/driver_avatar.jpg")}
              style={styles.driverAvatar}
            />
            <View>
              <Text style={styles.driverName}>2 seats available</Text>
              <Text style={styles.driverLocation}>
                Udyog Vihar, Phase 1, 122001
              </Text>
              <Text style={styles.driverLocation}>⭐4.9 (531 reviews)</Text>
            </View>
            <Image
              source={require("../assets/driver_car.jpg")}
              style={styles.carImage}
            />
          </View>
          <View style={styles.horizontalRuler} />
          <View style={styles.detailsRow}>
            <Image
              source={require("../assets/seat_icon.png")}
              style={styles.detailsIcon}
            />
            <Text style={styles.detailsLabel}>Seats Available</Text>
            <View style={styles.seatControlContainer}>
              <TouchableOpacity
                onPress={decrementSeats}
                style={styles.seatButton}
              >
                <Text style={styles.seatButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.detailsValue}>{seatsAvailable} seat(s)</Text>
              <TouchableOpacity
                onPress={incrementSeats}
                style={styles.seatButton}
              >
                <Text style={styles.seatButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.horizontalRuler} />
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Payment Method</Text>
            <Text style={styles.detailsValue}>₹220.00</Text>
          </View>
          <TouchableOpacity
            onPress={handleImageButtonPress}
            style={styles.imageButton}
          >
            <Image
              source={require("../assets/upi.png")} // Replace with your image path
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.navigate("PaymentScreen")}
            >
              <Text style={styles.buttonText1}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navIcon}>
            <Image
              source={require("../assets/HOME.png")}
              style={styles.navIconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon}>
            <Image
              source={require("../assets/RIDES.png")}
              style={styles.navIconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon}>
            <Image
              source={require("../assets/msg_icon.png")}
              style={styles.navIconImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  popup: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  popupMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "poppins",
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "#7C7C7C",
    alignSelf: "flex-start",
  },
  selectLabel1: {
    paddingTop: 20,
    paddingRight: 225,
    fontSize: 16,
    color: "#7C7C7C",
  },
  dropdownContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  dropdownWrapper: {
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  closeButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 25,
    width: "80%",
    marginLeft: "10%",
    alignItems: "center",
    borderRadius: 5,
  },
  dateRangeText1: {
    paddingRight: 40,
    marginLeft: 10,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "poppins",
    fontSize: 16,
  },

  icon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  icon1: {
    width: 20,
    height: 30,
    resizeMode: "cover",
  },
  topLeftIcon: {
    position: "absolute",
    top: 60,
    left: 10,
    width: 40,
    height: 40,
  },
  menuIcon: {
    position: "relative",
    bottom: "845%",
    margintop: 9,
    right: 160,
    height: 40,
    width: 40,
  },
  topRightIcon: {
    position: "absolute",
    top: 43,
    right: 10,
    width: 40,
    height: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    top: 25,
    borderRadius: 40,
    marginBottom: 30,
  },
  userName: {
    fontSize: 20,
    fontFamily: "poppins",
  },
  userEmail: {
    fontSize: 10,
    color: "gray",
    fontFamily: "poppins",
    marginBottom: 30,
  },
  menuOptionText: {
    fontSize: 18,
    alignContent: "center",
    alignItems: "center",
    fontFamily: "poppins",
    paddingVertical: 10,
  },
  horizontalRuler: {
    width: "100%",
    height: 1,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    marginVertical: 15,
    marginTop: 15,
  },
  horizontalRuler2: {
    width: "150%",
    height: 1,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    marginVertical: 15,
  },
  card: {
    width: "100%",
    height: "65%",
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    position: "absolute",
    bottom: 0,
    elevation: 5,
  },
  cardHeader: {
    alignItems: "center",
  },
  horizontalRuler1: {
    width: 80,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#808080",
    marginVertical: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "poppins",
    marginVertical: 5,
    color: "#5A5A5A",
  },
  cardContent: {
    marginTop: 10,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 15,
  },
  driverName: {
    fontSize: 14,
    color: "#5a5a5a",
    fontFamily: "poppins",
  },
  driverLocation: {
    color: "#a0a0a0",
    fontFamily: "poppins",
    fontSize: 11,
  },
  carImage: {
    marginLeft: "auto",
    width: 120,
    height: 60,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  detailsIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  detailsLabel: {
    fontSize: 14,
    fontFamily: "poppins",
    flex: 1,
    color: "#2D2D2D",
    marginRight: 15,
  },
  seatControlContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  seatButton: {
    backgroundColor: "#000000",
    padding: 5,
    width: 30,
    height: 30,
    borderRadius: 45,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  seatButtonText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
  },

  textContainer: {
    flexDirection: "row",
  },

  confirmButtonContainer: {
    marginTop: 5,
    backgroundColor: "#000000",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontFamily: "poppins",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },

  sideMenu: {
    position: "absolute",
    top: 0,
    elevation: 5,
    zIndex: 2,
    backgroundColor: "white",
    width: "60%",
    height: "100%",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    left: 0,
    alignItems: "center",
  },
  imageButton: {
    alignItems: "center", // Padding around the image
  },
  image: {
    width: "110%", // Adjust width as needed
    height: 100, // Adjust height as needed
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    width: "100%", // Adjust as needed
  },
  Button1: {
    borderColor: "#000", // Border color
    borderWidth: 2, // Border width
    borderRadius: 10, // Rounded corners // Padding around the image
  },
  Button2: {
    borderColor: "#000", // Border color
    borderWidth: 2, // Border width
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding around the image
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationIcon: {
    position: "relative",
    bottom: "945%",
    left: 160,
    height: 40,
    width: 40,
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "poppins",
  },
  buttonText1: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "poppins",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  navIcon: {
    alignItems: "center",
  },
  navIconImage: {
    width: 59,
    height: 45,
  },
  navText: {
    fontSize: 12,
    fontFamily: "poppins",
    marginTop: 5,
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
});

export default TravellerBooking;
