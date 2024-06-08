const loginUser = async (username: string, password: string) => {
    const envLogin = "http://10.0.2.2:8080/api/v1/auth/login"
    try {
      const response = await fetch(envLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      //throw new Error('Đã xảy ra lỗi khi đăng nhập');
    }
  };
  
export default loginUser;