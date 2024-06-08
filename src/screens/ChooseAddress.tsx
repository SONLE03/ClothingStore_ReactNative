import React, { useEffect, useState } from "react";

import { View, Text, FlatList, TouchableOpacity, StyleSheet} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { GetAllAdressByCustomer } from "../api/address/GetAllAdressByCustomer";
import { AddressInfo } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { color } from "react-native-elements/dist/helpers";
import Ionicons from "react-native-vector-icons/Ionicons";


  
const ChooseAddress = ({ navigation }: any) => {
    //const route = useRoute<RouteProp<AddressRouteParams, 'params'>>();
    
    // Check if route.params is defined and has onSelectAddress
    //const onSelectAddress = route.params?.onSelectAddress;
    
    const [addresses, setAddresses] = React.useState<AddressInfo[]>([]);
  
    const [selectedAddress, setSelectedAddress] = React.useState<AddressInfo | null>(null);
    
    useEffect(() => {
        fetchAddresses();
    }, []);
  
    const fetchAddresses = async () => {
        const customerId = await AsyncStorage.getItem('user_id');
        if (customerId !== null) {
          const ParseCustomerId = JSON.parse(customerId);
          const response = await GetAllAdressByCustomer(ParseCustomerId);
          setAddresses(response);
        }
    };
  
    const selectAddress = async (address: AddressInfo) => {
        setSelectedAddress(address);
        navigation.goBack('OrderScreen');
        await AsyncStorage.setItem('address', JSON.stringify(address.id));
        const Address = await AsyncStorage.getItem('address');
        //console.log(Address);
       
      };
  
    // Handle the case where onSelectAddress is not provided by rendering a fallback UI
    
  
    return (
        <View>
            <View className="flex flex-colw-full h-screen justify-center items-center p-3">
            <Text className='text-lg text-center text-black'><Ionicons name="location" size={24} color="red" /> All your available addresses here!</Text>
                {addresses?.map(address => (
            <TouchableOpacity
            onPress={() => selectAddress(address)}
            className='w-full p-4 border border-orange-500 rounded-xl shadow-xl mt-4 focus:border-orange-500'
          >
              <Text style={styles.addressDetails}>{address.district}, {address.ward}, {address.province}</Text>
            </TouchableOpacity>
          ))}
          <View className='flex flex-row w-full justify-center items-center'>
            <Button icon="plus" className='bg-orange-500 mt-5 w-48 rounded-lg' textColor='white' onPress={() => navigation.navigate('AddressScreen')}>Add new Address</Button>
            
          </View>
          
        </View>
        </View>
    );
}
const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 16,
    },
    itemDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemPrice: {
      fontSize: 14,
      color: 'green',
    },
    itemQuantity: {
      fontSize: 14,
    },
    couponContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      marginBottom: 8,
    },
    couponCode: {
      fontSize: 14,
    },
    selectedCoupon: {
      fontSize: 14,
      color: 'blue',
    },
    couponDiscount: {
      fontSize: 14,
      color: 'red',
    },
    selectedAddress: {
      fontSize: 14,
      marginVertical: 8,
    },
    paymentMethodContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    paymentMethodButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    summaryText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    modalContainer: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    
    addressDetails: {
      fontSize: 14,
    },
  });

export default ChooseAddress