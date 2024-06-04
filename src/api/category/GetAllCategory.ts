import axios, { AxiosResponse } from "axios";
import { Category } from "../../types";
//import { ParseJSON } from "../../auth/ParseJSON";

const GetCategoryURL = process.env.NEXT_PUBLIC_API_ENDPOINT + '/category';
//const accessToken = localStorage.getItem('access_token');

export const GetAllCategory = async (): Promise<Category[]> => {

    // if (!accessToken) {
    //     throw new Error('No access token found');
    // }

    // const parseToken = ParseJSON(accessToken);
    
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://10.0.2.2:8080/api/v1/category',
            headers: {
              //"Authorization": `Bearer ${parseToken}`,
            }
          };
        
          const response: AxiosResponse<Category[]> = await axios.request(config);
          return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Get all Category failed');
    }
};
    