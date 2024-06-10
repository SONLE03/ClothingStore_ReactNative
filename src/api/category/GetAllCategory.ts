import axios, { AxiosResponse } from "axios";
import { Category } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import { ParseJSON } from "../auth/parseJSON";


//const GetCategoryURL = process.env.NEXT_PUBLIC_API_ENDPOINT + '/category';
//const accessToken = localStorage.getItem('access_token');

export const GetAllCategory = async (): Promise<Category[]> => {

  const GetAllCategorytURL = BASE_URL + '/category';
  const accessToken = await AsyncStorage.getItem('access_token');
  
  if (!accessToken) {
      throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);

    
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: GetAllCategorytURL,
            headers: {
              "Authorization": `Bearer ${parseToken}`,
            }
          };
        
          const response: AxiosResponse<Category[]> = await axios.request(config);
          return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Get all Category failed');
        //return false;
    }
};
    