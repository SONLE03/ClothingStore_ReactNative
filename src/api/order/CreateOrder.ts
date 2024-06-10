import axios from 'axios';
import { BASE_URL } from '../config';
import { CreateOrderRequest } from '../../types';
import { ParseJSON } from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';




export const CreateOrder = async (order: CreateOrderRequest) => {

    const CreateOrderUrl = BASE_URL + '/orders';
    const accessToken = await AsyncStorage.getItem('access_token');
    console.log(order);
    if (accessToken) {
        const parsedToken = ParseJSON(accessToken);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: CreateOrderUrl,
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${parsedToken}`
            },
            data: JSON.stringify(order)
        };

        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            console.error(error);
            //throw new Error('Failed to create order');
            return false;
        }
    }
};
