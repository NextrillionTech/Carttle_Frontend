import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ChangePasswordScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null); // State for user type

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUserType = await AsyncStorage.getItem("userType"); // Retrieve the user type
        setUserId(storedUserId);
        setUserType(storedUserType); // Set the user type state
      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://13.203.66.17/change-password",
        {
          userId,
          oldPassword,
          newPassword,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password updated successfully.");
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.error || "Server error. Please try again."
        );
      } else {
        Alert.alert(
          "Error",
          "Network error. Please check your connection and try again."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Old Password"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New Password"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    marginTop: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;
