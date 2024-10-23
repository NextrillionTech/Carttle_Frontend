import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import BottomNav from "./BottomNav";
import { sendMessage } from "./TwilioService";
import { useNavigation } from "@react-navigation/native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const MessageScreen = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("message");
  const [toNumber, setToNumber] = useState("+1234567890");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const navigation = useNavigation();

  const handleTabPress = (tab) => {
    setActiveTab(tab);

    if (tab === "home") {
      navigation.navigate("HomeScreen", { activeTab: tab });
    } else if (tab === "rides") {
      navigation.navigate("RidesScreen", { activeTab: tab });
    } else if (tab === "message") {
      navigation.navigate("MessageScreen", { activeTab: tab });
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

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const addEmojiToMessage = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
    setIsEmojiPickerVisible(false); // Close the emoji picker after selecting
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
        <Text style={styles.BackFont}>Back</Text>

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

      {isEmojiPickerVisible && (
        <Modal
          visible={isEmojiPickerVisible}
          animationType="slide"
          transparent={false}
        >
          <EmojiSelector
            category={Categories.all}
            onEmojiSelected={addEmojiToMessage}
            showSearchBar={true}
          />
        </Modal>
      )}

      <View style={styles.inputWrapper}>
        <TouchableOpacity>
          <Image source={require("../assets/plus.png")} style={styles.icon} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity onPress={toggleEmojiPicker}>
          <Image
            source={require("../assets/Smiley.png")} // Add your smiley icon here
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSend}>
          <Image
            source={require("../assets/send.png")}
            style={styles.Sendicon}
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
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 5,
    marginLeft: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    fontFamily: "poppins",
    paddingTop: 40,
    paddingLeft: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
    right: 50,
    fontFamily: "poppins",
  },
  BackFont: {
    fontSize: 15,
    fontFamily: "poppins",
    right: 70,
    color: "#414141",
  },
  callIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    paddingRight: 50,
  },
  SendiconcallIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    paddingRight: 50,
  },
  sentMessage: {
    alignSelf: "flex-end",
    borderColor: "#000",
    borderWidth: 1,
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
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
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    marginHorizontal: 10,
    marginBottom: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 0,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
});

export default MessageScreen;
