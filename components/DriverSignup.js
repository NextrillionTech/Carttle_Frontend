import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import DropDownPicker from 'react-native-dropdown-picker';

const { width, height } = Dimensions.get('window');

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins': require('../assets/Poppins-Medium.ttf'),
  });
};

const countryData = [
  { label: '🇺🇸 USA', value: '+1' },
  { label: '🇮🇳 IND', value: '+91' },
  { label: '🇬🇧 UK', value: '+44' },
  // Add more countries as needed
];

const DriverSignup = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('+91');
  const [items, setItems] = useState(countryData);

  const otpRefs = useRef([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setIsOtpSent(true);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateAccount = () => {
    // Handle account creation
  };

  const handlePhoneChange = (text) => {
    const phoneNumber = text.replace(/^\+\d+\s*/, ''); 
    setPhone(phoneNumber);
    setIsPhoneValid(phoneNumber.length === 10); 
  };

  const phoneNumberWithCode = `${value} ${phone}`; 

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to the next input field if text is entered
    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (key, index) => {
    if (key === 'Backspace' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create an account with your phone number.</Text>
        <TextInput
          style={styles.input}
          placeholder="Name*"
          value={name}
          onChangeText={setName}
          selectionColor="black"
        />
        <View style={styles.phoneContainer}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
          />
          <TextInput
            style={styles.phoneInput}
            placeholder="Your mobile number*"
            keyboardType="phone-pad"
            value={phoneNumberWithCode}
            onChangeText={handlePhoneChange}
            selectionColor="black"
          />
        </View>
        {!isOtpSent ? (
          <TouchableOpacity
            style={[styles.button, !isPhoneValid && styles.disabledButton]}
            onPress={handleSendOtp}
            disabled={!isPhoneValid}
          >
            <Text style={styles.buttonText}>Send OTP!</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  placeholder="_"
                  placeholderTextColor="#ccc"
                  selectionColor="black"
                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                />
              ))}
            </View>
            <Text style={styles.resendText}>Didn’t receive the OTP? <Text style={styles.resendLink}>Resend it</Text></Text>
          </>
        )}
        <View style={styles.termsContainer}>
          <Image source={require('../assets/check-icon.png')} style={styles.checkIcon} />
          <Text style={styles.termsText}>By signing up, you agree to the <Text style={styles.link}>Terms of service</Text> and <Text style={styles.link}>Privacy policy</Text>.</Text>
        </View>
        <Text style={styles.softcopyText}>Please keep your driving license & RC soft-copy handy...</Text>
        <TouchableOpacity
          style={[styles.createButton, !isOtpSent && styles.disabledButton]}
          onPress={handleCreateAccount}
          disabled={!isOtpSent}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/gmail.png')} style={styles.socialIcon1} />
            <Text style={styles.socialButtonText}>Gmail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../assets/apple.png')} style={styles.socialIcon2} />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.04,
  },
  backIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
  backText: {
    fontSize: width * 0.04,
    color: '#414141',
    fontFamily: 'poppins',
  },
  title: {
    fontSize: width * 0.06,
    color: '#414141',
    marginBottom: height * 0.02,
    fontFamily: 'poppins',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.02,
    fontFamily: 'poppins',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  dropdownContainer: {
    width: width * 0.3,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: height * 0.07,
    borderRadius: width * 0.02,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    marginLeft: width * 0.02,
    fontFamily: 'poppins',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontFamily: 'poppins',
  },
  disabledButton: {
    backgroundColor: '#888',
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
    padding: width * 0.03,
    borderRadius: 5,
    textAlign: 'center',
    width: width * 0.13,
  },
  resendText: {
    fontSize: width * 0.035,
    color: '#888',
    marginBottom: height * 0.02,
    marginTop: width * 0.05,
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  resendLink: {
    color: '#0163e0',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  checkIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  termsText: {
    fontSize: width * 0.03,
    color: '#b8b8b8',
    fontFamily: 'poppins',
  },
  link: {
    color: '#0163e0',
  },
  createButton: {
    backgroundColor: '#000',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    height: height * 0.07,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  createButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontFamily: 'poppins',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: width * 0.02,
    fontSize: width * 0.035,
    color: '#888',
    fontFamily: 'poppins',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: height * 0.07,
    borderColor: '#ccc',
    justifyContent: 'center',
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.02,
  },
  socialIcon1: {
    width: width * 0.08,
    height: width * 0.1,
    marginRight: width * 0.02,
  },
  socialIcon2: {
    width: width * 0.08,
    height: width * 0.08,
    marginRight: width * 0.02,
  },
  socialButtonText: {
    fontSize: width * 0.04,
    color: '#5a5a5a',
    fontFamily: 'poppins',
  },
  softcopyText: {
    fontSize: width * 0.03,
    color: '#5a5a5a',
    textAlign: 'center',
    fontFamily: 'poppins',
    marginBottom: height * 0.01,
  },
  footerText: {
    fontSize: width * 0.035,
    color: '#5a5a5a',
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  signInLink: {
    color: '#0163e0',
    textDecorationLine: 'underline',
  },
});

export default DriverSignup;
