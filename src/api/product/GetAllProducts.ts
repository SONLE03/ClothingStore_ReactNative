"use client";
import axios, { AxiosResponse } from 'axios';
import { Product } from '../../types';
import { BASE_URL } from '../config';
import { ParseJSON } from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductURL = process.env.NEXT_PUBLIC_API_ENDPOINT + 'products';
//const accessToken = localStorage.getItem('access_token');

export const GetAllProducts = async (): Promise<AxiosResponse<Product[]>> => {
      
  const GetProductURL = BASE_URL + '/products';
  const accessToken = await AsyncStorage.getItem('access_token');
  
  if (!accessToken) {
      throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);

      
      try {
          const config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: GetProductURL, 
              headers: {
                "Authorization": `Bearer ${parseToken}`,
              }
            };
          
            const response: AxiosResponse<Product[]> = await axios.request(config);
            return response;
      } catch (error) {
          console.error(error);
          throw new Error('Get all products failed');
      }
}
