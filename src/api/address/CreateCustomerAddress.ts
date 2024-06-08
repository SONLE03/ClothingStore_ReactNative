import axios from "axios";
import { BASE_URL } from "../config";
import { AddressRequest } from "../../types";
import { ParseJSON } from "../auth/parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CreateCustomerAddress = async (customer: string, addressRequest: AddressRequest) => {
    const customerId = ParseJSON(customer);
    const AddAddressUrl = BASE_URL + `/address/${customerId}`;
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    
    const parseToken = ParseJSON(accessToken);

    // const data = JSON.stringify({
    //     phone: addressRequest.phone,
    //     province: addressRequest.province,
    //     district: addressRequest.district,
    //     ward: addressRequest.ward,
    //     specificAddress: addressRequest.specificAddress,
    // });
    // console.log(data)
    
    console.log(AddAddressUrl)
    try {
        const response = await axios.post(AddAddressUrl, JSON.stringify(addressRequest), {
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