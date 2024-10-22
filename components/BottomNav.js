import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

const BottomNav = ({ activeTab, onTabPress, disableActiveColor }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => onTabPress("home")}>
        <Image
          source={require("../assets/HOME.png")}
          style={[
            styles.icon,
            !disableActiveColor && activeTab === "home" && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPress("RidesScreen")}>
        <Image
          source={require("../assets/RIDES.png")}
          style={[
            styles.icon,
            !disableActiveColor &&
              activeTab === "RidesScreen" &&
              styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPress("message")}>
        <Image
          source={require("../assets/MESG.png")}
          style={[
            styles.icon,
            !disableActiveColor && activeTab === "message" && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 20,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  activeIcon: {
    tintColor: "#188AEC",
  },
});

export default BottomNav;
