import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export const AddProductToFavourite = async (customerId: string, productItemId: string) => {
  const AddCartUrl = BASE_URL + `/favorites/${customerId}`;

  //console.log(AddCartUrl);

//   const data = JSON.stringify({
//     productItemId,
//   });

  const response = await axios.post(AddCartUrl, JSON.stringify({productItemId}), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
