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
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import dropdownicon from "../assets/dropdown.png";
import clockicon from "../assets/clock.png";
import { Picker } from "@react-native-picker/picker";
import BottomNav from "./BottomNav";

const { height, width } = Dimensions.get("window");

const MapScreen = ({ route }) => {
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
  const [rcModel, setRcModel] = useState(null);
  const [carRegNumber, setCarRegNumber] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const [name, setName] = useState("");

  const [storedTime, setStoredTime] = useState("");

  const [driverId, setDriverId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");

  const [modalCommuteRegularly, setModalCommuteRegularly] = useState(false); // Toggle for modal
  const {
    totalCost,
    origin,
    destination,
    option,
    timeData,
    customDate,
    distance,
    formattedTime,
  } = route.params;

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

  const [time1, setTime1] = useState(new Date());

  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [amountPerSeat, setAmountPerSeat] = useState(totalCost - 10);

  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const handleOpenWebsite = () => {
    const url = "https://nextrilliontech.infinityfreeapp.com/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  useEffect(() => {
    const getProfilePic = async () => {
      const savedProfilePic = await AsyncStorage.getItem("profilePic");
      if (savedProfilePic) {
        setProfilePic(savedProfilePic); // Set the profile picture URL from AsyncStorage
      }
    };

    getProfilePic(); // Fetch the profile picture on component mount
  }, []);
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        // Fetch data from AsyncStorage
        const storedDriverId = await AsyncStorage.getItem("driverUserId");
        const storedDriverName = await AsyncStorage.getItem("driverName");
        const storedDriverPhoneNumber = await AsyncStorage.getItem(
          "driverPhoneNumber"
        );

        // Update state variables
        if (storedDriverId) setDriverId(storedDriverId);
        if (storedDriverName) setDriverName(storedDriverName);
        if (storedDriverPhoneNumber)
          setDriverPhoneNumber(storedDriverPhoneNumber);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };

    fetchDriverDetails();
  }, []);

  useEffect(() => {
    if (option) {
      setSelectedTime(option); // Set selectedTime to option when it is received
    }
  }, [option]);

  useEffect(() => {
    const getSelectedTime = async () => {
      try {
        const time = await AsyncStorage.getItem("selectedTime");

        if (time !== null) {
          setSelectedTime(time);
          console.log("Retrieved time from AsyncStorage:", time);
        } else {
          Alert.alert("No time selected", "No time has been set.");
        }
      } catch (error) {
        console.error("Failed to fetch selected time:", error);
        Alert.alert("Error", "Failed to fetch selected time.");
      }
    };

    getSelectedTime();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const storedCarRegNumber = await AsyncStorage.getItem("carRegNumber");

        if (storedCarRegNumber) setCarRegNumber(storedCarRegNumber);
      } catch (error) {
        console.error("Error fetching driver details:", error);
        Alert.alert("Error", "Failed to fetch driver details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // to fetch the name of car from the prev screen
  useEffect(() => {
    const fetchRcModel = async () => {
      try {
        const model = await AsyncStorage.getItem("rc_model");
        if (model) {
          setRcModel(model);
        } else {
          Alert.alert("No RC Model Found", "Please verify your details first.");
        }
      } catch (error) {
        console.error("Error retrieving rc_model:", error);
        Alert.alert("Error", "Failed to retrieve RC Model.");
      } finally {
        setLoading(false);
      }
    };

    fetchRcModel();
  }, []);

  //to fetch the car image from cloudinary using rc_model

  const fetchCarImage = async () => {
    if (!rcModel) {
      Alert.alert("Error", "RC Model is required to fetch the car image.");
      return;
    }

    try {
      const response = await axios.get(
        `http://13.203.66.17/search-car-image?carName=${rcModel}`
      );

      if (response.status === 200) {
        setImageUrl(response.data.imageUrl);
      } else {
        Alert.alert("Error", "Failed to fetch car image.");
      }
    } catch (error) {
      console.error("Error fetching car image:", error);
      Alert.alert("Error", "Failed to fetch car image from the server.");
    }
  };

  useEffect(() => {
    const getLocationNames = async () => {
      const originCoords = [origin.longitude, origin.latitude];
      const destinationCoords = [destination.longitude, destination.latitude];

      const originLocationName = await fetchLocationName(originCoords);
      const destinationLocationName = await fetchLocationName(
        destinationCoords
      );

      setOriginName(originLocationName);
      setDestinationName(destinationLocationName);
    };

    getLocationNames();
  }, [origin, destination]);

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
    console.log("Received parameters:", {
      origin,
      destination,
      totalCost,
      option,
      timeData,
      customDate,
    });
    const getName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("name");
        if (storedName !== null) {
          setName(storedName);
          console.log("Name retrieved from AsyncStorage:", storedName); // Log the name
        } else {
          console.log("No name found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error reading name from AsyncStorage", error);
      }
    };

    getName();
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

  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        // Set origin and destination based on route params
        const origin = {
          latitude: origin.latitude,
          longitude: origin.longitude,
        };

        const destination = {
          latitude: destination.latitude,
          longitude: destination.longitude,
        };

        // Set state for origin and destination
        setOrigin(origin);
        setDestination(destination);

        // Fetch route between origin and destination
        fetchRoute(origin, destination);
      } catch (err) {
        setError("Error fetching location");
        setLoading(false);
      }
    })();
  }, [origin, destination]);

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
      "sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ";
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
    setCommuteRegularly((prevState) => {
      const newValue = !prevState;
      console.log("commuteRegularly after toggle:", newValue); // Log the new value
      if (newValue) {
        setYesPopupVisible(true);
      }
      return newValue;
    });
  };

  const handleToggleModal = () => {
    setCommuteBackRegularly((prevState) => {
      const newValue = !prevState;
      console.log("commuteBackRegularly after toggle:", newValue); // Log the new value
      return newValue;
    });
  };

  const fetchLocationName = async (coordinates) => {
    const MAPBOX_TOKEN =
      "sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ";

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
          },
        }
      );

      // Extract street name from the response
      const features = response.data.features;
      if (features.length) {
        const place = features[0];
        const street = place.address || place.text; // Use address or text as a fallback
        return street || "Street name not found";
      }

      return "Location not found";
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Error fetching location";
    }
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

  // Continue from the existing code...
  const convert12hrTo24hrFormat = (time) => {
    // Check if the input time is in 12-hour format (e.g., "02:30 PM")
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let [_, hours, minutes, period] = match; // Extract hours, minutes, and AM/PM
      hours = parseInt(hours, 10);

      // Convert PM hours (except for 12 PM which remains the same)
      if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12; // Convert PM hours
      }
      // Convert 12 AM to 00
      else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0; // Convert 12 AM to 00
      }

      // Return the time in 24-hour format (HH:mm)
      return `${String(hours).padStart(2, "0")}:${minutes}`;
    } else {
      // If time is already in HH:mm format, just return it as is
      return time;
    }
  };
  const convertToISOFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleConfirmDetails = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const selectedTime = await AsyncStorage.getItem("selectedTime");

      if (!storedUserId) {
        throw new Error("User ID not found. Please log in again.");
      }

      let dataToSend = {};
      const formatLocation = (location) => ({
        longitude: location.longitude, // Longitude first
        latitude: location.latitude, // Latitude second
      });

      // Function to format time in HH:mm (24-hour format)
      const formatTo24hrTime = (time) => {
        const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
          let [_, hours, minutes, period] = match;
          hours = parseInt(hours, 10);
          // Convert PM hours (except for 12 PM which remains the same)
          if (period.toUpperCase() === "PM" && hours !== 12) {
            hours += 12; // Convert PM hours
          }
          // Convert 12 AM to 00
          else if (period.toUpperCase() === "AM" && hours === 12) {
            hours = 0; // Convert 12 AM to 00
          }
          // Return the time in 24-hour format (HH:mm)
          return `${String(hours).padStart(2, "0")}:${minutes}`;
        }
        return time; // Return as is if already in 24-hour format
      };

      if (commuteRegularly) {
        console.log("modalCommuteRegularly is true");

        if (!commuteBackRegularly) {
          console.log("commuteBackRegularly is false");

          dataToSend = {
            driver: {
              // 1. driver (nested object)
              name: driverName,
              userId: driverId,
            },
            from: formatLocation(origin), // 2. from (longitude, latitude)
            to: formatLocation(destination), // 3. to (longitude, latitude)
            shuttle: true, // 4. shuttle
            round_trip: false, // 5. round_trip
            available_seat: seatsAvailable, // 6. available_seat
            amount_per_seat: amountPerSeat, // 7. amount_per_seat
            dateDetails: {
              // 8. dateDetails
              start_date: convertToISOFormat(startDate),
              end_date: convertToISOFormat(endDate),
              time:
                option === "Later" ||
                option === "Custom Date" ||
                option === "Tomorrow"
                  ? route.params.formattedTime ||
                    formatTo24hrTime(formattedTime)
                  : formatTo24hrTime(formatTime(time)), // Convert time to 24-hour format
            },
          };
        } else {
          console.log("commuteBackRegularly is true");

          dataToSend = {
            driver: {
              // 1. driver (nested object)
              name: driverName,
              userId: driverId,
            },
            from: formatLocation(origin), // 2. from (longitude, latitude)
            to: formatLocation(destination), // 3. to (longitude, latitude)
            shuttle: true, // 4. shuttle
            round_trip: true, // 5. round_trip
            available_seat: seatsAvailable, // 6. available_seat
            amount_per_seat: amountPerSeat, // 7. amount_per_seat
            dateDetails: {
              // 8. dateDetails
              start_date: convertToISOFormat(startDate),
              end_date: convertToISOFormat(endDate),
              time:
                option === "Later" ||
                option === "Custom Date" ||
                option === "Tomorrow"
                  ? route.params.formattedTime ||
                    formatTo24hrTime(formattedTime)
                  : formatTo24hrTime(formatTime(time)),
              round_trip_time: formatTo24hrTime(time1), // Convert time for round trip to 24-hour format
            },
          };
        }
      } else {
        console.log("modalCommuteRegularly is false");

        dataToSend = {
          driver: {
            // 1. driver (nested object)
            name: driverName,
            userId: driverId,
          },
          from: formatLocation(origin), // 2. from (longitude, latitude)
          to: formatLocation(destination), // 3. to (longitude, latitude)
          shuttle: false, // 4. shuttle
          round_trip: false, // 5. round_trip
          available_seat: seatsAvailable, // 6. available_seat
          amount_per_seat: amountPerSeat, // 7. amount_per_seat
          dateDetails: {
            // 8. dateDetails
            date:
              option === "Tomorrow"
                ? new Date(
                    new Date().setDate(new Date().getDate() + 1)
                  ).toISOString()
                : option === "Custom Date"
                ? customDate.toISOString()
                : new Date().toISOString(),
            time:
              option === "Later" ||
              option === "Custom Date" ||
              option === "Tomorrow"
                ? route.params.formattedTime || formatTo24hrTime(formattedTime)
                : formatTo24hrTime(formatTime(time)), // Format the time
          },
        };
      }

      console.log("Data being sent:", JSON.stringify(dataToSend));

      // Sending the data to API
      const response = await axios.post(
        "http://13.203.66.17/create-ride",
        dataToSend
      );
      console.log("Response:", response.data);

      let rideId = null;
      if (!commuteRegularly) {
        rideId = response.data.rideId; // Assuming the response contains rideId
      }

      setYesPopupVisible(false);

      // Navigate to success screen and pass originName and destinationName
      navigation.navigate("RideSuccessful", {
        availableSeats: seatsAvailable,
        amountPerSeat,
        currentDateTime: new Date().toISOString(),
        rideId: rideId,
        originName: originName, // Pass originName
        destinationName: destinationName, // Pass destinationName
      });
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

  // Set selectedTime to option when it is received for all the time other than "Now"

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
      {origin && destination ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta:
              Math.abs(origin.latitude - destination.latitude) * 1.5,
            longitudeDelta:
              Math.abs(origin.longitude - destination.longitude) * 1.5,
          }}
        >
          <Marker
            coordinate={origin}
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

          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeWidth={5}
              strokeColor="blue" // Changed to blue for better visibility
            />
          )}
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
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
              <Text style={styles.userName}>{driverName}</Text>
              <View style={styles.menuOptions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
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
                  onPress={() => navigation.navigate("DriverWelcome")}
                >
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
            <Image source={{ uri: profilePic }} style={styles.driverAvatar} />
            <View>
              <Text style={styles.driverName}>
                {carRegNumber} (
                {selectedTime === "Now"
                  ? option && option !== "Now"
                    ? option
                    : "Now"
                  : selectedTime}
                )
              </Text>

              <View style={styles.locationContainer}>
                <Image
                  source={require("../assets/from_icon.png")}
                  style={styles.icon}
                />
                <Text style={styles.driverLocation}>{originName}</Text>
              </View>
              <View style={styles.locationContainer}>
                <Image
                  source={require("../assets/to_icon.png")}
                  style={styles.icon}
                />
                <Text style={styles.driverLocation}>{destinationName}</Text>
              </View>
            </View>
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
              <Text style={styles.detailsValue}>₹{amountPerSeat}</Text>
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
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                style={styles.datePickerContainer}
              >
                <Image source={clockicon} style={styles.icon_clock} />
                <Text style={styles.selectedWeekText1}>
                  {`${formatDate(startDate)}`}
                  {"\n"}
                </Text>
                <Image source={dropdownicon} style={styles.icon_dropdown} />
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
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={styles.datePickerContainer}
              >
                <Image source={clockicon} style={styles.icon_clock} />

                <Text style={styles.selectedWeekText1}>
                  {`${formatDate(endDate)}`}
                  {"\n"}
                </Text>
                <Image source={dropdownicon} style={styles.icon_dropdown} />
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
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.datePickerContainer}
              >
                <Image source={clockicon} style={styles.icon_clock} />

                <Text style={styles.selectedTimeText1}>
                  {selectedTime || "Select a time"}
                </Text>
                <Image source={dropdownicon} style={styles.icon_dropdown} />
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
              <View style={styles.detailsRow}>
                <Text
                  style={[
                    styles.detailsLabel1,
                    { marginTop: 18 },
                    { marginBottom: 18 },
                    { marginLeft: 1 },
                  ]}
                >
                  Do you make the commute back from the same destination
                  regularly?
                </Text>
                <TouchableOpacity
                  style={styles.toggleContainer}
                  onPress={handleToggleModal}
                >
                  <View
                    style={
                      commuteBackRegularly
                        ? styles.yes_ovalShape
                        : styles.ovalShape
                    }
                  >
                    <View style={styles.textContainer}>
                      <View style={styles.textContainer}>
                        <Text style={styles.toggleText}>
                          {commuteBackRegularly ? "Yes" : ""}
                        </Text>
                        <Text style={styles.toggleText}>
                          {commuteBackRegularly ? "" : "No"}
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
                              translateX: commuteBackRegularly ? 30 : 0, // Move the toggle
                            },
                          ],
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {commuteBackRegularly && (
                <>
                  <Text style={styles.selectLabel}>Select Date Range</Text>

                  {/* Date Range Display when Toggle is Yes */}
                  <View style={styles.dateRangeContainer}>
                    <Image
                      source={require("../assets/clock.png")}
                      style={styles.icon_clock}
                    />
                    <Text style={styles.dateRangeText1}>
                      {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                    </Text>
                  </View>

                  <Text style={styles.selectLabel1}>Select Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={styles.dateTimeContainer}
                  >
                    <Image source={clockicon} style={styles.icon_clock} />

                    <Text style={styles.selectedTimeText1}>
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
                <Text style={styles.closeButtonText}>
                  Yes! Make It A Shuttle
                </Text>
              </TouchableOpacity>
            </View>

            {/* Toggle for Commute Regularly */}

            {/* Show additional options only if commuteRegularly is true */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    height: 50,
    width: "95%",
    backgroundColor: "#ffffff", // Background color
    borderRadius: 7, // Rounded corners
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    height: 50,
    width: "95%",
    backgroundColor: "#ffffff", // Background color
    borderRadius: 7, // Rounded corners
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  icon_dropdown: {
    width: 16, // Adjust size as needed
    height: 16,
    marginLeft: 180,
  },
  icon_clock: {
    width: 20, // Adjust size as needed
    height: 20,
    marginLeft: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    height: 50,
    width: "95%",
    backgroundColor: "#ffffff", // Background color
    borderRadius: 7, // Rounded corners
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "#7C7C7C",
    alignSelf: "flex-start", // Left align the text
  },

  selectedWeekText1: {
    paddingRight: 150,
    color: "#000000",
    paddingBottom: 7,
    marginTop: 10,
    marginLeft: 5,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "poppins",
    fontSize: 16,
  },

  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    height: 50,
    width: "95%",
    backgroundColor: "#ffffff", // Background color
    borderRadius: 7, // Rounded corners
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  yes_ovalShape: {
    backgroundColor: "#000000",
    borderRadius: 25,
    height: 30,
    width: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  icon: {
    width: 10, // Set your desired width
    height: 10, // Set your desired height
    marginRight: 5, // Space between icon and text
  },
  driverLocation: {
    fontSize: 16, // Adjust as needed
  },
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
    width: "100%",
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

  dateRangeText1: {
    paddingRight: 140,
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

  horizontalRuler: {
    width: "100%",
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
  selectedTimeText1: {
    color: "#000000",
    marginHorizontal: 15,
    textAlign: "center",
    marginTop: 3,
    marginLeft: 20,
  },
  dateRangeText1: {
    paddingRight: 40,
    marginLeft: 10,
  },
});

export default MapScreen;
