import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export const AddProductToFavourite = async (customerId: string, productIds: string[]) => {
  const AddCartUrl = BASE_URL + `/favorite/${customerId}/${productIds}`;

  const accessToken = await AsyncStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parseToken = JSON.parse(accessToken);
  try{
    const response = await axios.post(AddCartUrl, JSON.stringify({productIds}), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
    });

    return response.data;
    
  }
  catch (error)
  {
    console.log(error);
    return false;
  }
};
