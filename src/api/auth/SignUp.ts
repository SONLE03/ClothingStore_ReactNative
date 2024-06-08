import axios from "axios";
import { BASE_URL } from "../config";
import { ParseJSON } from "../auth/parseJSON";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignUpProps {
    email: string;
    password: string;
    fullname: string;
    phone: string;
}

const envSignUp = BASE_URL + "/auth/signup";

export const SignUp = async ({ email, password, fullname, phone }: SignUpProps) => {

    try {
        const response = await axios.post(envSignUp, {
            email,
            password,
            fullname,
            phone
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
    