import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import BottomNav from "./BottomNav";
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const MAPBOX_ACCESS_TOKEN =
  "sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ";
const MAPBOX_TILE_URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

const SelectTimeScreen = ({ navigation, route }) => {
  const [selectedTimeState, setSelectedTimeState] = useState("Select Time"); // Set it in state
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showRadioButtons, setShowRadioButtons] = useState(false);
  const [modalSecondVisible, setModalSecondVisible] = useState(false); //MODAL FOR SELECTING SCREEN FOR current ORIGIN AND DEST
  const [currentAddress, setCurrentAddress] = useState("Fetching address...");
  const [currentLocLatitude, setCurrentLocLatitude] = useState(null);
  const [currentLocLongitude, setCurrentLocLongitude] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [setSelectedTime] = useState("Now");
  const [searchQuery1, setSearchQuery1] = useState("");
  const { selectedTime } = route.params;
  const [searchQuery2, setSearchQuery2] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [placeName, setPlaceName] = useState("Fetching current location...");
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen
  const [stateName, setStateName] = useState(""); // Use state instead of a simple variable
  const [time, setTime] = useState("Select Time");
  const [originCoordinates, setOriginCoordinates] = useState(null); // Add this to track the origin

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [chosenTime, setChosenTime] = useState(new Date());

  const [formattedTime, setFormattedTime] = useState("");

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [customDate, setCustomDate] = useState(null);

  useEffect(() => {
    if (modalSecondVisible && userLocation) {
      fetchCurrentAddress();
    }
  }, [modalSecondVisible]);

  const openSecondSearchModal = () => {
    setModalSecondVisible(true);
  };
  const fetchCurrentAddress = async () => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation.longitude},${userLocation.latitude}.json?access_token=sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ`
      );
      const address =
        response.data.features[0]?.place_name || "Unable to fetch address";

      // Store the latitude and longitude as currentLocLatitude and currentLocLongitude
      setCurrentLocLatitude(userLocation.latitude);
      setCurrentLocLongitude(userLocation.longitude);

      setCurrentAddress(address);
    } catch (error) {
      console.error("Error fetching current location address:", error.message);
      setCurrentAddress("Unable to fetch address");
    }
  };

  const handleTimeChange = (event, time) => {
    const currentTime = time || chosenTime;
    setIsTimePickerVisible(false);
    setChosenTime(currentTime);
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formatted = `${(((hours + 11) % 12) + 1)
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setFormattedTime(formatted); // Update the formatted time state
  };

  const formatStateName = (contextArray) => {
    const stateInfo = contextArray.find((context) =>
      context.id.includes("region")
    );
    return stateInfo ? stateInfo.text.replace(/\s+/g, "-") : "unknown-state";
  };

  const openNotifications = () => {
    navigation.navigate("NotificationScreen");
  };

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

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

  const generateFutureTimes = () => {
    const times = [];
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30 - (now.getMinutes() % 30)); // Round to the nearest future half-hour
    for (let i = 0; i < 48; i++) {
      // Generate up to 24 hours (48 half-hour intervals)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = ((hours + 11) % 12) + 1; // Convert to 12-hour format
      const formattedMinutes = minutes.toString().padStart(2, "0");
      times.push(`${formattedHours}:${formattedMinutes} ${period}`);
      now.setMinutes(now.getMinutes() + 30); // Increment by 30 minutes
    }
    return times;
  };

  const timeOptions = generateFutureTimes();

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300, // Slide out to the left
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Permission Denied",
          "Allow Carttle to access your location."
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setUserLocation({ latitude, longitude });
        reverseGeocodeLocation(latitude, longitude);
      } catch (error) {
        setErrorMsg("Error while fetching location");
        console.log(error);
      }
    })();
  }, []);

  const reverseGeocodeLocation = async (latitude, longitude) => {
    setPlaceName("Fetching current location..."); // Set initial loading message

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const features = response.data.features;
      if (features.length > 0) {
        const place = features[0];
        const placeName = place.place_name || "Unknown location";
        setPlaceName(placeName); // Set the actual location name

        const context = place.context || [];
        const stateInfo = context.find((ctx) => ctx.id.includes("region"));
        let state = stateInfo ? stateInfo.text : "Unknown State";

        // Format the state name: lowercase and replace spaces with hyphens
        state = state.toLowerCase().replace(/\s+/g, "-");
        setStateName(state); // Set the formatted state name

        // Log statements for debugging
        console.log("State Name:", state);
      } else {
        setPlaceName("Unknown location");
      }
    } catch (error) {
      console.error("Error reverse geocoding location:", error);
      setPlaceName("Unknown location");
    }
  };

  const openTimeSelection = (event) => {
    event.target.measure((fx, fy, width, height, px, py) => {
      setDropdownPosition({ x: 20, y: 670 });
      setShowRadioButtons(true);
    });
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

  const openSearchModal = () => {
    setModalVisible(true);
  };

  const handleSearch1 = async (query) => {
    setSearchQuery1(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_ACCESS_TOKEN}&proximity=${userLocation.longitude},${userLocation.latitude}&limit=5`
        );

        const fetchedSuggestions = response.data.features || [];

        // Only add current location if it's been successfully fetched
        const currentLocationSuggestion =
          placeName && placeName !== "Fetching current location..."
            ? [
                {
                  id: "current-location", // Unique identifier
                  place_name: `Current Location: ${placeName}`,
                  geometry: {
                    coordinates: [
                      userLocation.longitude,
                      userLocation.latitude,
                    ],
                  },
                },
              ]
            : [];

        setSuggestions([...currentLocationSuggestion, ...fetchedSuggestions]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch2 = async (query) => {
    setSearchQuery2(query);
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_ACCESS_TOKEN}&proximity=${userLocation.longitude},${userLocation.latitude}&limit=5`
        );
        setSuggestions(response.data.features || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const renderRadioButton = (time) => (
    <TouchableOpacity
      onPress={() => selectTime(time)}
      style={styles.radioButtonContainer}
    >
      <View style={styles.radioButton}>
        {selectedTime === time && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioButtonLabel}>{time}</Text>
    </TouchableOpacity>
  );

  const handleDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString("en-GB"); // Format DD/MM/YYYY
      setCustomDate(formatted);
      setSelectedTimeState(`Custom Date: ${formatted}`);
      setShowRadioButtons(false);
      console.log("Selected Date:", formatted);
    }
  };
  useEffect(() => {
    if (route.params?.selectedTime) {
      setSelectedTimeState(route.params.selectedTime);
    }
  }, [route.params]);

  const selectTime = async (option) => {
    if (option === "Now") {
      navigation.navigate("HomeScreen", { selectedTime: (option = "Now") });
    } else {
      if (option === "Custom Date") {
        setIsDatePickerVisible(true);
        setShowRadioButtons(false);
      }

      setSelectedTimeState(option);
      try {
        await AsyncStorage.setItem("selectedTimeOption", option);
        console.log("Stored in AsyncStorage:", option);
      } catch (error) {
        console.error("Failed to store time:", error);
      }
    }
  };
  const selectSuggestion = async (suggestion, isOriginBoxActive) => {
    const destinationCoordinates = {
      latitude: suggestion.geometry.coordinates[1],
      longitude: suggestion.geometry.coordinates[0],
    };

    if (isOriginBoxActive) {
      setSearchQuery1(suggestion.place_name); // Update origin search query
      setOriginCoordinates(destinationCoordinates); // Set the origin coordinates
      console.log("Origin Selected:", suggestion.place_name);

      await AsyncStorage.setItem("originName", suggestion.place_name);
    } else {
      setSearchQuery2(suggestion.place_name); // Update destination search query
      setDestinationCoordinates(destinationCoordinates); // Set the destination coordinates

      console.log("Destination Selected:", suggestion.place_name); // Log destination
      await AsyncStorage.setItem("destinationName", suggestion.place_name);
    }

    // Check if both origin and destination are selected
    if (searchQuery1 && searchQuery2) {
      setModalVisible(false); // Close the modal only after both locations are selected

      const data = {
        origin: `${userLocation.latitude},${userLocation.longitude}`,
        destination: `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`,
        state: stateName, // Ensure this is set correctly
      };

      console.log("State Name:", stateName);

      try {
        // Call the distance matrix API
        const response = await axios.post(
          "http://192.168.29.99:3000/distanceMatrix",
          data
        );
        console.log("Distance:", response.data.distance);

        // Call the cost calculator API
        const costResponse = await axios.post(
          "http://192.168.29.99:3000/calculate-cost",
          {
            state: stateName,
            origin: `${userLocation.latitude},${userLocation.longitude}`,
            destination: `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`,
          }
        );

        console.log("Fuel Price:", costResponse.data.fuelPrice);
        console.log("Total Distance:", costResponse.data.distance);
        console.log("Total Cost:", costResponse.data.totalCost);

        let timeData = {};

        const formatDate = (date) => {
          const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits, months are 0-indexed
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Return in 'DD MM YYYY' format
        };

        if (selectedTimeState === "Later" && formattedTime) {
          // For "Later", send today's date and selected time
          const today = new Date();
          const todayFormatted = formatDate(today); // Format as 'DD MM YYYY'

          timeData = {
            selectedTime: selectedTimeState,
            formattedTime, // Selected time
            date: todayFormatted, // Today's date
          };
        } else if (selectedTimeState === "Tomorrow") {
          // For "Tomorrow", send tomorrow's date and selected time
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowFormatted = formatDate(tomorrow); // Format as 'DD MM YYYY'

          timeData = {
            selectedTime: selectedTimeState,
            formattedTime, // Selected time
            date: tomorrowFormatted, // Tomorrow's date
          };
        } else if (selectedTimeState.startsWith("Custom Date")) {
          // For "Custom Date", send selected custom date and selected time
          const customDateFormatted = formatDate(new Date(customDate)); // Format custom date as 'DD MM YYYY'

          timeData = {
            selectedTime: selectedTimeState,
            formattedTime, // Selected time
            date: customDateFormatted, // Custom date selected
          };
        } else if (selectedTimeState.startsWith("Custom Date") && !customDate) {
          console.warn("Custom Date is not set");
          Alert.alert("Error", "Please select a custom date.");
        }

        navigation.navigate("MapScreen", {
          destination: destinationCoordinates,
          origin: originCoordinates,
          distance: response.data.distance,
          totalCost: costResponse.data.totalCost,
          ...timeData,
          option: selectedTimeState,
          customDate: customDate,
        });

        console.log("Data sent to MapScreen:", {
          destination: destinationCoordinates,
          origin: originCoordinates,
          distance: costResponse.data.distance,
          totalCost: costResponse.data.totalCost,
          ...timeData,
          option: selectedTimeState,
          customDate: customDate,
        });
      } catch (error) {
        console.error(
          "Error sending data to backend:",
          error.response ? error.response.data : error.message
        );
        Alert.alert(
          "Error",
          "Could not calculate distance and cost, please try again."
        );
      }
    }
  };
  const selectSuggestion2 = async (suggestion) => {
    const destinationCoordinates = {
      latitude: suggestion.geometry.coordinates[1],
      longitude: suggestion.geometry.coordinates[0],
    };

    // Update the destination search query and coordinates
    setSearchQuery2(suggestion.place_name); // Update destination search query
    setDestinationCoordinates(destinationCoordinates); // Set the destination coordinates

    console.log("Destination Selected:", suggestion.place_name); // Log destination
    await AsyncStorage.setItem("destinationName", suggestion.place_name);

    // Close the modal and proceed only if destination is selected
    setModalSecondVisible(false);

    const data = {
      origin: `${currentLocLatitude},${currentLocLongitude}`, // Origin from current location variables
      destination: `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`,
      state: stateName, // Ensure this is set correctly
    };

    console.log("State Name:", stateName);

    try {
      // Call the distance matrix API
      const response = await axios.post(
        "http://192.168.29.99:3000/distanceMatrix",
        data
      );
      console.log("Distance:", response.data.distance);

      // Call the cost calculator API
      const costResponse = await axios.post(
        "http://192.168.29.99:3000/calculate-cost",
        {
          state: stateName,
          origin: `${currentLocLatitude},${currentLocLongitude}`, // Use origin from current location variables
          destination: `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`,
        }
      );

      console.log("Fuel Price:", costResponse.data.fuelPrice);
      console.log("Total Distance:", costResponse.data.distance);
      console.log("Total Cost:", costResponse.data.totalCost);

      // Navigate to MapScreen with the required data
      navigation.navigate("MapScreen", {
        destination: destinationCoordinates,
        origin: {
          latitude: currentLocLatitude,
          longitude: currentLocLongitude,
        },
        distance: response.data.distance,
        totalCost: costResponse.data.totalCost,
      });
      console.log("Data sent to MapScreen:", {
        destination: destinationCoordinates,
        origin: {
          latitude: currentLocLatitude,
          longitude: currentLocLongitude,
        },
        distance: costResponse.data.distance,
        totalCost: costResponse.data.totalCost,
      });
    } catch (error) {
      console.error(
        "Error sending data to backend:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        "Could not calculate distance and cost, please try again."
      );
    }
  };
  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <UrlTile urlTemplate={MAPBOX_TILE_URL} maximumZ={19} flipY={false} />
        {userLocation && (
          <Marker coordinate={userLocation} title="You are here">
            <Image
              source={require("../assets/location_icon.png")}
              style={styles.markerIcon}
            />
          </Marker>
        )}
      </MapView>

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
                <TouchableOpacity>
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
      <Image
        source={require("../assets/locateMe_icon.png")}
        style={[styles.icon, styles.locationIcon]}
      />

      <View style={styles.overlayContainer}>
        <Text style={styles.heading}>Where To Take Next?</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.heading1}>Select Time and Location</Text>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={openTimeSelection}
          >
            <Image
              source={require("../assets/clock.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{selectedTimeState}</Text>
            <Image
              source={require("../assets/dropdown.png")}
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsTimePickerVisible(true)} // Show the DateTimePicker
          >
            <Image
              source={require("../assets/clock.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>
              {formattedTime || "Select Time"}
            </Text>
            <Image
              source={require("../assets/dropdown.png")}
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButtonLarge}
            onPress={openSearchModal}
          >
            <Image
              source={require("../assets/current_location.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Current Location</Text>
          </TouchableOpacity>
          {isTimePickerVisible && (
            <DateTimePicker
              value={chosenTime}
              mode="time"
              is24Hour={false} // Use 12 hours format
              display="default"
              onChange={handleTimeChange}
            />
          )}
          {isDatePickerVisible && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </View>
          )}

          {/* Display Selected Custom Date */}
          {customDate && <View style={styles.customDateBox}></View>}
        </View>
        <TouchableOpacity
          style={styles.destinationButton}
          onPress={openSecondSearchModal}
        >
          <Image
            source={require("../assets/loc.png")}
            style={styles.destinationIcon}
          />
          <Text style={styles.destinationText}>Select Destination</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
      </View>

      {showRadioButtons && dropdownPosition && (
        <View
          style={[
            styles.radioButtonsContainer,
            { top: dropdownPosition.y, left: dropdownPosition.x },
          ]}
        >
          {renderRadioButton("Now")}
          {renderRadioButton("Later")}
          {renderRadioButton("Tomorrow")}
          {renderRadioButton("Custom Date", () => {
            setIsDatePickerVisible(true);
          })}
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false); // Close the modal on outside touch
            Keyboard.dismiss(); // Dismiss the keyboard if it's open
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.horizontalRuler1} />
            <Text style={styles.heading}>Select address</Text>
            <View style={styles.horizontalRuler} />

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Select Location"
                value={searchQuery1}
                onChangeText={(query) => handleSearch1(query, true)} // true for origin
              />
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Select Destination"
                value={searchQuery2}
                onChangeText={(query) => handleSearch2(query, false)} // false for destination
              />
            </View>

            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    // Check if the first or second search box is active and update accordingly
                    const isOriginBoxActive = searchQuery1.length > 0;
                    selectSuggestion(item, isOriginBoxActive); // Pass true for the origin box and false for destination
                  }}
                >
                  <Text style={styles.suggestionText}>{item.place_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={modalSecondVisible}
        animationType="slide"
        transparent={true}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalSecondVisible(false); // Close the modal on outside touch
            Keyboard.dismiss(); // Dismiss the keyboard if it's open
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.horizontalRuler1} />
            <Text style={styles.heading}>Select address</Text>
            <View style={styles.horizontalRuler} />

            {/* Display Current Address in First Input Box */}
            <View style={styles.searchContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 13,
                    fontFamily: "poppins",
                  }}
                >
                  {currentAddress}
                </Text>
              </ScrollView>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Select Destination"
                value={searchQuery2}
                onChangeText={(query) => handleSearch2(query)} // Fetch suggestions dynamically
              />
            </View>

            {/* Suggestions for Destination */}
            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id || item.place_name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => selectSuggestion2(item)}
                  >
                    <Text style={styles.suggestionText}>{item.place_name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noSuggestionsText}>
                No suggestions available.
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const RadioButton = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      <View
        style={[
          styles.radioButtonOuter,
          selected && styles.radioButtonSelectedOuter,
        ]}
      >
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,

    backgroundColor: "white",
  },
  modalContainer: {
    flex: 1,
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 }, // Moves shadow to top
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontFamily: "poppins",
  },
  markerIcon: {
    width: 80,
    height: 80,
    position: "relative",
  },
  icon: {
    position: "relative",
    width: 40,
    height: 40,
  },
  menuIcon: {
    position: "relative",
    bottom: "750%",
    margintop: 78,
    right: 160,
  },
  notificationIcon: {
    position: "relative",
    bottom: "890%",
    margintop: 2,
    left: 160,
  },
  locationIcon: {
    top: "52%",
    position: "absolute",

    right: 10,
    flex: 1,
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

  overlayContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    fontFamily: "poppins",
  },
  heading: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "poppins",
  },
  heading1: {
    fontSize: 15,
    fontFamily: "poppins",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
  },
  horizontalLine: {
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  horizontalRuler1: {
    borderBottomWidth: 3,
    borderBottomColor: "#808080",
    width: "32%",
    alignContent: "center",
    alignSelf: "center",
    left: 1,
    top: 10,
  },

  selectionContainer: {
    justifyContent: "space-between",
    marginTop: 10,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    padding: 10,
    borderRadius: 10,
    height: 50,
    marginBottom: 5,
  },
  optionButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 50,
    fontFamily: "poppins",
  },
  optionIcon: {
    width: "5%",
    height: "5%",
    marginRight: 10,
    padding: 10,
  },
  optionIcon1: {
    width: "4%",
    height: "3%",
    marginRight: 10,
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "poppins",
    marginLeft: 17,
  },
  dropdownIcon: {
    width: 30,
    height: 15,
    marginLeft: "auto",
  },
  destinationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    fontFamily: "poppins",
  },
  destinationIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  destinationText: {
    fontSize: 16,
    color: "black",
    marginLeft: 17,
    fontFamily: "poppins",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  radioButtonsContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#d3d3d3",
    padding: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioButtonSelectedOuter: {
    borderColor: "#007AFF",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  radioButtonLabel: {
    fontSize: 16,
    fontFamily: "poppins",
  },

  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
  },
  currentLocationText: {
    fontSize: 14,
    fontFamily: "poppins",
    marginLeft: 10,
    marginRight: 20,
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#808080",
    borderWidth: 5,
    marginTop: 25,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  searchIcon: {
    width: 20,
    height: 20,
    flexDirection: "row",
  },
  searchInput: {
    fontSize: 14,
    fontFamily: "poppins",
    marginLeft: 10,
    marginRight: 20,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: "poppins",
  },

  searchContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderWidth: 2, // Increase the border width for a thicker line
    borderRadius: 15,
    borderColor: "#ececec", // Change the color of the border if needed
    borderRadius: 10, // Optional: to give rounded corners
    elevation: 5,
    flexDirection: "row", // Align children horizontally
    alignItems: "center", // Center children vertically
  },
  searchInput: {
    fontSize: 14,
    fontFamily: "poppins",
    marginLeft: 10,
    flex: 1, // Allow the input to take up available space
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#000000",
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: "poppins",
  },
  radioButtonsContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    fontFamily: "poppins",
    elevation: 5,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    fontFamily: "poppins",
  },
  radioButtonCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    backgroundColor: "white",
  },
  dropdownIcon: {
    width: 12,
    height: 12,
    position: "absolute",
    right: 10,
  },
  timeSelector: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  radioButtonsContainer: {
    position: "absolute",
    backgroundColor: "white",
    fontFamily: "poppins",
    padding: 10,
    borderRadius: 5,
    width: 100,
    elevation: 5,
    minWidth: 150,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "black",
  },
  radioButtonLabel: {
    fontFamily: "poppins",

    fontSize: 16,
  },
  radioButtonText: {
    fontSize: 16,
  },
  horizontalRuler: {
    width: "100%", // Adjust this to control the width of the ruler
    height: 1,
    backgroundColor: "#d3d3d3", // Grey color
    alignSelf: "center", // Center align the ruler
    marginVertical: 10, // Optional: Adjust vertical spacing
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
  pickerContainer: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: "100%",
    fontFamily: "poppins",
  },
});

export default SelectTimeScreen;
