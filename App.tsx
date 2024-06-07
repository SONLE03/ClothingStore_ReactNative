import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { useAuth } from "./src/util/AuthContext";
import { AuthProvider } from "./src/util/AuthContext";
import HomeNavigator from "./src/navigation/HomeNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import TabNavigator from "./src/navigation/TabNavigator";

import DetailsScreen from "./src/screens/DetailsScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import OrderScreen from "./src/screens/OrderScreen";
import VNPayScreen from "./src/screens/VNPay";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <AuthContainer />
    </AuthProvider>
  );
};

const AuthContainer = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      {isLoggedIn ? <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="ProductDetailsScreen"
          component={ProductDetailsScreen}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="VNPayScreen"
          component={VNPayScreen}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
      </Stack.Navigator> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;