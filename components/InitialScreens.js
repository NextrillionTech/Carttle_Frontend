import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins': require('../assets/Poppins-Medium.ttf'),
  });
};

const InitialScreens = () => {
  const [step, setStep] = useState(1);
  const [fill, setFill] = useState(33); 
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isGoVisible, setIsGoVisible] = useState(false); 
  const imageOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const navigation = useNavigation();

  const images = [
    require('../assets/image1.png'),
    require('../assets/image2.png'),
    require('../assets/image3.png')
  ];

  const texts = [
    {
      title: 'Stress Free Commute',
      description: 'Join the carpooling community and save time and money on your daily commute.',
    },
    {
      title: 'Realtime Tracking',
      description: 'Know your driver in advance and be able to view current location real on the map.',
    },
    {
      title: 'Earn Money',
      description: 'Give rides to nearby passengers, use promo codes & earn money.',
    }
  ];

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    imageOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
    textOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [step, imageOpacity, textOpacity]);

  const handlePress = () => {
    if (step < 2) {
      setStep(step + 1);
      setFill(67); 
      setIsGoVisible(false);
      imageOpacity.value = 0;
      textOpacity.value = 0;
      imageOpacity.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.cubic),
      });
      textOpacity.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.cubic),
      });
    } else {
      setStep(3); 
      setFill(100); 
      setIsGoVisible(true); 
    }
  };

  const handleSkip = () => {
    navigation.navigate('LocationScreen'); 
  };

  const handleGoPress = () => {
    navigation.navigate('LocationScreen'); 
  };

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
        <Image source={images[step - 1]} style={styles.image} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text style={styles.title}>{texts[step - 1].title}</Text>
        <Text style={styles.description}>{texts[step - 1].description}</Text>
      </Animated.View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={isGoVisible ? handleGoPress : handlePress} style={styles.arrowButton}>
          <AnimatedCircularProgress
            size={width * 0.22} 
            width={3} 
            fill={fill}
            tintColor="#000"
            backgroundColor="#e0e0e0"
            rotation={0}
          >
            {() => (
              <View style={styles.innerCircle}>
                {isGoVisible ? (
                  <View style={styles.goCircle}>
                    <Text style={styles.goText}>Go</Text>
                  </View>
                ) : (
                  <Svg height={width * 0.18} width={width * 0.18} viewBox="0 0 24 24">
                    <Circle cx="12" cy="12" r="12" fill="black" />
                    <Path d="M9 12h6 M12 9l3 3-3 3" fill="none" stroke="white" strokeWidth="0.5" />
                  </Svg>
                )}
              </View>
            )}
          </AnimatedCircularProgress>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.06,
    backgroundColor: 'white',
    fontFamily: 'poppins',
  },
  skipButton: {
    position: 'absolute',
    top: height * 0.08,
    right: width * 0.06,
  },
  skipText: {
    color: '#414141',
    fontSize: width * 0.04,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: width * 0.6,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: width * 0.12,
    marginVertical: height * 0.025,
  },
  title: {
    fontSize: width * 0.05,
    color: '#414141',
    textAlign: 'center',
    marginBottom: height * 0.015,
    fontFamily: 'poppins',
  },
  description: {
    fontSize: width * 0.04,
    color: '#7C7C7C',
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  arrowButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.15,
    width: width * 0.15,
  },
  goCircle: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.17,
    width: width * 0.17,
    borderRadius: width * 0.085,
  },
  goText: {
    color: 'white',
    fontFamily:'poppins',
    fontSize: width * 0.04,
  },
});

export default InitialScreens;