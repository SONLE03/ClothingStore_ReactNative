import axios from 'axios';
import FormData from 'form-data';
import {BASE_URL} from '../config';
import { ParseJSON } from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ImageFile {
  uri: string;
  type: string;
  name: string;
}

export const EditUserAvatar = async (
  userId: string,
  image?: ImageFile,
): Promise<any> => {
  // Remove quotes from userId if they exist
  const cleanUserId = userId.replace(/['"]/g, '');
  const url = BASE_URL + `/user/avatar/${cleanUserId}`;
  const accessToken = await AsyncStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);
  const data = new FormData();
  if (image) {
    data.append('avatar', {
      uri: image.uri,
      type: image.type,
      name: image.name,
    });
  }

  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      Authorization: `Bearer ${parseToken}`,
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};