import axios from "axios";
import { BASE_URL } from "../config";
import { ParseJSON } from "../auth/parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetAllOrderByCustomer = async (customerId: string) => {

    const GetAllOrderByCustomerUrl = BASE_URL + `/orders/customer/${customerId}`;
    const token = await AsyncStorage.getItem("access_token");
    
    if (!token) {
        throw new Error("No access token found");
    }

    const parseToken = ParseJSON(token);
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: GetAllOrderByCustomerUrl,
        headers: {
            "Authorization": `Bearer ${parseToken}`,
        },
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}