import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    Alert,
    TouchableOpacity,
  } from 'react-native';
import InputField from '../../components/customUIs/InputField';
import PasswordInput from '../../components/customUIs/PasswordInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/customUIs/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../util/AuthContext';
import { AsyncLocalStorage } from 'async_hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SignupScreen = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  // test logout
  const { authEmitter } = useAuth();

  useEffect(() => {
      setPassword('');
      setEmail('');
      setName('');
      setPhone('');
      }, []);
  
  const handleSignup = async () => {
    // const result = isValidForm(email, password, name, phone);
    // if (!result) {
    //   Alert.alert(errorMessage);
    // } else {
    //     const signUpResult = await signup({ email, password, name, phone });
    //     if (signUpResult instanceof Error) {
    //         Alert.alert("Error", signUpResult.message);
    //     } else {
    //         Alert.alert("Please check your email and confirm account activation");
    //         navigation.navigate("LoginScreen");
    //     }
    // }
    await AsyncStorage.clear();
    authEmitter.emit('loginStatusChanged');
  };
    

  const isValidGmailAddress = email => {
    const gmailRegex = /@gmail\.com$/;
    return gmailRegex.test(email);
  };
  const isValidPassword = password => {
    return password.length >= 8;
  };
  
  const isValidPhone= phone => {
    return phone.length === 10;
  };

  const isValidForm = (email, password, fullname, phone) => {
    if (email === '' || password === '' || fullname === '' || phone === '') {
        setErrorMessage('Lack of information!');
        return false;
    }

    if (!isValidGmailAddress(email)) {
        setErrorMessage('Invalid email format');
        return false;
    }

    if (!isValidPassword(password)) {
        setErrorMessage('Password must be at least 8 characters long');
        return false;
    }

    if (!isValidPhone(phone)) {
        setErrorMessage('Invalid phone number');
        return false;
    }

    return true;
  };

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{position: 'absolute', top: 20, left: 20}}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={{paddingHorizontal: 25}}>
                <Text
                style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 28,
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: 30,
                }}>
                Register
                </Text>
                <InputField
                label={'Email'}
                icon={
                    <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                marginBottom={30}
                keyboardType="email-address"
                onChangeText={email => setEmail(email)}
                />
                <InputField
                label={'Phone '}
                icon={
                    <MaterialIcons
                    name="smartphone"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                marginBottom={30}
                keyboardType="phone-pad"
                onChangeText={phone => setPhone(phone)}
                />
                <InputField
                label={'Full name'}
                icon={
                    <MaterialIcons
                    name="face"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                    />
                }
                marginBottom={30}
                keyboardType="email-address"
                onChangeText={name => setName(name)}
                />
                <PasswordInput
                label={'Password'}
                icon={
                    <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#666"
                    style={{marginRight: 5}}
                />
                }
                marginBottom={30}
                onChangeText={password => setPassword(password)}
                />
                <CustomButton label={"Register"} onPress={handleSignup}/>
            </View>

        </SafeAreaView>
    )
}

export default SignupScreen