import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import ProductListScreen from "../screens/ProductListScreen";
import OrderScreen from "../screens/OrderScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

const MainStackNavigator=() =>{
    return (
        <Stack.Navigator>
            <Stack.Screen name="home-screen" component={HomeScreen}/>
            <Stack.Screen name="detai;-screen" component={DetailScreen}/>
            <Stack.Screen name="product-screen" component={ProductListScreen}/>

        </Stack.Navigator>
    )
}

const CartStackNavigator = () =>{
    return (
        <Stack.Navigator>
            <Stack.Screen name="cart-screen" component={CartScreen}/>
            
        </Stack.Navigator>
    )
}

const OrderStackNavigator = () =>{
    return (
        <Stack.Navigator>
            <Stack.Screen name="order-screen" component={OrderScreen}/>
            
        </Stack.Navigator>
    )
}

const ProfileStackNavigator = () =>{
    return (
        <Stack.Navigator>
            <Stack.Screen name="profile-screen" component={ProfileScreen}/>
            
        </Stack.Navigator>
    )
}

export {MainStackNavigator, CartStackNavigator, OrderStackNavigator, ProfileStackNavigator}