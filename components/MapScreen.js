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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import BottomNav from "./BottomNav";

const { height, width } = Dimensions.get("window");

const MapScreen = ({ route }) => {
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

  const { totalCost } = route.params;

  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [selectedTime, setSelectedTime] = useState("");
  const [dateOptions, setDateOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [commuteBackRegularly, setCommuteBackRegularly] = useState(false);

  const { destination } = route.params;
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

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentLocation);

        if (destination) {
          fetchRoute(currentLocation, destination);
        } else {
          setError("Destination is not available");
          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching location");
        setLoading(false);
      }
    })();
  }, [destination]);

  useEffect(() => {
    const generateTimeOptions = () => {
      const options = [];
      const currentTime = new Date();

      for (let i = 0; i < 48; i++) {
        const time = new Date(currentTime.getTime() + i * 30 * 60000);
        const formattedTime = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        options.push(formattedTime);
      }
      setTimeOptions(options);
    };

    generateTimeOptions();
  }, []);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleMenu = () => {
    if (isMenuVisible) {
      closeMenu();
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in to the center
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

  const incrementAmount = () => {
    setAmountPerSeat((prev) => prev + 10);
  };

  const decrementAmount = () => {
    setAmountPerSeat((prev) => (prev > 10 ? prev - 10 : 10));
  };

  const handleConfirmDetails = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (!storedUserId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Prepare GeoJSON format
      const fromCoordinates = {
        type: "Point",
        coordinates: [currentLocation.longitude, currentLocation.latitude], // [longitude, latitude]
      };
      const toCoordinates = {
        type: "Point",
        coordinates: [destination.longitude, destination.latitude], // [longitude, latitude]
      };

      const dataToSend = {
        userId: storedUserId,
        from: currentLocation,
        to: destination,
        available_seat: seatsAvailable,
        amount_per_seat: amountPerSeat,
        shuttle: false, // Set to false for this case
        dateDetails: {
          date: new Date().toISOString(), // Ensure this is formatted as ISO string
          time: formatTime(time),
        },
        round_trip: false, // Set to false for this case
      };

      console.log("Data being sent:", JSON.stringify(dataToSend));

      // Sending the data for a one-time ride
      const response = await axios.post(
        "http://192.168.29.99:3000/create-ride",
        dataToSend
      );
      console.log("Response for one-time ride:", response.data);

      if (!response.data.ride || !response.data.ride._id) {
        throw new Error("Ride ID not found in the response.");
      }

      const rideDetails = {
        __id: response.data.ride._id,
        destination: destination,
        currentLocation: currentLocation,
        availableSeats: seatsAvailable,
        amountPerSeat: amountPerSeat,
        date: new Date().toISOString(),
        time: formatTime(time),
      };

      setYesPopupVisible(false);
      navigation.navigate("RideSuccessful", { rideDetails });
    } catch (error) {
      console.error(
        "Error sending data:",
        error.response ? error.response.data : error.message
      );
      setError("Error sending data to API");
    }
  };
  // Helper function to format time to "hh:mm AM/PM"
  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + strMinutes + " " + ampm;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

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
                source={require("../assets/profilePic.jpg")}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>Naina Kapoor</Text>
              <Text style={styles.userEmail}>naina**@gmail.com</Text>
              <View style={styles.menuOptions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.menuOptionText}>Profile</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.menuOptionText}>Trip History</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://nextrilliontech.infinityfreeapp.com"
                    )
                  }
                >
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

      <Image
        source={require("../assets/Bell_icon.png")}
        style={styles.topRightIcon}
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.horizontalRuler1} />
          <Text style={styles.cardTitle}>
            Please fill the below details to proceed...
          </Text>
        </View>
        <View style={styles.horizontalRuler} />
        <View style={styles.cardContent}>
          <View style={styles.driverInfo}>
            <Image
              source={require("../assets/driver_avatar.png")}
              style={styles.driverAvatar}
            />
            <View>
              <Text style={styles.driverName}>HR26EM3749 (now)</Text>
              <Text style={styles.driverLocation}>
                Udyog Vihar, Phase 1, 122001
              </Text>
              <Text style={styles.driverLocation}>Ambience Mall, Gurugram</Text>
            </View>
            <Image
              source={require("../assets/driver_car.png")}
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
            <Image
              source={require("../assets/money_icon.png")}
              style={styles.detailsIcon}
            />
            <Text style={styles.detailsLabel}>Amount Per Seat</Text>
            <View style={styles.seatControlContainer}>
              <TouchableOpacity
                onPress={decrementAmount}
                style={styles.seatButton}
              >
                <Text style={styles.seatButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.detailsValue}>₹{amountPerSeat}.00</Text>
              <TouchableOpacity
                onPress={incrementAmount}
                style={styles.seatButton}
                disabled={amountPerSeat >= totalCost}
              >
                <Text style={styles.seatButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.horizontalRuler} />
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel1}>
              Do you commute to this destination regularly?
            </Text>
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={handleToggle}
            >
              <View style={styles.ovalShape}>
                <View style={styles.textContainer}>
                  <Text style={styles.toggleText}>
                    {commuteRegularly ? "Yes" : ""}
                  </Text>
                  <Text style={styles.toggleText}>
                    {commuteRegularly ? "" : "No"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggleCircle,
                    {
                      backgroundColor: "#FFFFFF", // Always white
                      transform: [
                        {
                          translateX: commuteRegularly ? 30 : 0, // Move the toggle
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity onPress={handleConfirmDetails}>
              <Text style={styles.confirmButtonText}>Confirm Details</Text>
            </TouchableOpacity>
          </View>
          <BottomNav
            activeTab={activeTab}
            onTabPress={handleTabPress}
            style={styles.bottomNav}
          />
        </View>
      </View>

      <Modal
        visible={isYesPopupVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setYesPopupVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupMessage}>
              Make your ride a <Text style={styles.popupTitle}>shuttle </Text>
              and confirm your <Text style={styles.popupTitle}>earnings </Text>
              daily, without the hustle to create a new ride tomorrow,
              day-after-tom, & so on...
            </Text>

            {/* Date Range Selection */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.selectLabel}>Start Date</Text>
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                <Text style={styles.selectedWeekText}>
                  {`${formatDate(startDate)}`}
                  {"\n"}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event.type === "set" && selectedDate) {
                      setStartDate(selectedDate);
                    }
                    setShowStartDatePicker(false);
                  }}
                />
              )}

              <Text style={styles.selectLabel}>End Date</Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                <Text style={styles.selectedWeekText}>
                  {`${formatDate(endDate)}`}
                  {"\n"}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event.type === "set" && selectedDate) {
                      setEndDate(selectedDate);
                    }
                    setShowEndDatePicker(false);
                  }}
                />
              )}

              <Text style={styles.selectLabel}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text style={styles.selectedWeekText}>
                  {selectedTime || "Select a time"}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    if (event.type === "set" && selectedTime) {
                      setTime(selectedTime); // Update time state with selected time
                      setSelectedTime(formatTime(selectedTime)); // Format and set selected time
                    }
                    setShowTimePicker(false); // Close the time picker
                  }}
                />
              )}
            </View>

            {/* Toggle for Commute Regularly */}
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel1}>
                Do you commute to this destination regularly?
              </Text>
              <TouchableOpacity
                style={styles.toggleContainer}
                onPress={handleToggle}
              >
                <View style={styles.ovalShape}>
                  <View style={styles.textContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.toggleText}>
                        {commuteRegularly ? "Yes" : ""}
                      </Text>
                      <Text style={styles.toggleText}>
                        {commuteRegularly ? "" : "No"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.toggleCircle,
                      {
                        backgroundColor: "#FFFFFF", // Always white
                        transform: [
                          {
                            translateX: commuteRegularly ? 30 : 0, // Move the toggle
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Show additional options only if commuteRegularly is true */}
            {commuteRegularly && (
              <>
                <Text style={styles.selectLabel}>Select Date Range</Text>

                {/* Date Range Display when Toggle is Yes */}
                <View style={styles.dateRangeContainer}>
                  <Text style={styles.dateRangeText1}>
                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                  </Text>
                </View>

                <Text style={styles.selectLabel1}>Select Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.selectedWeekText1}>
                    {selectedTime || "Select a time"}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      if (event.type === "set" && selectedTime) {
                        setTime(selectedTime); // Update time state with selected time
                        setSelectedTime(formatTime(selectedTime)); // Format and set selected time
                      }
                      setShowTimePicker(false); // Close the time picker
                    }}
                  />
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setYesPopupVisible(false)}
            >
              <Text style={styles.closeButtonText}>Yes! Make It A Shuttle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignSelf: "flex-start", // Left align the text
  },

  selectLabel1: {
    paddingTop: 20,
    paddingRight: 225,
    fontSize: 16,

    color: "#7C7C7C",
  },
  selectedWeekText1: {
    paddingRight: 250,
    color: "#000000",
    paddingBottom: 20,
  },
  dropdownContainer: {
    width: "100%",
    alignItems: "flex-start", // Align items to the start
    marginBottom: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
  },
  dateRangeText1: {
    paddingRight: 140,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "poppins",
    fontSize: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    marginVertical: 10,
  },
  horizontalRuler2: {
    width: "150%",
    height: 1,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    marginVertical: 10,
  },
  card: {
    width: "100%",
    height: "65%",
    backgroundColor: "#fff",
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
    marginVertical: 10,
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
  detailsLabel1: {
    fontSize: 12,
    fontFamily: "poppins",
    flex: 1,
    marginLeft: 7,
  },
  detailsValue1: {
    fontSize: 16,
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
    width: 30, // Increased width for better visibility
    height: 30, // Increased height for better visibility
    borderRadius: 45,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  seatButtonText: {
    fontSize: 16, // Increased font size for better visibility
    color: "#ffffff",
    textAlign: "center", // Center the text
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 3,
    borderRadius: 30,
    backgroundColor: "#7C7C7C",
    color: "7C7C7C",
    marginTop: 7,
  },
  textContainer: {
    flexDirection: "row",
  },
  ovalShape: {
    backgroundColor: "#7C7C7C",
    borderRadius: 25,
    height: 30,
    width: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    left: 5, // Start position (for 'Yes')
  },
  toggleText: {
    color: "#ffffff",
    fontFamily: "poppins",
    flexDirection: "row",
    fontSize: 12,
    flex: 1,
  },

  confirmButtonContainer: {
    marginTop: 10,
    backgroundColor: "#000000",
    paddingVertical: 10,
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
});

export default MapScreen;
