import React, { useState } from 'react';
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
import { ChangePassword } from '../../api/auth/ChangePassword';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ChangePasswordScreen = ({ navigation }: any) => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

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
            await ChangePassword(email, password, repeatPassword);
            Alert.alert('Success', 'Password changed successfully.');
            setTimeout(() => {
                navigation.navigate('LoginScreen');
            }, 3000);
        } catch (error) {
            Alert.alert('Error', 'Failed to change password. Please try again.');
        }
    };

    return (
        <ImageBackground className="flex-1 justify-center items-center bg-white p-4" source={require('../../assets/auth-bg.png')}>
            <View className="w-full max-w-md p-5 bg-white rounded-xl border-2 border-orange-400 flex">
                <Text className="text-xl font-semibold mb-4 text-center">Change Password</Text>
                <TextInput
                    className="border border-gray-400 p-3 mb-4 focus:border-orange-400 rounded-xl"
                    placeholder="New Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    className={`border p-3 rounded-xl focus:border-orange-400 mb-4 ${error ? 'border-red-500' : 'border-gray-400'}`}
                    placeholder="Retype New Password"
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                    secureTextEntry
                />
                {error && <Text className="text-red-500 mt-0">{error}</Text>}
                <TouchableOpacity
                    className="bg-orange-500 rounded-xl p-3 mt-4"
                    onPress={handleChangePassword}
                >
                    <View className="flex flex-row justify-center items-center ">
                            <Text className='text-white text-center font-semibold text-lg'>Change Password </Text>
                            <Ionicons name="checkmark-circle-outline" size={25} color="white" />
                        </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default ChangePasswordScreen;
