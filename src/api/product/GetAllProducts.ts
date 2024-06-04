"use client";
import axios, { AxiosResponse } from 'axios';
import { Product } from '../../types';

const ProductURL = process.env.NEXT_PUBLIC_API_ENDPOINT + 'products';
//const accessToken = localStorage.getItem('access_token');

export const GetAllProducts = async (): Promise<AxiosResponse<Product[]>> => {
      
    //   if (!accessToken) {
    //       throw new Error('No access token found');
    //   }
  
    //   const parseToken = ParseJSON(accessToken);
      
      try {
          const config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: 'http://10.0.2.2:8080/api/v1/products',
              headers: {
                //"Authorization": `Bearer ${parseToken}`,
              }
            };
          
            const response: AxiosResponse<Product[]> = await axios.request(config);
            return response;
      } catch (error) {
          console.error(error);
          throw new Error('Get all products failed');
      }
}
