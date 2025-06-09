import axios from 'axios';
import { BASE_URL } from '../config';
//import Cookies from 'js-cookie';
import { ProductItem } from '../../types';
import { ParseJSON } from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetDetailProduct = async (productId: string) => {
    const GetProductUrl = BASE_URL + `/product/${productId}`;
    const accessToken = await AsyncStorage.getItem('access_token');
    
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GetProductUrl,
        headers: {
            'Authorization': `Bearer ${parseToken}`,
        },
    };
    try {
        const response = await axios.request(config);
        console.log(response.data);
        console.log('abc');
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

