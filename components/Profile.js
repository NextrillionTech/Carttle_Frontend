import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Animated,
  Platform,
  Linking,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import BottomNav from "./BottomNav";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [userName, setUserName] = useState("");

  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [personalityType, setPersonalityType] = useState("");
  const [musicTaste, setMusicTaste] = useState("");
  const [drivingStyle, setDrivingStyle] = useState("");

  const [phoneNumber, setPhoneNumber] = useState(null);

  const [userId, setUserId] = useState(null);

  const [dlnumber, setDlnumber] = useState(null);
  const [carRegNumber, setCarRegNumber] = useState(null);
  const [dob, setDob] = useState(null);
  const handleOpenWebsite = () => {
    const url = "https://nextrilliontech.infinityfreeapp.com/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const navigation = useNavigation();

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
    const fetchDetails = async () => {
      try {
        const storedDlnumber = await AsyncStorage.getItem("dlnumber");
        const storedCarRegNumber = await AsyncStorage.getItem("carRegNumber");
        const storedDob = await AsyncStorage.getItem("dob");

        if (storedDlnumber) setDlnumber(storedDlnumber);
        if (storedCarRegNumber) setCarRegNumber(storedCarRegNumber);
        if (storedDob) setDob(storedDob);
      } catch (error) {
        console.error("Error fetching driver details:", error);
        Alert.alert("Error", "Failed to fetch driver details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        } else {
          setPhoneNumber("No phone number found.");
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        setUserId(id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

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

  const profileData = {
    mobile: phoneNumber,
    dlNumber: dlnumber,
    carRegNo: carRegNumber,
    dob: dob,
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
      }
    } catch (error) {
      console.warn("Permission error", error);
    }
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

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  const openImagePicker = async () => {
    // Request permission to access the gallery
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openNotifications = () => {
    // Navigation to notifications...
  };

  const handleSave = async () => {
    if (!email || !gender || !personalityType || !musicTaste || !drivingStyle) {
      Alert.alert("Error", "Please fill all the fields before saving.");
      return;
    }

    try {
      const response = await fetch("http://192.168.43.235:3000/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          gender,
          personalityType,
          musicTaste,
          drivingStyle,
          userId: userId,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Profile saved successfully!");
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../assets/nav_icon.png")}
            style={[styles.icon, styles.menuIcon]}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
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

      <View style={styles.profileBox}>
        <TouchableOpacity onPress={openImagePicker}>
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : require("../assets/Male_User.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={openImagePicker}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <View style={styles.userDetailContainer}>
            <Text style={styles.userDetail}>Mobile Number :</Text>
            <Text style={styles.userDetailValue}>{profileData.mobile}</Text>
          </View>
          <View style={styles.userDetailContainer}>
            <Text style={styles.userDetail}>DL Number :</Text>
            <Text style={styles.userDetailValue}>{profileData.dlNumber}</Text>
          </View>
          <View style={styles.userDetailContainer}>
            <Text style={styles.userDetail}>Car Registration No. :</Text>
            <Text style={styles.userDetailValue}>{profileData.carRegNo}</Text>
          </View>
          <View style={styles.userDetailContainer}>
            <Text style={styles.userDetail}>Date of Birth :</Text>
            <Text style={styles.userDetailValue}>{profileData.dob}</Text>
          </View>
        </View>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <View style={styles.textContainer}>
          <Text style={styles.Text}> Let your co-passengers </Text>
          <Text style={styles.Text1}> know about you!! </Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* Scrollable container for input boxes */}
      <ScrollView
        style={styles.bottomContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={[styles.input, { color: "#d0d0d0" }]}
          placeholder="Email ID"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={[styles.picker, { color: "#d0d0d0" }]}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Others" value="others" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personalityType}
            onValueChange={(itemValue) => setPersonalityType(itemValue)}
            style={[styles.picker, { color: "#d0d0d0" }]}
          >
            <Picker.Item label="What do you consider yourself as?" value="" />
            <Picker.Item label="Introvert" value="introvert" />
            <Picker.Item label="Extrovert" value="extrovert" />
            <Picker.Item label="Ambivert" value="ambivert" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={drivingStyle}
            onValueChange={(itemValue) => setDrivingStyle(itemValue)}
            style={[styles.picker, { color: "#d0d0d0" }]}
          >
            <Picker.Item label="How do you like to drive your car?" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={musicTaste}
            onValueChange={(itemValue) => setMusicTaste(itemValue)}
            style={[styles.picker, { color: "#d0d0d0" }]}
          >
            <Picker.Item label="Your taste in music" value="" />
            <Picker.Item label="Folk" value="folk" />
            <Picker.Item label="Classical" value="classical" />
            <Picker.Item label="Melody" value="melody" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

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
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
                <TouchableOpacity>
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
                <TouchableOpacity>
                  <Text style={styles.menuOptionText}>Sign Out</Text>
                  <View style={styles.horizontalRuler2} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        style={styles.bottomNav}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
    height: "10%",
    width: "20%",
    alignContent: "center",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 10,
    paddingBottom: 0.9,
    alignItems: "center",
    alignContent: "center",
    fontFamily: "poppins",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    width: "100%",
    height: "80%",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    height: "100%",
  },
  bottomContainer: {
    padding: 16,
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    maxHeight: 200, // Adjust the height as necessary
    marginTop: "100%", // Add margin to move it down
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "poppins",
  },
  picker: {
    height: 45,
    width: "100%",
    borderColor: "#d0d0d0",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "transparent",
    color: "black",
    fontFamily: "poppins",
    paddingLeft: 10,
  },
  pickerContainer: {
    height: 50,
    borderColor: "#d0d0d0",
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "white",
  },
  input: {
    height: 50,
    width: "100%",
    paddingLeft: 10,
    borderColor: "#d0d0d0",
    borderWidth: 1,
    paddingLeft: 25,

    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    fontFamily: "poppins",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#d0d0d0",
    top: "100%",
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "center",
    top: "100%",
  },
  Text: {
    color: "#d0d0d0",
    fontFamily: "poppins",
    textAlign: "center",
  },
  Text1: {
    color: "#d0d0d0",
    fontFamily: "poppins",
    textAlign: "center",
  },
  profileBox: {
    width: "90%",
    backgroundColor: "rgba(206, 206, 206, 0.36)",
    borderRadius: 10,
    padding: 40,
    alignItems: "center",
    position: "absolute",
    top: "12%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    top: "90%",
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginRight: 9,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    marginLeft: 9,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  cameraIcon: {
    fontSize: 20,
    alignSelf: "center",
    bottom: "150%",
  },
  detailsContainer: {
    alignItems: "flex-start",
    width: "100%",
  },
  userDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 16,
    fontFamily: "poppins",
  },
  userDetailValue: {
    fontSize: 16,
    fontFamily: "poppins",
  },
  headerText: {
    fontSize: 20,
    fontFamily: "poppins",
    top: "15%",
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
