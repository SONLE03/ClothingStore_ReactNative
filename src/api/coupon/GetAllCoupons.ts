import axios from 'axios';
import { BASE_URL } from '../config';
import { ExistedCoupon } from '../../types';
import { ParseJSON } from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GetAllCouponsUrl = BASE_URL + '/coupons';

export const GetAllCoupons = async () => {
    
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);

    const config = {
        method: 'get',
        url: GetAllCouponsUrl,
        headers: {
            'Authorization': `Bearer ${parseToken}`,
        }
    };
    try {
        const response = await axios.request<ExistedCoupon[]>(config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


