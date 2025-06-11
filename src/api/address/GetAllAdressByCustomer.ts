import axios from "axios";
import { BASE_URL } from "../config";
import { AddressInfo } from "../../types";
import { ParseJSON } from "../auth/parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetAllAdressByCustomer = async ( user_id: string) => {

    const GetAllAdressByCustomerUrl = BASE_URL + `/user/address/${user_id}`;
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GetAllAdressByCustomerUrl,
        headers: {
            'Authorization': `Bearer ${parseToken}`
        },
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }

}