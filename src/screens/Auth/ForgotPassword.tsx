import React, { useState, useRef } from 'react';
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
import { SendOtp } from '../../api/auth/SendEmailOTP';
import { VerifyOtp } from '../../api/auth/VerifyOTP';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from '@react-navigation/native';


const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const inputs = useRef<any[]>([]);

    const handleSendOtp = async () => {
        if (!email.endsWith('@gmail.com')) {
            setError('Please enter a valid Gmail address (tag: @gmail.com).');
            return;
        }

        setError('');
        try {
            await SendOtp(email);
            await AsyncStorage.setItem('email', email);
            setOtpSent(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        console.log(otpString);
        try {
            await VerifyOtp(otpString, email);
            navigation.navigate('ChangePassword');
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    return (
        <ImageBackground className="flex-1 justify-center items-center bg-white p-4" source={require('../../assets/auth-bg.png')}>
            <TouchableOpacity className="mb-4 absolute top-0 left-0 p-4" onPress={() => navigation.goBack()}><Ionicons name="caret-back-circle-outline" size={40} color="#c05621" /></TouchableOpacity>
            {!otpSent ? (
                <View className="w-full max-w-md p-5 bg-white rounded-xl border-2 border-orange-400 flex">
                    <Text className="text-xl font-semibold mb-4 text-center text-black">Verify Email</Text>
                    <TextInput
                        className={`border p-3 text-gray-500 rounded-xl text-xl ${error ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor={"gray"}
                    />
                    {error && <Text className="text-red-500 mt-2">{error}</Text>}
                    <TouchableOpacity
                        className="bg-orange-400 rounded-xl p-3 mt-4"
                        onPress={handleSendOtp}
                    >
                        <View className="flex flex-row justify-center items-center ">
                            <Text className='text-white text-center font-semibold text-lg'>Send Email OTP </Text>
                            <Ionicons name="mail-unread-outline" size={25} color="white" />
                        </View>
                    </TouchableOpacity>
                    {/* <Link to="/LoginScreen" style={{ color: 'orange', alignSelf: 'center', marginTop: 10, fontWeight: 'bold', textDecorationLine: 'underline' }}>Back to login</Link> */}
                </View>
            ) : (
                <View className="w-full max-w-md p-5 bg-white rounded-xl border-2 border-orange-400">
                    <Text className="text-xl font-semibold mb-4 text-center text-black">Enter OTP</Text>
                    <View className="flex-row justify-between mb-4">
                        {otp.map((value, index) => (
                            <TextInput
                                key={index}
                                className="border text-gray-500 border-gray-400 rounded w-10 h-10 text-center"
                                value={value}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                ref={(el) => (inputs.current[index] = el)}
                                placeholderTextColor={"gray"}
                            />
                        ))}
                    </View>
                    <TouchableOpacity
                        className="bg-orange-400 rounded-xl p-3 mt-4"
                        onPress={handleVerifyOtp}
                    >
                        <View className="flex flex-row justify-center items-center ">
                            <Text className='text-white text-center font-semibold text-lg'>Check OTP </Text>
                            <Ionicons name="checkmark-circle-outline" size={25} color="white" />
                        </View>
                    </TouchableOpacity>
                    {/* <Link to="/ChangePassword" style={{ color: 'orange', alignSelf: 'center', marginTop: 10, fontWeight: 'bold', textDecorationLine: 'underline' }}>test</Link> */}
                </View>
            )}
        </ImageBackground>
    );
};

export default ForgotPasswordScreen;
