import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    Alert,
    TouchableOpacity,
    ImageBackground,
  } from 'react-native';
import InputField from '../../components/customUIs/InputField';
import PasswordInput from '../../components/customUIs/PasswordInput';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/customUIs/CustomButton';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../util/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Fumi, Sae } from 'react-native-textinput-effects';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { SignUp } from '../../api/auth/SignUp';
import { Button, Dialog } from 'react-native-paper';

const SignupScreen = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const [secureEntry, setSecureEntry] = useState(true);
  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  // test logout
  const { authEmitter } = useAuth();

  useEffect(() => {
      setPassword('');
      setEmail('');
      setName('');
      setPhone('');
      }, []);
  
  const handleSignup = async () => {
    const result = isValidForm(email, password, fullname, phone);
    if (!result) {
      Alert.alert(errorMessage);
    } else {
        const signUpResult = await SignUp({ email, password, fullname, phone });
        if (!signUpResult || signUpResult == false ) {
            Alert.alert("Invalid credentials, Email or phone existed! Please try again!");
            setEmail('');
            setPassword('');
            setName('');
            setPhone('');

        } else {
            //Alert.alert("Please check your email and confirm account activation");
            setTimeout(() => {
                navigation.navigate('LoginScreen');
            }, 3000);
            setVisible(true);
        }
    }
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
        <ImageBackground source={require('../../assets/auth-bg.png')} style={{flex: 1, justifyContent: 'center'}} className='p-4'>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{position: 'absolute', top: 20, left: 20}}>
                <Ionicons name="caret-back-circle-outline" size={40} color="#c05621" />
            </TouchableOpacity>
            <View className='justify-center items-center flex-col bg-white p-2 rounded-xl border border-orange-600'>
              
                <Text className='text-2xl font-bold text-yellow-500 mt-2 mb-2'>Register an account</Text>

                <Fumi className='border border-yellow-500 rounded-xl mt-4 w-80'
                    label={'Your email'}
                    iconClass={MaterialCommunityIcons}
                    iconName={'email'}
                    iconColor={'#f95a25'}
                    iconSize={25}
                    inputPadding={18}
                    onChangeText={email => setEmail(email)}
                    require
                    value={email}
                />
                
                <Fumi className='border border-yellow-500 rounded-xl mt-4 w-80'
                    label={'Your phone'}
                    iconClass={MaterialCommunityIcons}
                    iconName={'phone'}
                    iconColor={'#f95a25'}
                    iconSize={25}
                    inputPadding={18}
                    onChangeText={phone => setPhone(phone)}
                    keyboardType="numeric"
                    require
                    value={phone}
                />

                <Fumi className='border border-yellow-500 rounded-xl mt-4 w-80'
                    label={'Full name'}
                    iconClass={MaterialCommunityIcons}
                    iconName={'account'}
                    iconColor={'#f95a25'}
                    iconSize={25}
                    inputPadding={18}
                    onChangeText={fullname => setName(fullname)}
                    require
                    value={fullname}
                />

              <View className='flex flex-row justify-center items-center text-black bg-white space-x-1 p-1 mb-4 mt-4 w-80 h-16 border border-gray-600 rounded-2xl'>
                <Ionicons
                    name="shield-checkmark"
                    size={24}
                    color="#9ca3af"
                    style={{ marginRight: 5 }}
                  />
                  <View className='flex flex-col'>
                    <View className='flex flex-row items-center'>
                      <Sae className='bg-white w-60 h-10 text-black'
                        secureTextEntry={secureEntry}
                        label={'Password'}
                        labelStyle={{ color: '#6b7280' }}
                        
                        //keyboardType="password"
                        inputStyle={{ color: 'black' }}
                        inputPadding={10}
                        labelHeight={20}
                        iconClass={MaterialCommunityIcons}
                        iconName={'pencil'}
                        iconColor={'#000'}
                        borderHeight={2}
                        height={35}
                        require
                        onChangeText={(password) => setPassword(password)}
                        value={password}
                      />
                      {password ? (
                        <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                          <Ionicons className='mt-4' name={secureEntry ? 'eye-off' : 'eye'} size={24} color="black" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    
                    <View className='mt-4'></View>
                </View>
              </View>

              <TouchableOpacity className='flex justify-center items-center mt-4 mb-2 bg-yellow-500 p-2 h-12 w-80 text-xl rounded-2xl' onPress={handleSignup}>
                <Text className='text-white text-lg font-bold'>Register new account </Text>
              </TouchableOpacity>
              
            </View>
            <Dialog style={{ backgroundColor: '#F0FFF4' }} visible={visible} onDismiss={hideDialog}>
              <Dialog.Icon icon="sticker-check-outline" size={35} color='green' />
              <Dialog.Title className="text-center text-green-600 font-semibold">Create account successfully!</Dialog.Title>
              <Dialog.Content>
                <Text className='text-center text-green-600' >Congratulation! You have successfully created an account! Lets go to login!</Text>
              </Dialog.Content>
            </Dialog>
            
        </ImageBackground>
    )
}

export default SignupScreen