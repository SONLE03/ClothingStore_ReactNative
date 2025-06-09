import { Alert } from "react-native";
import { BASE_URL } from "../config";

const loginUser = async (email: string, password: string) => {
    const envLogin = BASE_URL + "/auth/signin"
    // const email = username;
    // const checkRole = BASE_URL + `/auth/${email}`;
    try {
      // const role = await fetch(checkRole, {
      //   method: 'GET',
      //   headers: {},
      // });
      // const roleData = await role.json();
      // if (roleData != 2) {
      //   Alert.alert('Unable to log in without customer account');
      //   return false;
      // }
      const response = await fetch(envLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      //throw new Error('Đã xảy ra lỗi khi đăng nhập');
      return false;
    }
  };
  
export default loginUser;