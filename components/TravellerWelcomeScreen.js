import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins': require('./assets/Poppins-Medium.ttf'),
  });
};

const { width, height } = Dimensions.get('window');

const carImage = require('./assets/travel.jpg');

const TravellerWelcome = () => {
  const navigation = useNavigation();
  const travelerOpacity = new Animated.Value(1);
  const driverOpacity = new Animated.Value(1);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const handleTravelerPress = () => {
    navigation.navigate('TravellerWelcome');
    Animated.timing(travelerOpacity, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const handleDriverPress = () => {
    navigation.navigate('WelcomeScreen');
    Animated.timing(driverOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={carImage} style={styles.image} />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Have a great traveling experience, Bon Voyage!!</Text>
      <Animated.View style={{ ...styles.buttonContainer, opacity: travelerOpacity }}>
        <TouchableOpacity style={styles.button} onPress={handleTravelerPress}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ ...styles.buttonContainer, opacity: driverOpacity }}>
        <TouchableOpacity style={styles.outlineButton} onPress={handleDriverPress}>
          <Text style={styles.outlineButtonText}>Log In</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: width * 0.9,
    height: height * 0.4,
    resizeMode: 'cover',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
    fontFamily: 'poppins',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 50,
    fontFamily: 'poppins',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 340,
    height: 54,
    backgroundColor: 'black',
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 15,
    fontFamily: 'poppins',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'poppins',
  },
  outlineButton: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 340,
    height: 54,
    paddingVertical: 15,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'poppins',
  },
});

export default TravellerWelcome;
