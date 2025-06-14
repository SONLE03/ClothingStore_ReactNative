import axios from "axios";
import { BASE_URL } from "../config";

export const GetCartInfo = async (user_id: string) => {
    // Remove quotes from user_id if they exist
    const cleanUserId = user_id.replace(/['"]/g, '');
    const GetCartUrl = BASE_URL + `/cart/${cleanUserId}`;
    console.log('GetCartInfo URL:', GetCartUrl);
    // const accessToken = await AsyncStorage.getItem('access_token');
    // if (!accessToken) {
    //     throw new Error('No access token found');
    // }

    // const parseToken = ParseJSON(accessToken);

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GetCartUrl,
        headers: {
            // 'Authorization': `Bearer ${parseToken}`,
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