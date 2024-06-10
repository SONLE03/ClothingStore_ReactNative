import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export const EditProductInCart = async (customerId: string, productItemId: string, quantity: number) => {
  const AddCartUrl = BASE_URL + `/carts/${customerId}`;

  //console.log(AddCartUrl);
  try{
    const data = JSON.stringify({
      productItemId,
      quantity
    });

    const response = await axios.put(AddCartUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }catch(error)
  {
    return false;
  }
};
