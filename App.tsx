import { StyleSheet, Text, View } from "react-native";
import React from "react";

//Navigators
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./src/navigation/TabNavigator";

//Auth Screen
import LoginScreen from "./src/screens/Auth/Signin";
import IntroductionAnimationScreen from "./src/screens/Auth/IntroductionAnimationScreen";
import SignupScreen from "./src/screens/Auth/Signup";
import WelcomeScreen from "./src/screens/Auth/Welcome";
import CustomIcon from "./src/components/CustomIcon";

// import SignupScreen from "./src/screens/Auth/Signup";
// import LoginScreen from "./src/screens/LoginScreen";

//Main Screen
import HomeScreen from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import PaymentScreen from "./src/screens/PaymentScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown:false }}>
        {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
        {/* <Stack.Screen name="IntroductionAnimationScreen" component={IntroductionAnimationScreen} /> */}
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
        {/* <Stack.Screen name="SignupScreen" component={SignupScreen} /> */}
        <Stack.Screen name="Tab" component={TabNavigator} options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen name="Details" component={DetailsScreen} options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen name="Payment" component={PaymentScreen} options={{animation: 'slide_from_bottom'}} ></Stack.Screen>
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});