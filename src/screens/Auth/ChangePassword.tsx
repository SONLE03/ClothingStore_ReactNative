import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChangePassword} from '../../api/auth/ChangePassword';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ParseJSON} from '../../api/auth/parseJSON';

const ChangePasswordScreen = ({navigation}: any) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const handleChangePassword = async () => {
    if (password !== repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    try {
      const email = await AsyncStorage.getItem('email');
      if (!email) {
        throw new Error('No email found');
      }
      console.log(email);
      const parseEmail = ParseJSON(email);
      await ChangePassword(email, password, repeatPassword);
      Alert.alert('Success', 'Password changed successfully.');
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        setTimeout(() => {
          navigation.navigate('LoginScreen');
        }, 2000);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
  };

  return (
    <ImageBackground
      className="flex-1 justify-center items-center bg-white p-4"
      source={require('../../assets/auth-bg.png')}>
      <TouchableOpacity
        className="mb-4 absolute top-0 left-0 p-4"
        onPress={() => navigation.goBack()}>
        <Ionicons name="caret-back-circle-outline" size={40} color="#c05621" />
      </TouchableOpacity>
      <View className="w-full max-w-md p-5 bg-white rounded-xl border-2 border-orange-400 flex">
        <Text className="text-xl font-semibold mb-4 text-center">
          Change Password
        </Text>

        <View
          className={`flex-row items-center justify-between border py-1 px-2 rounded-xl focus:border-orange-400 mb-4 ${
            error ? 'border-red-500' : 'border-gray-400'
          }`}>
          <TextInput
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntry}
          />
          {password ? (
            <TouchableOpacity
              className=""
              onPress={() => setSecureEntry(prev => !prev)}>
              <Ionicons
                className="mt-4"
                name={secureEntry ? 'eye-off' : 'eye'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          className={`flex-row items-center justify-between border py-1 px-2 rounded-xl focus:border-orange-400 mb-4 ${
            error ? 'border-red-500' : 'border-gray-400'
          }`}>
          <TextInput
            placeholder="Retype New Password"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry={secureEntry}
          />

          {repeatPassword ? (
            <TouchableOpacity
              className=""
              onPress={() => setSecureEntry(prev => !prev)}>
              <Ionicons
                className="mt-4"
                name={secureEntry ? 'eye-off' : 'eye'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {error && <Text className="text-red-500 mt-0">{error}</Text>}
        <TouchableOpacity
          className="bg-yellow-500 rounded-xl p-3 mt-4"
          onPress={handleChangePassword}>
          <View className="flex flex-row justify-center items-center ">
            <Text className="text-white text-center font-semibold text-lg">
              Change Password{' '}
            </Text>
            <Ionicons name="checkmark-circle-outline" size={25} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ChangePasswordScreen;
