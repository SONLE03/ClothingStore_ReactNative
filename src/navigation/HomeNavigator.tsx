import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SignupScreen from "../screens/Auth/Signup";
import CartScreen from "../screens/CartScreen";


const Stack = createNativeStackNavigator();

const HomeNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="SignupScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
            name="CartScreen"
            component={CartScreen}
        
            ></Stack.Screen>
            
        </Stack.Navigator>
    );
};

export default HomeNavigator;
