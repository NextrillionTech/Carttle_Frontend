import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const TravellerRideDetails = () => {
  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 28.7041,
            longitude: 77.1025,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 28.7041, longitude: 77.1025 }}
            title="Pickup Location"
          >
            <Image source={require('../assets/car_loc.png')} style={styles.carIcon} />
          </Marker>
        </MapView>
      </View>

      {/* Driver info */}
      <View style={styles.infoContainer}>
      <View style={styles.separator} />
        <Text style={styles.infoText}>Alex Brim will reach you in 5mins.</Text>
        <View style={styles.horizontalRuler} />
        
        <View style={styles.driverCard}>
          <Image source={require('../assets/driver_avatar.jpg')} style={styles.driverImage} />
          <View style={styles.driverDetails}>
            <Text style={styles.carDetails}>HR26EM3749 (WagonR)</Text>
            <Text style={styles.driverLocation}>Udyog Vihar, Phase 1, 122001</Text>
            <Text style={styles.ratingText}>⭐ 4.9 (531 reviews)</Text>
          </View>
          <Image source={require('../assets/driver_car.jpg')} style={styles.carImage} />
        </View><View style={styles.horizontalRuler} />

        <View style={styles.bookingDetails}>
  <View style={styles.seatsContainer}>
    <Text style={styles.label}>Booked Seats</Text>
    <View style={styles.buttonLikeContainer}>
      <Text style={styles.seatButtonText}>1 seat(s)</Text>
    </View>
  </View><View style={styles.horizontalRuler} />
  <View style={styles.amountContainer}>
    <Text style={styles.label}>Amount Paid</Text>
    <Text style={styles.value}>₹220.00</Text>
  </View>
</View><View style={styles.horizontalRuler} />


        {/* OTP and Buttons */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Share this OTP with Alex:</Text>
          <View style={styles.otp}>
            <Text style={styles.otpText}>1</Text>
            <Text style={styles.otpText}>2</Text>
            <Text style={styles.otpText}>3</Text>
            <Text style={styles.otpText}>4</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText1}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navIcon}>
          <Image source={require('../assets/HOME.png')} style={styles.navIconImage} />
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Image source={require('../assets/RIDES.png')} style={styles.navIconImage} />
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Image source={require('../assets/msg_icon.png')} style={styles.navIconImage} />
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1.5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  horizontalRuler: {
    width: "100%",
    height: 1,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    marginVertical: 5,
  },
  carIcon: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flex: 2,
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: "poppins",
    marginBottom: 10,
  },
  separator: {
    height: 3,
    width: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 50,
    marginVertical: 10,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverDetails: {
    flex: 1,
    marginLeft: 15,
  },
  carDetails: {
    fontSize: 16,
    fontFamily: "poppins",
  },
  driverLocation: {
    fontSize: 14,
    fontFamily: "poppins",
    color: '#888',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "poppins",
    color: '#888',
  },
  carImage: {
    width: 80,
    height: 60,
  },
  bookingDetails: {
    flexDirection: 'column', // Stack vertically
    marginBottom: 10,
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  buttonLikeContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 190,
    backgroundColor: '#f5f5f5',
  },
  seatButtonText: {
    fontSize: 14,
    fontFamily: "poppins",
    color: '#333',
  },
  
  amountContainer: {
    marginBottom: 10, // Space between amount and other sections
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontFamily: "poppins",
  },
  value: {
    fontSize: 16,
    fontFamily: "poppins",
    marginLeft: 210,
  },
  otpContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  otpLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "poppins",
  },
  otp: {
    flexDirection: 'row',
    marginLeft:10,
    marginRight:20,
    padding: 10,
  },
  otpText: {
    fontSize: 18,
    fontFamily: "poppins",
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 40,
    textAlign: 'center',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "poppins",
  },
  buttonText1: {
    fontSize: 16,
    color:'#ffffff',
    fontFamily: "poppins",
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navIcon: {
    alignItems: 'center',
  },
  navIconImage: {
    width: 59,
    height: 45,
  },
  navText: {
    fontSize: 12,
    fontFamily: "poppins",
    marginTop: 5,
  },
});

export default TravellerRideDetails;