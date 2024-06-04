import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SignupScreen from "../screens/Auth/Signup";
const Stack = createNativeStackNavigator();


const HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="SignupScreen" screenOptions={{ headerShown:false }}>
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          
        </Stack.Navigator>
    );
  };
export default HomeNavigator;