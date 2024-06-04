import axios, { AxiosResponse } from "axios";
//import envConfig from "@/src/config";
import { Gender } from "../../types";
//import { ParseJSON } from "../../auth/ParseJSON";

const BranchURL = process.env.NEXT_PUBLIC_API_ENDPOINT + '/productGender';
//const accessToken = localStorage.getItem('access_token');

export const GetAllGender = async (): Promise<Gender[]> => {

    // if (!accessToken) {
    //     throw new Error('No access token found');
    // }

    // const parseToken = ParseJSON(accessToken);
    
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://10.0.2.2:8080/api/v1/productGender',
            headers: {
            //   "Authorization": `Bearer ${parseToken}`,
            }
          };
        
          const response: AxiosResponse<Gender[]> = await axios.request(config);
          return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Get all Product Gender failed');
    }
};
    