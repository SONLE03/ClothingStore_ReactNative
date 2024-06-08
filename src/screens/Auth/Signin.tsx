import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import loginUser from '../../api/auth/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../util/AuthContext';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';


const LoginScreen = ({navigation} : any) => {
  //const navigation = useNavigation();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { authEmitter } = useAuth();
  const [secureEntry, setSecureEntry] = useState(true);

  useEffect(() => {
    setUserName('');
    setPassword('');
  }, []);

  const handleRegister = () => {
    navigation.navigate('SignupScreen');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Lack of information');
    } else {
      const data = await loginUser(username, password);
      console.log(data);
      console.log(username, password);
      if (!data) {
        Alert.alert('User login failed!');
      } else {
        try {
          await AsyncStorage.setItem('access_token', JSON.stringify(data.access_token));
          await AsyncStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
          await AsyncStorage.setItem('user_id', JSON.stringify(data.id));
          await AsyncStorage.setItem('role', JSON.stringify(data.role));
          console.log(AsyncStorage.getItem('access_token'));
          authEmitter.emit('loginStatusChanged');
          //navigation.navigate('HomeScreen' as never);
        } catch (error) {
          console.log('Error signing in: ', error);
        }
      }
    }
  };

  return (
    
      <ImageBackground source={require('../../assets/login-bg.png')} className='flex-1 h-screen justify-center items-center'>
        <View className='flex flex-col mt-32 rounded-2xl border-2 border-orange-300 p-2 bg-white shadow-2xl'>
          <View className='flex flex-row justify-center items-center bg-white space-x-1 p-1 mb-8 w-80 h-16 border border-gray-600 rounded-2xl'>
            <MaterialIcons
                  name="email"
                  size={30}
                  color="#666"
                  style={{ marginRight: 5 }}
                />
            <View className='flex flex-col'>
              <Sae className='bg-white w-60 h-10'
                label={'Email Address'}
                labelStyle={{ color: '#000' }}
                keyboardType="email-address"
                inputPadding={10}
                inputStyle={{ color: 'black' }}
                labelHeight={20}
                iconClass={FontAwesomeIcon}
                iconName={'pencil'}
                iconColor={'#000'}
                borderHeight={2}
                height={35}
                // TextInput props
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={(email) => setUserName(email)}
                
              />
              <View className='mt-4'></View>
            </View>
            </View>

            <View className='flex flex-row justify-center items-center text-black bg-white space-x-1 p-1 mb-4 w-80 h-16 border border-gray-600 rounded-2xl'>
              <Ionicons
                  name="shield-checkmark"
                  size={30}
                  color="#666"
                  style={{ marginRight: 5 }}
                />
                <View className='flex flex-col'>
                  <View className='flex flex-row items-center'>
                    <Sae className='bg-white w-60 h-10 text-black'
                      secureTextEntry={secureEntry}
                      label={'Password'}
                      labelStyle={{ color: '#000' }}
                      
                      //keyboardType="password"
                      inputStyle={{ color: 'black' }}
                      inputPadding={10}
                      labelHeight={20}
                      iconClass={FontAwesomeIcon}
                      iconName={'pencil'}
                      iconColor={'#000'}
                      borderHeight={2}
                      height={35}

                      onChangeText={(password) => setPassword(password)}
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
          <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end' }}>
            <Text className='underline' style={{ color: 'red', fontWeight: '700' }}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity className='flex justify-center items-center mt-8 bg-orange-400 h-12 w-80 text-xl rounded-2xl' onPress={handleLogin}>
            <Text className='text-white text-lg font-bold'>Login </Text>
          </TouchableOpacity>

          <TouchableOpacity className='flex justify-center items-center mt-8 border-orange-500 border-2 h-12 w-80 text-xl rounded-2xl' onPress={() => navigation.navigate('SignupScreen')}>
            <Text className='text-orange-500 text-lg font-bold'>Register new account </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    
  );
};

export default LoginScreen;
