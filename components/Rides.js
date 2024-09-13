import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Rides = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image
          source={require("../assets/nav_icon.png")}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>All Rides</Text>
      <TouchableOpacity onPress={() => console.log("Right icon pressed")}>
        <Image
          source={require("../assets/Bell_icon.png")}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        style={styles.bottomNav}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff", // Adjust background color if needed
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Rides;
