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
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
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

const HomeScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showRadioButtons, setShowRadioButtons] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Now");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [placeName, setPlaceName] = useState("Fetching current location...");
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen

  const openNotifications = () => {
    // Navigate to the Notifications screen
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
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const place = response.data.features[0]?.place_name || "Unknown location";
      setPlaceName(place);
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

  const selectTime = (time) => {
    setSelectedTime(time);
    setShowRadioButtons(false);
  };

  const openSearchModal = () => {
    setModalVisible(true);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
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

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.place_name);
    setModalVisible(false);

    navigation.navigate("MapScreen", {
      destination: {
        latitude: suggestion.geometry.coordinates[1],
        longitude: suggestion.geometry.coordinates[0],
        placeName: suggestion.place_name,
      },
      userLocation,
    });
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
              <Text style={styles.userEmail}>naina****@gmail.com</Text>
              <View style={styles.menuOptions}>
                <TouchableOpacity>
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
                <TouchableOpacity>
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
            <Text style={styles.optionText}>{selectedTime}</Text>
            <Image
              source={require("../assets/dropdown.png")}
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButtonLarge}>
            <Image
              source={require("../assets/current_location.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Current Location</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.destinationButton}
          onPress={openSearchModal}
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
              <Image
                source={require("../assets/loc.png")}
                style={styles.searchIcon}
              />
              <Text style={styles.currentLocationText}>{placeName}</Text>
            </View>

            <View style={styles.searchContainer}>
              <Image
                source={require("../assets/loc.png")}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a place"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(item)}
                >
                  <Text style={styles.suggestionText}>{item.place_name}</Text>
                </TouchableOpacity>
              )}
            />
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
    top: "55%",
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
    marginTop: 10,
    marginBottom: 10,
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
    flexDirection: "row",
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
    marginRight: 5,
  },
  optionButtonLarge: {
    flexDirection: "row",
    flex: 1.2,
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    padding: 5,
    borderRadius: 10,
    width: 150,
    marginLeft: 5,
  },
  optionIcon: {
    width: "14%",
    height: "14%",
    marginRight: 10,
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "poppins",
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
});

export default HomeScreen;
