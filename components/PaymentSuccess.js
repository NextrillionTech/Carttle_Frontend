import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons"; // For the back icon
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PaymentScreen = () => {
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
        "poppins-medium": require("../assets/Poppins-Medium.ttf"),
      });
    
      if (!fontsLoaded) {
        return <AppLoading />; // Display a loading screen while fonts are being loaded
      }
      const handleBack = () => {
        navigation.goBack();
      };
    
  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Image source={require("../assets/back.png")} style={styles.backIcon} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

      {/* Success Icon */}
      <View style={styles.iconContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color="black" />
      </View>
        <Text style={styles.successText}>Payment Successful</Text>
        <Text style={styles.transactionId}>01859-489562</Text>
      </View>

      {/* Transaction Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValue}>#71L69PJK3</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>₹200.00</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Charge</Text>
          <Text style={styles.detailValue}>₹20.00</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>₹220.00</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timestamp</Text>
          <Text style={styles.detailValue}>01/11/22, 10:45PM</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={require('../assets/call_.png')} // Add your call driver icon PNG
            style={styles.icon}
          />
          <Text style={styles.actionText}>Call Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={require('../assets/mail.png')} // Add your message driver icon PNG
            style={styles.icon}
          />
          <Text style={styles.actionText}>Message Driver</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Button */}
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("TravellerRideDetails")}>
        <Text style={styles.footerButtonText}>Back to Ride Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: SCREEN_HEIGHT * 0.08,
    left: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  backIcon: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  backText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: "#414141",
    fontFamily: "poppins-medium",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "poppins-medium",
    color: '#000',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontFamily: "poppins-medium",
    color: '#000',
  },
  transactionId: {
    fontSize: 14,
    fontFamily: "poppins-medium",
    color: '#7C7C7C',
    marginTop: 4,
  },
  detailsContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: '#7C7C7C',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: '#000',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: '#000',
  },
  footerButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 32,
  },
  footerButtonText: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: '#FFF',
  },
});

export default PaymentScreen;
