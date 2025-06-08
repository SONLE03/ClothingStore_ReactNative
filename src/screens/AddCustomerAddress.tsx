import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetProvinces, GetDistrictsByProvince, GetWardsByDistrict } from '../api/address/ProvinceVN';
import { Province, District, Ward, AddressRequest } from '../types';
import { CreateCustomerAddress } from '../api/address/CreateCustomerAddress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const backgroundImages = [
  require('../assets/bg-address/HaLongBay.jpeg'),
  require('../assets/bg-address/Peaceful.jpg'),
  require('../assets/bg-address/SongNuoc.jpg'),
  require('../assets/bg-address/Forest.jpg'),
];

const CreateCustomerAddressScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<{ label: string, value: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ label: string, value: string } | null>(null);
  const [selectedWard, setSelectedWard] = useState<{ label: string, value: string } | null>(null);
  const [specificAddress, setSpecificAddress] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);

  useEffect(() => {
    fetchProvinces();
    const interval = setInterval(() => {
      changeBackgroundImage();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince.value);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict.value);
    }
  }, [selectedDistrict]);

  const fetchProvinces = async () => {
    const provincesData = await GetProvinces();
    setProvinces(provincesData);
  };

  const fetchDistricts = async (province_id: string) => {
    const districtsData = await GetDistrictsByProvince(province_id);
    setDistricts(districtsData);
    setWards([]);
    setSelectedDistrict(null);
    setSelectedWard(null);
  };

  const fetchWards = async (district_id: string) => {
    const wardsData = await GetWardsByDistrict(district_id);
    setWards(wardsData);
    setSelectedWard(null);
  };

  const changeBackgroundImage = () => {
    const currentIndex = backgroundImages.indexOf(backgroundImage);
    const nextIndex = (currentIndex + 1) % backgroundImages.length;
    setBackgroundImage(backgroundImages[nextIndex]);
  };

  const handleAddAddress = async () => {
    if (!phone || !selectedProvince || !selectedDistrict || !selectedWard || !specificAddress) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const customerId = await AsyncStorage.getItem('user_id');
    console.log(customerId);
    if (!customerId) {
      Alert.alert('No customer ID found');
      return;
    }

    //const ParseCustomerId = JSON.stringify(customerId);

    //console.log(ParseCustomerId);

    const address: AddressRequest = {
      phone: phone,
      province: selectedProvince.label,
      district: selectedDistrict.label,
      ward: selectedWard.label,
      specificAddress: specificAddress,
    };

    try {
      await CreateCustomerAddress(customerId, address);
      Alert.alert('Address added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Failed to add address');
    }
  };

  return (
    <View className='flex-1 justify-center items-center h-screen w-full'>
        
      <View className='w-full h-screen px-8 py-4 bg-white rounded-lg shadow-md p-8'>
      <TouchableOpacity className='flex-row justify-between items-center mb-14 border border-gray-400 rounded-xl p-2 bg-white'>
          <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="#333" />
          <Text className='flex-row text-2xl font-semibold space-x-2 text-gray-600'>
            <Ionicons className='mr-2' name="location" size={25} color="#333" />
            Add new address</Text>
          <View style={{ width: 24 }} />  
      </TouchableOpacity>
        

        <Text className='text-sm mb-1 font-semibold'>Phone number</Text>
        <TextInput
          className='border border-gray-400 rounded-md px-3 py-2 mb-4 font-medium h-10 text-gray-500'
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
          placeholder='Enter phone number...'
          placeholderTextColor='#d1d5db'
        />

        <Text className='text-sm mb-1 font-semibold'>Province</Text>

        <View className='flex flex-row w-full justify-center items-center bg-white border border-gray-400 rounded-lg h-10 mb-4 text-gray'>
            <Dropdown 
            data={provinces && provinces.map((province) => ({ label: province.province_name, value: province.province_id }))}
            value={selectedProvince}
            onChange={(item) => setSelectedProvince(item)}
            labelField="label"
            valueField="value"
            style={{ width: 300}}
            placeholder='Select province...'
            placeholderStyle={{color: 'gray'}}
            search
            searchPlaceholder='Search province...'
            itemTextStyle={{color: 'black'}}
            selectedTextStyle = {{color: "gray"}}
            
            
            />
        </View>

        <Text className='text-sm mb-1 font-semibold'>District</Text>
        <View className='flex flex-row w-full justify-center items-center bg-white border border-gray-400 rounded-lg h-10 mb-4'>
            <Dropdown
            data={districts.map((district) => ({ label: district.district_name, value: district.district_id }))}
            value={selectedDistrict}
            onChange={(item) => setSelectedDistrict(item)}
            labelField="label"
            valueField="value"
            style={{ width: 300}}
            placeholder='Select district...'
            placeholderStyle={{color: 'gray'}}
            search
            searchPlaceholder='Search district...'
            itemTextStyle={{color: 'black'}}
            selectedTextStyle = {{color: "gray"}}
            
            />
        </View>

        <Text className='text-sm mb-1 font-semibold'>Ward</Text>
        <View className='flex flex-row w-full justify-center items-center bg-white border border-gray-400 rounded-lg h-10 mb-4'>
            <Dropdown
            data={wards.map((ward) => ({ label: ward.ward_name, value: ward.ward_id }))}
            value={selectedWard}
            onChange={(item) => setSelectedWard(item)}
            labelField="label"
            valueField="value"
            style={{ width: 300}}
            placeholder='Select ward...'
            placeholderStyle={{color: 'gray'}}
            search
            searchPlaceholder='Search ward...'
            itemTextStyle={{color: 'black'}}
            selectedTextStyle = {{color: "gray"}}
            />
        </View>

        <Text className='text-sm mb-1 font-semibold'>Specific Address</Text>
        <TextInput
          className='border border-gray-400 rounded-md px-3 py-2 mb-4 h-20 text-gray'
          value={specificAddress}
          onChangeText={setSpecificAddress}
          placeholder='Street name, building name...'
          placeholderTextColor='gray'
          multiline
          style={{color: "gray"}}
        />

        <Button color='orange' title="Add Address" onPress={handleAddAddress} />
      </View>
    </View>
  );
};

export default CreateCustomerAddressScreen;
