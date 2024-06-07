import axios from 'axios';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';


const getVNPayUrl = BASE_URL + '/vnpay/submitOrder';

export const GetVNPayUrl = async (amount: number, orderInfo: string, orderId: string) => {

    const accessToken = await AsyncStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parsedToken = JSON.parse(accessToken);
  const data = qs.stringify({
    amount,
    orderInfo,
    orderId,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: getVNPayUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${parsedToken}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data; // This should be the URL
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get VNPay URL');
  }
};
