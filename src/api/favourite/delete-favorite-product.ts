import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export const DeleteProductInFavourite = async (customerId: string, productIds: string) => {
  const DeleteCartUrl = `${BASE_URL}/favorite/${customerId}/${productIds}`;
  const accessToken = await AsyncStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parseToken = JSON.parse(accessToken);

  try {
    const response = await axios.delete(DeleteCartUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
    });

    return response.data;

  } catch (error) {
    console.error(error);
    return [];
  }
};
