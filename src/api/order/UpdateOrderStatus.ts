import axios from "axios";
import { BASE_URL } from "../config";
import { ParseJSON } from "../auth/parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UpdateOrderStatus = async (orderId: string, status: number) => {

    const UpdateOrderStatusUrl = BASE_URL + `/orders/${orderId}/${status}`;

    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);

    const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: UpdateOrderStatusUrl,
        headers: {
            'Authorization': `Bearer ${parseToken}`
        }
    };
    try {
        const response = await axios.request(config);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
