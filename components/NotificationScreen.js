import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomNav from "./BottomNav";
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const NotificationScreen = ({ navigation }) => {
  const handleTabPress = (tab) => {
    if (tab === "home") {
      navigation.navigate("HomeScreen");
    } else if (tab === "rides") {
      navigation.navigate("RideScreen");
    } else if (tab === "message") {
      navigation.navigate("MessageScreen");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require("../assets/back.png")} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.BackFont}>Back</Text>
      <Text style={styles.header}>Notifications</Text>
      <View style={styles.content}>{/* Add any other content here */}</View>
      <BottomNav
        activeTab={""} // Adjust based on your logic
        onTabPress={handleTabPress}
        disableActiveColor={true} // Adjust based on your design
        style={styles.bottomNav}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50, // Space for the header
    flexDirection: "column", // Ensure vertical layout
  },
  header: {
    fontSize: 20,
    fontFamily: "poppins",
    bottom: 30,
    marginBottom: 16,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    fontFamily: "poppins",
    top: "100%",
    color: "#2A2A2A",

    // Takes up available space above the BottomNav
  },
  bottomNav: {
    backgroundColor: "white",
  },
  backIcon: {
    width: 24,
    height: 24,
    top: "100%",
    resizeMode: "contain",
  },

  BackFont: {
    fontSize: 18,
    fontFamily: "poppins",
    left: "9%",

    color: "#414141",
  },
});

export default NotificationScreen;
