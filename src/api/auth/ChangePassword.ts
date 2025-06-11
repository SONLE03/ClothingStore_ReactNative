import axios from 'axios';
import { BASE_URL } from '../config';
import { ParseJSON } from './parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChangePassword = async (email: string, password: string, repeatPassword: string) => {

    const ChangePasswordUrl = BASE_URL + `/auth/resetPassword`;
    
    let data = JSON.stringify({
        password,
        repeatPassword
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: ChangePasswordUrl,
        headers: { 
            'Content-Type': 'application/json',
        },
        data : data
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        //throw error;
        return false;
    }
};