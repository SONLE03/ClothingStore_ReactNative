import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { CartItems } from '../../types';

export const DeleteProductInCart = async (cartId : string): Promise<CartItems[]> => {
  // Remove quotes from cartId if they exist
  const cleanCartId = cartId.replace(/['"]/g, '');
  const DeleteCartUrl = BASE_URL + `/carts/${cleanCartId}`;
  const accessToken = await AsyncStorage.getItem('access_token');
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
    });

    return response.data;

  } catch (error) {
    console.log(error);
    return [];
  }

};
