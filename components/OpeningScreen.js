import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const OpeningScreen = ({ navigation }) => {
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const [showBlankScreen, setShowBlankScreen] = useState(false);

 useEffect(() => {
  const animationDelay = 1000; 

  Animated.timing(zoomAnim, {
    toValue: 3, 
    duration: 900, 
    useNativeDriver: true,
    easing: Easing.inOut(Easing.ease), 
  }).start(() => {
    setShowBlankScreen(true);
    setTimeout(() => {
      navigation.navigate('InitialScreens');
    }, 500); 
  });

}, [zoomAnim, navigation]);


  if (showBlankScreen) {
    return <View style={styles.blankScreen} />;
  }

  return (
    <LinearGradient
      colors={['#000000', 'rgba(0, 0, 0, 0.5)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Animated.Image
        source={require('./assets/carttle_logo.png')} 
        style={[
          styles.logo,
          {
            transform: [{ scale: zoomAnim }],
          },
        ]}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  blankScreen: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default OpeningScreen;