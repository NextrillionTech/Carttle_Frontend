import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width } = Dimensions.get('window');

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins': require('./assets/Poppins-Medium.ttf'),
  });
};

const mapBackground = require('./assets/map-background.png');
const locationIcon = require('./assets/location-icon.png');

const LocationScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const textOpacity = useSharedValue(0); 
  const translateY = useSharedValue(100); 
  const iconOpacity = useSharedValue(0); 
  const iconTranslateY = useSharedValue(100); 

  useEffect(() => {
    setTimeout(() => {
      textOpacity.value = withTiming(1, {
        duration: 750, // Adjusted duration for text opacity
        easing: Easing.out(Easing.exp),
      });
      translateY.value = withTiming(0, {
        duration: 750, // Adjusted duration for text translateY
        easing: Easing.out(Easing.exp),
      });
      iconOpacity.value = withTiming(1, {
        duration: 750, // Adjusted duration for icon opacity
        easing: Easing.out(Easing.exp),
      });
      iconTranslateY.value = withTiming(0, {
        duration: 750, // Adjusted duration for icon translateY
        easing: Easing.out(Easing.exp),
      });
    }, 1000); 
  }, [textOpacity, translateY, iconOpacity, iconTranslateY]);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
      transform: [{ translateY: iconTranslateY.value }],
    };
  });

  const handleLocationPress = () => {
    setTimeout(() => {
      navigation.navigate('ChooseRole');
    }, 2000); 
  };

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground 
      source={mapBackground} 
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Animated.Image source={locationIcon} style={[styles.icon, animatedIconStyle]} />
          <Animated.Text style={[styles.title1, animatedTextStyle]}>Enable your location</Animated.Text>
          <Animated.Text style={[styles.subtitle, animatedTextStyle]}>Choose your location to find travelers around you</Animated.Text>
          <TouchableOpacity style={styles.button} onPress={handleLocationPress}>
            <Text style={styles.buttonText}>Use my location</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1, 
  },
  card: {
    width: 340,
    height: 420,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#a0a0a0',
    marginBottom: 11,
    fontFamily: 'poppins',
  },
  title1: {
    fontSize: 24,
    textAlign: 'center',
    color: '#414141',
    marginBottom: 11,
    fontFamily: 'poppins',
  },
  button: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    fontSize: 16,
    color: '#b8b8b8',
  },
});

export default LocationScreen;
