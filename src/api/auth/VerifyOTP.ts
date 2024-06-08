import axios from "axios";
import { BASE_URL } from "../config";
import { ParseJSON } from "./parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VerifyOtp = async (otp: string, email: string) => {

    const OTPurl = BASE_URL + `/users/verifyOtp/${otp}/${email}`;

    console.log(OTPurl);

    // const accessToken  = await AsyncStorage.getItem('access_token')
    // if (!accessToken) {
    //     throw new Error("No access token found");
    // }
    
    // const parseToken = ParseJSON(accessToken);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: OTPurl,
      headers: {
        //'Authorization': `Bearer ${parseToken}`,
      }
    };
  
    return axios.request(config);
};

