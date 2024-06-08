import axios from 'axios';
import FormData from 'form-data';
import { BASE_URL } from '../config';
import { ParseJSON } from '../auth/parseJSON';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageFile {
    uri: string;
    type: string;
    name: string;
}

export const EditUser = async (
    userId: string,
    phone: string,
    fullName: string,
    image?: ImageFile
): Promise<any> => {
    const url = `${BASE_URL}/users/${userId}`;
    const accessToken = await AsyncStorage.getItem('access_token');

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const parseToken = ParseJSON(accessToken);
    const data = new FormData();

    data.append('phone', phone);
    data.append('fullName', fullName);
    if (image) {
        data.append('image', {
            uri: image.uri,
            type: image.type,
            name: image.name,
        });
    }

    const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'Authorization': `Bearer ${parseToken}`,
            'Content-Type': 'multipart/form-data',
        },
        data: data,
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        
    }
};
