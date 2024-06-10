import axios from 'axios';
import { BASE_URL } from '../config';
import { ParseJSON } from './parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SendOtp = async (email: string) => {

    const Emailurl = BASE_URL + `/email/verifyEmail/${email}`;
    console.log(Emailurl);

    // const accessToken  = await AsyncStorage.getItem('access_token')
    // if (!accessToken) {
    //     throw new Error("No access token found");
    // }
    
    //const parseToken = ParseJSON(accessToken);

    try {
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: Emailurl,
            headers: {
                //'Authorization': `Bearer ${parseToken}`,
            }
        };
    
        return axios.request(config);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error(error);
        //throw error;
        return false;
    }
};

//export default SendOtp;

