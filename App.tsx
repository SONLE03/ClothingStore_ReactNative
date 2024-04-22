import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/Auth/Signin";
import IntroductionAnimationScreen from "./src/screens/Auth/IntroductionAnimationScreen";
import SignupScreen from "./src/screens/Auth/Signup";
import WelcomeScreen from "./src/screens/Auth/Welcome";
// import SignupScreen from "./src/screens/Auth/Signup";
// import LoginScreen from "./src/screens/LoginScreen";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        {/* <Stack.Screen name="IntroductionAnimationScreen" component={IntroductionAnimationScreen} /> */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});