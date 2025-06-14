import axios from 'axios';
import {BASE_URL} from '../config';
import {ParseJSON} from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetDetailProduct = async (productId: string) => {
  const GetProductUrl = BASE_URL + `/product/${productId}`;
  const accessToken = await AsyncStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: GetProductUrl,
    headers: {
      Authorization: `Bearer ${parseToken}`,
    },
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};
