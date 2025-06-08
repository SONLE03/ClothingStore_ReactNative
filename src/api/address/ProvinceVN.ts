// api/GetProvinces
import axios from 'axios';

const BASE_API_URL = 'https://vapi.vnappmob.com/api/v2/';

export const GetProvinces = async () => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}province/`,
      headers: {},
        
    };

    const response = await axios.request(config);
    //console.log(JSON.stringify(response.data));
    return response.data.results;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch provinces');
  }
};

// api/GetDistrictsByProvince

export const GetDistrictsByProvince = async (province_id: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}province/district/${province_id}`);
    return response.data.results;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch districts');
  }
};

// api/GetWardsByDistrict

export const GetWardsByDistrict = async (district_id: string) => {
  try {
    const response = await axios.get(BASE_API_URL + `province/ward/${district_id}`);
    return response.data.results;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch wards');
  }
};
