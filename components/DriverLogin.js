import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DriverLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigation = useNavigation();
  const animation = new Animated.Value(0);
  const otpRefs = useRef([]);

  let [fontsLoaded] = useFonts({
    'poppins-medium': require('../assets/Poppins-Medium.ttf'),
  });

  const handleSendOtp = () => {
    setShowOtpInput(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      otpRefs.current[0].focus(); // Automatically focus on the first OTP input
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignUp = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('DriverSignUp');
    });
  };

  
  const handleLogin = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('HomeScreen');
    });
  };

  
  const handleSignupPress = () => {
    navigation.navigate('DriverSignup');
  };

  const handleChangeOtp = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input box when a digit is entered
    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={require('../assets/back.png')} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Log in with your phone number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        selectionColor="black"
      />
      {showOtpInput ? (
        <View style={styles.otpContainer}>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChangeOtp(text, index)}
                placeholder="_"
                placeholderTextColor="#ccc"
                selectionColor="black"
              />
            ))}
          </View>
          <TouchableOpacity onPress={() => {}} style={styles.resendContainer}>
            <Text style={styles.signUpText}>Didn't receive the OTP?</Text>
            <Text style={styles.signUpLink}>Resend it</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.common1Button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.commonButton} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP!</Text>
        </TouchableOpacity>
      )}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../assets/gmail.png')} style={styles.socialIcon1} />
        <Text style={styles.socialButtonText}>Log in with Gmail</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../assets/apple.png')} style={styles.socialIcon2} />
        <Text style={styles.socialButtonText}>Log in with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer} onPress={handleSignupPress}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <Text style={styles.signUpLink}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.05,
    backgroundColor: 'WHITE',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.08, // Increased from 0.04 to 0.08
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
    color: '#414141',
    fontFamily: 'poppins-medium',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.07,
    color: '#414141',
    textAlign: 'left',
    marginTop: SCREEN_HEIGHT * 0.15,
    marginLeft: SCREEN_WIDTH * 0.03,
    alignSelf: 'flex-start',
    fontFamily: 'poppins-medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    width: '100%',
    height: SCREEN_HEIGHT * 0.07,
    padding: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_HEIGHT * 0.03,
    borderRadius: 7,
    marginBottom: SCREEN_HEIGHT * 0.02,
    fontFamily: 'poppins-medium',
  },
  otpContainer: {
    alignItems: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: SCREEN_WIDTH * 0.03,
    borderRadius: 5,
    textAlign: 'center',
    width: SCREEN_WIDTH * 0.13,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  commonButton: {
    backgroundColor: '#000',
    padding: SCREEN_HEIGHT * 0.02,
    width: '100%',
    borderRadius: 7,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  common1Button: {
    backgroundColor: '#000',
    padding: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.07,
    borderRadius: 7,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  buttonText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: 'poppins-medium',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.03,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: SCREEN_WIDTH * 0.03,
    color: '#d0d0d0',
    fontFamily: 'poppins-medium',
  },
  socialButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: SCREEN_WIDTH * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 7,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  socialIcon1: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_WIDTH * 0.09,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  socialIcon2: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_WIDTH * 0.085,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  socialButtonText: {
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
    color: '#5a5a5a',
    fontFamily: 'poppins-medium',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: SCREEN_HEIGHT * 0.01,
    justifyContent: 'center',
  },
  signUpText: {
    color: '#5a5a5a',
    fontFamily: 'poppins-medium',
  },
  signUpLink: {
    color: '#4a73da',
    fontWeight: 'bold',
    fontFamily: 'poppins-medium',
  },
});

export default DriverLogin;
