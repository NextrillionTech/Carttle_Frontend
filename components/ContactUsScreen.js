import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ContactUsScreen = ({ navigation }) => {
  const [queryType, setQueryType] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Contact us for any queries</Text>
        <Text style={styles.infoSubText}>
          Website:{" "}
          <Text style={styles.linkText}>www.carttle.infinityfreeapp.com</Text>
        </Text>
        <Text style={styles.infoSubText}>Call: +91-81784 74381</Text>
        <Text style={styles.infoSubText}>
          Email:{" "}
          <Text style={styles.linkText}>contact.nextrilliontech@gmail.com</Text>
        </Text>
      </View>

      {/* Send Message */}
      <Text style={styles.formTitle}>Send Message</Text>
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Dropdown for Query Type */}
      <View style={styles.input}>
        <Picker
          selectedValue={queryType}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue) => setQueryType(itemValue)}
        >
          <Picker.Item label="Query Type" value="" />
          <Picker.Item label="Technical Issue" value="technical" />
          <Picker.Item label="Account Issue" value="account" />
          <Picker.Item label="General Inquiry" value="general" />
        </Picker>
      </View>

      <TextInput
        style={[styles.input, { height: 150 }]}
        placeholder="Write your query description..."
        multiline
      />

      <TouchableOpacity style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send Message</Text>
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
    marginTop: 30,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 40,
  },
  infoSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  linkText: {
    color: "black",
    textDecorationLine: "underline",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    height: 50,
  },
  sendButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactUsScreen;
