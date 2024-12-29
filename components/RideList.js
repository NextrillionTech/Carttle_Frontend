import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Animated,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import TravelerBottomNavBottomNav from "./TravelerBottomNav"; // Ensure BottomNav is correctly imported
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";

function fetchFonts() {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
}

const RideList = ({ route }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("rides");
  const [TravelerUserId, setTravelerUserId] = useState(null);
  const [TravelerUserName, setTravelerUserName] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const {
    destination,
    origin,
    option,
    currdate,
    currtime,
    customDate,
    time,
    date,
    formattedTime,
    selectedTime,
  } = route.params;

  const [activeFilters, setActiveFilters] = useState({
    rideTime: "Ride Time",
    distance: "Distance",
    availableSeats: "Available Seats",
    gender: "Gender", // Set default value for Gender
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [activeFilter, setActiveFilter] = useState("rideTime");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Retrieve user ID and name from AsyncStorage
        const storedTravelerUserId = await AsyncStorage.getItem(
          "TraveleruserId"
        );
        const storedTravelerUserName = await AsyncStorage.getItem(
          "TraveleruserName"
        );
        if (storedTravelerUserId && storedTravelerUserName) {
          setTravelerUserId(storedTravelerUserId); // Correctly set TravelerUserId
          setTravelerUserName(storedTravelerUserName); // Correctly set TravelerUserName
        } else {
          console.log("User data not found");
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  const convertToISOFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  let finalDate =
    option === "Custom Date" ? customDate : currdate ? currdate : date;

  let finalTime =
    option === "Custom Date"
      ? formattedTime
      : option === "Later"
      ? formattedTime
      : currtime
      ? currtime
      : time;
  if (customDate) {
    finalDate = customDate;
  }
  if (customDate && formattedTime) {
    finalTime = formattedTime;
  }

  useEffect(() => {
    let updatedOption = option;

    // Check if the option starts with "Custom Date"
    if (option && option.startsWith("Custom Date")) {
      updatedOption = "Custom Date";
    }

    console.log("Received data:", {
      destination,
      origin,
      option: updatedOption, // Assign the updated option here
      currdate,
      currtime,
      finalDate,
      customDate,
      finalTime,
      time,
    });

    // Set the value of the first filter as the option value
    if (updatedOption) {
      setActiveFilters((prevState) => ({
        ...prevState,
        rideTime: updatedOption, // Update "rideTime" with the value of option
      }));
    }
  }, [route.params]);

  const filters = [
    {
      label: activeFilters.rideTime, // Set dynamic value based on state
      value: "rideTime",
      icon: require("../assets/clock.png"),
    },
    {
      label: "Distance",
      value: "distance",
      icon: require("../assets/loc.png"),
    },
    {
      label: "Available Seats",
      value: "availableSeats",
      icon: require("../assets/seat_icon.png"),
    },
    { label: "Gender", value: "gender", icon: require("../assets/gender.png") },
  ];

  const dropdownValues = {
    rideTime: ["Now", "Later", "Tomorrow", "Custom Date"],
    distance: ["250m", "500m", "750m", "1km"],
    availableSeats: ["1 Seat", "2 Seats", "3 Seats"],
    gender: ["Male", "Female", "Others"],
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

  const handleFilterPress = (filter, event) => {
    setActiveFilter(filter);
    setDropdownOptions(dropdownValues[filter]);
    const { pageX, pageY } = event.nativeEvent;
    setDropdownPosition({ x: pageX, y: pageY });
    setShowDropdown(true);
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

  const handleRequestPress = () => {
    navigation.navigate("TravellerBooking");
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      navigation.navigate("TravellerHomeScreen");
    } else if (tab === "rides") {
      navigation.navigate("TripHistory");
    } else if (tab === "message") {
      navigation.navigate("MessageScreen");
    }
  };

  const openMenu = () => {
    console.log("Menu opened");
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      const formatted = date.toLocaleDateString(); // Format the selected date
      setFormattedDate(formatted); // Store the formatted date
      setActiveFilters((prev) => ({ ...prev, rideTime: formatted })); // Update the ride time filter
    }
    setShowCalendar(false);
    setShowDropdown(false);
  };

  const openCalendar = () => {
    setShowCalendar(true);
  };

  const handleDropdownSelect = (selectedOption) => {
    if (selectedOption === "Custom Date") {
      openCalendar();
    } else {
      // Update the specific active filter based on the selection
      setActiveFilters((prev) => ({ ...prev, [activeFilter]: selectedOption }));
      setShowDropdown(false);

      // Update the "option" field in the route.params
      route.params.option = selectedOption;
      console.log("Updated option:", selectedOption); // Log the updated option for debugging
    }
  };

  const formatTimeToHHMM = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };
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

  const fetchRides = async () => {
    try {
      const availableSeats =
        activeFilters.availableSeats === "1 Seat"
          ? 1
          : activeFilters.availableSeats === "2 Seats"
          ? 2
          : activeFilters.availableSeats === "3 Seats"
          ? 3
          : 1; // Default to 1 Seats if no selection

      // Format the ride date to DD-MM-YYYY
      const send_date = convertToISOFormat(finalDate);
      // Format the time to HH:mm
      const formattedCurrentTime = formatTimeToHHMM(new Date());

      const rideTime =
        option === "Now"
          ? formattedCurrentTime
          : convert12hrTo24hrFormat(formattedTime) ||
            convert12hrTo24hrFormat(selectedTime) ||
            formattedCurrentTime;

      const finalTime = rideTime;
      const requestBody = {
        currentLocation: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
        to: {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
        dateDetails: {
          date: send_date, // Pass formatted date in DD-MM-YYYY format
          time: finalTime, // Pass time in HH:mm format
        },
        available_seat: availableSeats, // Use dynamic availableSeats here
      };

      // Log the data being sent to the backend
      console.log(
        "Sending data to backend:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch("http://192.168.29.99:3000/rides/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Fetched rides:", data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  useEffect(() => {
    // Fetch rides when the filters change
    fetchRides();
  }, [
    formattedDate,
    activeFilters.rideTime,
    activeFilters.distance,
    activeFilters.availableSeats,
    activeFilters.gender,
  ]);

  const RideItem = ({ ride }) => {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={require("../assets/nav_icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={openNotifications}>
            <Image
              source={require("../assets/Bell_icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Rides For You</Text>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                activeFilters[filter.value] === filter.label &&
                  styles.activeFilterButton,
              ]}
              onPress={(e) => handleFilterPress(filter.value, e)}
            >
              <Image source={filter.icon} style={styles.filterIcon} />
              <Text
                style={[
                  styles.filterText,
                  activeFilters[filter.value] === filter.label &&
                    styles.activeFilterText,
                ]}
              >
                {activeFilters[filter.value]}{" "}
                {/* Show the selected filter text */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dropdown */}
        {showDropdown && (
          <View
            style={[
              styles.dropdownContainer,
              { top: dropdownPosition.y + 10, left: dropdownPosition.x - 50 },
            ]}
          >
            {dropdownOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleDropdownSelect(option)}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Calendar Modal */}
        {showCalendar && (
          <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.calendarContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleDateChange}
                />
              </View>
            </View>
          </Modal>
        )}

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
          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleRequestPress}
          >
            <Text style={styles.requestButtonText}>Request Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../assets/nav_icon.png")}
            style={styles.icon}
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
                <Text style={styles.userName}>{TravelerUserName}</Text>
                <View style={styles.menuOptions}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("TravelerProfile")}
                  >
                    <Text style={styles.menuOptionText}>Profile</Text>
                    <View style={styles.horizontalRuler2} />
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
                  <TouchableOpacity
                    onPress={() => navigation.navigate("TravellerLogin")}
                  >
                    <Text style={styles.menuOptionText}>Sign Out</Text>
                    <View style={styles.horizontalRuler2} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        <TouchableOpacity onPress={openNotifications}>
          <Image
            source={require("../assets/Bell_icon.png")}
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
        <TravelerBottomNav activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here...
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 29,
    fontFamily: "poppins",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#EDEDED",
    borderRadius: 20,
    marginRight: 8,
    marginTop: 35,
  },
  activeFilterButton: {
    backgroundColor: "#000",
  },
  filterText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "poppins",
    marginLeft: 8,
  },
  activeFilterText: {
    color: "#fff",
    fontFamily: "poppins",
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    marginBottom: 15,
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
  dropdownContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  dropdownText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "poppins",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 11,
    marginHorizontal: 5,
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
});

export default RideList;
