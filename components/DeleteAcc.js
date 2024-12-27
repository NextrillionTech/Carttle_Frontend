import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const DeleteAccountScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      <Text style={styles.header}>Delete Account</Text>
      <Text style={styles.description}>
        Are you sure you want to delete your account? Please read how account deletion will affect.
        {'\n\n'}
        Deleting your account removes personal information from our database. Your mobile no./email
        becomes permanently reserved and same cannot be re-used to register a new account.
      </Text>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 20,
    marginTop: 20,
  },
  backText: {
    fontSize: 16,
    color: '#000000', // Ensure you have this font installed or adjust accordingly
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: "poppins", // Ensure you have this font installed
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 15,
  },
  description: {
    fontSize: 14,
    color: '#717171',
    lineHeight: 20,
    fontFamily: "poppins", // Ensure you have this font installed
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: "poppins", // Ensure you have this font installed
  },
});

export default DeleteAccountScreen;
