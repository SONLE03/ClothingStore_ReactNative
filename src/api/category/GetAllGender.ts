import axios, { AxiosResponse } from "axios";
//import envConfig from "@/src/config";
import { Gender } from "../../types";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ParseJSON } from "../auth/parseJSON";
//import { ParseJSON } from "../../auth/ParseJSON";

const BranchURL = process.env.NEXT_PUBLIC_API_ENDPOINT + '/productGender';
//const accessToken = localStorage.getItem('access_token');

export const GetAllGender = async (): Promise<Gender[]> => {

    const GetAllGenderURL = BASE_URL + '/productGender';
  const accessToken = await AsyncStorage.getItem('access_token');
  
  if (!accessToken) {
      throw new Error('No access token found');
  }

  const parseToken = ParseJSON(accessToken);

    
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: GetAllGenderURL,
            headers: {
               "Authorization": `Bearer ${parseToken}`,
            }
          };
        
          const response: AxiosResponse<Gender[]> = await axios.request(config);
          return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Get all Product Gender failed');
    }
};
    