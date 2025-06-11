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
  // Remove quotes from customerId if they exist
  const cleanCustomerId = customerId.replace(/['"]/g, '');
  const AddCartUrl = BASE_URL + `/cart/${cleanCustomerId}`;

  console.log('AddProductToCart URL:', AddCartUrl);

  //console.log(AddCartUrl);

  const data = JSON.stringify(addProductToCartRequest);

  const response = await axios.post(AddCartUrl, data, {
    headers: {
      'Content-Type': 'application/json',
      //Authorization: `Bearer ${await AsyncStorage.getItem('access_token')}`,
    },
  });

  return response.data;
};
