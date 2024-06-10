import axios from "axios";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ParseJSON } from "../auth/parseJSON";

export const GetFavouriteList = async (user_id: string) => {
    const GetCartUrl = BASE_URL + `/favorites/${user_id}`;
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
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
}