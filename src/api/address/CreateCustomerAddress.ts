import axios from "axios";
import { BASE_URL } from "../config";
import { Address } from "../../types";
import { ParseJSON } from "../auth/parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CreateCustomerAddress = async (customerId: string, address: Address) => {
    const AddAddressUrl = BASE_URL + `/customers/${customerId}/addresses`;
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);

    const data = JSON.stringify({
        address
    });
    try {
        const response = await axios.post(AddAddressUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${parseToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Create address failed');
    }
}