import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import DropDownPicker from 'react-native-dropdown-picker';

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins': require('./assets/Poppins-Medium.ttf'),
  });
};

const countryData = [
  { label: '🇺🇸 USA', value: '+1' },
  { label: '🇮🇳 IND', value: '+91' },
  { label: '🇬🇧 UK', value: '+44' },
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
  };

  const handlePhoneChange = (text) => {
    const phoneNumber = text.replace(/^\+\d+\s*/, '');
    setPhone(phoneNumber);
    setIsPhoneValid(phoneNumber.length === 10); 
  };

  const phoneNumberWithCode = ${value} ${phone}; 

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (key, index) => {
    if (key === 'Backspace' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={require('./assets/back.png')} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create an account with your phone number.</Text>
      <TextInput
        style={styles.input}
        placeholder="Name*"
        value={name}
        onChangeText={setName}
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
        />
      </View>
      {!isOtpSent ? (
        <TouchableOpacity
          style={[styles.button, !isPhoneValid]}
          onPress={handleSendOtp}
          disabled={!isPhoneValid}
        >
          <Text style={styles.buttonText}>Send OTP!</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => otpRefs.current[index] = ref}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={value}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
              />
            ))}
          </View>
          <Text style={styles.resendText}>Didn’t receive the OTP? <Text style={styles.resendLink}>Resend it</Text></Text>
        </>
      )}
      <View style={styles.termsContainer}>
        <Image source={require('./assets/check-icon.png')} style={styles.checkIcon} />
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
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('./assets/gmail.png')} style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>Sign up with Gmail</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('./assets/apple.png')} style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>Sign up with Apple</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
    alignSelf: 'flex-start', 
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'poppins-medium',
  },
  title: {
    fontSize: 24,
    color: '#414141',
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'poppins',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: 'poppins',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dropdownContainer: {
    width: 100,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
    fontFamily: 'poppins',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'poppins',
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 40,
    width: '14%',
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  resendText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
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
    marginBottom: 15,
    marginTop: 10,
    marginRight: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#b8b8b8',
    fontFamily: 'poppins',
  },
  link: {
    color: '#0163e0',
  },
  createButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'poppins',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#888',
    fontFamily: 'poppins',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 54,
    borderColor: '#ccc',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#5a5a5a',
    fontFamily: 'poppins',
  },
  softcopyText: {
    fontSize: 12,
    color: '#5a5a5a',
    textAlign: 'center',
    fontFamily: 'poppins',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
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