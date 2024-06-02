import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter } from 'react-native';

// Định nghĩa kiểu cho context
interface AuthContextProps {
  isLoggedIn: boolean;
  authEmitter: NativeEventEmitter;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const authEmitter = new NativeEventEmitter();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    const subscription = authEmitter.addListener('loginStatusChanged', checkLoginStatus);

    return () => {
      subscription.remove(); // Loại bỏ listener khi component bị hủy
    };
  }, []);

  const checkLoginStatus = async () => {
    try {
      const access_token = await AsyncStorage.getItem('access_token');
      setIsLoggedIn(!!access_token);
    } catch (error) {
      console.log('Error retrieving access_token: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, authEmitter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
