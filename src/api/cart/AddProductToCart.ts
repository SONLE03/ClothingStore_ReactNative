import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

interface AddProductToCartRequest {
  productId: string;
  dimension: string;
  colorId: string;
  quantity: number;
}

export const AddProductToCart = async (customerId: string, addProductToCartRequest: AddProductToCartRequest) => {
  const AddCartUrl = BASE_URL + `/cart/${customerId}`;

  //console.log(AddCartUrl);

  const data = JSON.stringify(addProductToCartRequest);

  const response = await axios.post(AddCartUrl, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
