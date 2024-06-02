import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "./src/util/AuthContext";
import { AuthProvider } from "./src/util/AuthContext";
import HomeNavigator from "./src/navigation/HomeNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

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
      {isLoggedIn ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;