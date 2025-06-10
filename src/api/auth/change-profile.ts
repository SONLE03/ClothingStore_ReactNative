import axios from 'axios';
import {BASE_URL} from '../config';
import {ParseJSON} from '../auth/ParseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const EditUser = async (
  userId: string,
  phoneNumber: string,
  fullName: string,
  dateOfBirth: string,
): Promise<any> => {
  // Remove quotes from userId if they exist
  const cleanUserId = userId.replace(/['"]/g, '');
  const url = BASE_URL + `/staff/${cleanUserId}`;
  console.log('EditUser URL:', url);

  const accessToken = await AsyncStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${parseToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        dateOfBirth,
        phoneNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('EditUser error:', error);
    throw error; // Re-throw for better error handling
  }
};