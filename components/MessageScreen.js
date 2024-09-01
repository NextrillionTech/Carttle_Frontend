import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import BottomNav from "./BottomNav";
import { sendMessage } from "./TwilioService";
import { useNavigation } from "@react-navigation/native";

const MessageScreen = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("message");
  const [toNumber, setToNumber] = useState("+1234567890");

  const navigation = useNavigation();

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      navigation.navigate("HomeScreen");
    } else if (tab === "rides") {
      navigation.navigate("RideScreen");
    } else if (tab === "message") {
      navigation.navigate("MessageScreen");
    }
  };

  const handleSend = async () => {
    if (message.trim().length === 0) {
      alert("Please enter a message before sending.");
      return;
    }

    try {
      await sendMessage(toNumber, message);
      alert("Message sent successfully!");
      setMessage("");
    } catch (error) {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/Call.png")}
            style={styles.callIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.messageContainer}>
        <View style={styles.receivedMessage}>
          <Text>Where are you? I will be there in 2 minutes.</Text>
        </View>
        <View style={styles.sentMessage}>
          <Text>{message}</Text>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <TouchableOpacity>
          <Image
            source={require("../assets/plus.png")} // Update with the correct path to your plus icon
            style={styles.icon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={handleSend}>
          <Image
            source={require("../assets/send.png")} // Update with the correct path to your send icon
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        style={styles.bottomNav}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 10,
    borderColor: "#000000",
    marginVertical: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingTop: 40,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  callIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  sentMessage: {
    alignSelf: "flex-end",
    borderColor: "#000",
    borderWidth: 1,
    backgroundColor: "#E8E8E8",

    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginHorizontal: 10, // Adjust spacing between icon and text input
  },
});

export default MessageScreen;
