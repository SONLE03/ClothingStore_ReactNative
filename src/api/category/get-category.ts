import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../../types';
import { ParseJSON } from '../auth/parseJSON';

const GetCategoryURL = BASE_URL + '/category';
export const GetAllCategory = async (): Promise<Category[]> => {
  const accessToken = await AsyncStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);

  try {
    const config = {
      method: 'GET',
      maxBodyLength: Infinity,
      url: GetCategoryURL,
      headers: {
        Authorization: `Bearer ${parseToken}`,
      },
    };

    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error('Get all Category failed');
  }
};
