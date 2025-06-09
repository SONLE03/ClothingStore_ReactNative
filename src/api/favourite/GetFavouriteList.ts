import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ParseJSON } from "../auth/parseJSON";
import { Product } from '../../types';

export const GetFavouriteList = async (user_id: string) : Promise<AxiosResponse<Product[]>> => {
    const GetCartUrl = BASE_URL + `/favorite/${user_id}`;
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GetCartUrl,
        headers: {
            'Authorization': `Bearer ${parseToken}`,
        },
    };

    try {
        console.log("OK")
        const response: AxiosResponse<Product[]> = await axios.request(config);
        console.log(response)
        return response;
    } catch (error) {
        console.log(error);
        throw new Error('Get all products failed');
    }
}