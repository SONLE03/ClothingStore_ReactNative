import React from 'react'
import {
    Image,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
  } from 'react-native';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/PasswordInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import { supabase } from '../../service/supabase';
import { signup } from '../../service/UserService';
const SignupScreen = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        setPassword('');
        setEmail('');
        setName('');
        setPhone('');
        }, []);
    
    const handleSignup = async() => {
      const result = isValidForm(email, password, name, phone)
      if(!result){
        Alert.alert(errorMessage);
      }else{
        const data = signup({email, password, name, phone})
        // if(!data){
        //   Alert.alert("Signin successfully")
        // }
      }
    };

    const isValidEmail = email => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return emailRegex.test(email);
    };

    const isValidPassword = password => {
      return password.length >= 8;
    };
    
    const isValidPhone= phone => {
      return phone.length === 10;
    };

    const isValidForm = (email, password, fullname, phone) => {
      if(!isValidEmail(email) || !isValidPassword(password) || !isValidPhone(phone)){
        setErrorMessage('Input is malformed');
        return false;
      }
      
      if(email === '' || password === '' || fullname === '' || phone === ''){
        setErrorMessage('Lack of information!');
        return false;
      }
      return true;
    };

    return (
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
                    name="alternate-email"
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
                <CustomButton label={"Sign in"} onPress={handleSignup}/>
            </View>

        </SafeAreaView>
    )
}

export default SignupScreen

