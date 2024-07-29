import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins-medium': require('./assets/Poppins-Medium.ttf'),
  });
};

const { width } = Dimensions.get('window');
const carImage = require('./assets/car-image.png');

const ChooseRoleScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  // Animation values
  const buttonsPosition = new Animated.Value(0); // Start at center, end at bottom
  const imageOpacity = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);

  React.useEffect(() => {
    async function loadFonts() {
      await fetchFonts();
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  React.useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
        Animated.timing(buttonsPosition, {
          toValue: 1, 
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(buttonsPosition, {
          toValue: 0, 
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleTravelerPress = () => {
    navigation.navigate('TravellerWelcome');
  };

  const handleDriverPress = () => {
    navigation.navigate('DriverWelcome');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity: imageOpacity }]}>
        <Image source={carImage} style={styles.image} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: titleOpacity }]}>
        <Text style={styles.title}>How do you want to continue as?</Text>
        <Text style={styles.subtitle}>You can login as a driver or a traveler, select any one to continue</Text>
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, {
        transform: [{
          translateY: buttonsPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -200],
          })
        }]
      }]}>
        <TouchableOpacity style={styles.button} onPress={handleTravelerPress}>
          <Text style={styles.buttonText}>Traveler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} onPress={handleDriverPress}>
          <Text style={styles.outlineButtonText}>Driver</Text>
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
    backgroundColor: '#ffff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  image: {
    width: 500,
    height: 243.66,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20, 
  },
  title: {
    fontSize: 24,
    color: '#292929',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'poppins-medium',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    fontFamily: 'poppins-medium',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: 340,
    height: 54,
    backgroundColor: 'black',
    borderRadius: 10,
    marginBottom: 10, 
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'poppins-medium',
  },
  outlineButton: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 340,
    height: 54,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10, 
  },
  outlineButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'poppins-medium',
  },
});

export default ChooseRoleScreen;