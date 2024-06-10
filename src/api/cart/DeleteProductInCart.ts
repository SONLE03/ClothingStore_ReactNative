import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { CartItems } from '../../types';

export const DeleteProductInCart = async (customerId: string, cartItem: CartItems[]): Promise<CartItems[]> => {
  const DeleteCartUrl = BASE_URL + `/carts/${customerId}`;
  const accessToken = await AsyncStorage.getItem('access_token');
  const data = JSON.stringify(cartItem);
  if (!accessToken) {
    throw new Error('No access token found');
    //return [];
  }

  const parseToken = JSON.parse(accessToken);


  //console.log(DeleteCartUrl);

  // const data = JSON.stringify({
  //   cartItems: cartItem,
  // });

  try {
    const response = await axios.delete(DeleteCartUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },    
      data: data
    });

    return response.data;

  } catch (error) {
    console.log(error);
    return [];
  }

};
