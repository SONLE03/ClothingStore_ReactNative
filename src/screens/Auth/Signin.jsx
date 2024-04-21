import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import PasswordInput from "../../components/PasswordInput";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
// import React from 'react';
import {
  Image,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleRegister = () => {
    navigation.navigate('SignupScreen'); // Chuyển sang màn hình RegisterScreen
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = () => {
    // Hiển thị thông báo chứa email và password đã được cập nhật từ state
    Alert.alert('Thông tin đăng nhập', `Email: ${email}\nPassword: ${password}`);
  };

  return ( 
        // return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>

        <InputField
          label={'Email ID'}
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
        
        <CustomButton label={"Login"} onPress={handleLogin}/>

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
           {/* <Image source={require('../../assets/images/misc/google.svg')} /> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            {/* <Image source={require('../../assets/images/misc/google.svg')} /> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            {/* <Image source={require('../../assets/images/misc/google.svg')} /> */}
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  // );
// };
  );
};

export default LoginScreen;

