import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {GetAllAdressByCustomer} from '../api/address/GetAllAdressByCustomer';
import {AddressInfo} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Warning: Each child in a list should have a unique "key" prop',
]);

const ChooseAddress = ({navigation}: any) => {
  //const route = useRoute<RouteProp<AddressRouteParams, 'params'>>();

  // Check if route.params is defined and has onSelectAddress
  //const onSelectAddress = route.params?.onSelectAddress;

  const [addresses, setAddresses] = React.useState<AddressInfo[]>([]);

  const [selectedAddress, setSelectedAddress] =
    React.useState<AddressInfo | null>(null);

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
    console.log(Address);
  };

  // Handle the case where onSelectAddress is not provided by rendering a fallback UI

  return (
    <View className="flex-1">
      <TouchableOpacity className="flex-row justify-between items-center mb-14 border border-gray-400 rounded-xl p-2 bg-white">
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back"
          size={24}
          color="#333"
        />
        <Text className="flex-row text-2xl font-semibold space-x-2 text-black">
          <Ionicons className="mr-2" name="location" size={25} color="#333" />
          Choose your address
        </Text>
        <View style={{width: 24}} />
      </TouchableOpacity>
      <ScrollView>
        <View className="flex flex-co w-full h-screen justify-center items-center p-3 bg-white">
          <Text className="text-lg text-center text-black">
            <Ionicons name="location" size={24} color="red" /> All your
            available addresses here!
          </Text>
          {addresses?.map(address => (
            <TouchableOpacity
              onPress={() => selectAddress(address)}
              className="w-full p-4 border border-yellow-500 rounded-xl shadow-xl mt-4 focus:border-yellow-500">
              <Text style={styles.addressDetails}>
                {address.district}, {address.ward}, {address.province}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View className="flex flex-col w-full justify-center items-center">
        <Button
          icon="plus"
          className="bg-yellow-500 mt-8 w-48 rounded-lg"
          textColor="white"
          onPress={() => navigation.navigate('AddressScreen')}>
          Add new Address
        </Button>
        <Button
          icon="reload"
          className="border-2 border-yellow-500 mt-3 w-48 rounded-lg mb-2"
          textColor="red"
          onPress={fetchAddresses}>
          Reload
        </Button>
      </View>
    </View>
  );
};
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
    color: 'gray',
  },
});

export default ChooseAddress;
