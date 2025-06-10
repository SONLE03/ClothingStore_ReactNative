import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {Avatar, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {Fumi} from 'react-native-textinput-effects';

import {GetMe} from '../../api/auth/GetMe';
import {EditUser} from '../../api/auth/ChangeProfile';
import logoutUser from '../../api/auth/Logout';
import HeaderBar from '../../components/customUIs/Headerbar';
import {ExistedCoupon, UserPropsDetail} from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../util/AuthContext';
import { GetAllCoupons } from '../../api/coupon/GetAllCoupons';
import { GetAllOrderByCustomer } from '../../api/order/GetAllOrderByCustomer';

const ProfileScreen = ({navigation}: any) => {
  const [user, setUser] = useState<UserPropsDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {authEmitter} = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<ExistedCoupon[]>([]);
  console.log('Orders:', orders);

  // Calculate total spend from ALL orders, each order has total field and status COMPLETED
  const totalSpend = orders.reduce((total, order) => {
    if (order.status === 'COMPLETED') {
      return total + order.total;
    }
    return total;
  }, 0).toLocaleString();
  const fetchOrders = useCallback(async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      const ParseCustomerId = JSON.parse(userId);
      console.log(ParseCustomerId);
      const orders = await GetAllOrderByCustomer(ParseCustomerId);
      setOrders(orders);
      console.log(orders);
    }
  }, []);

  const fetchCoupons = async () => {
    const response = await GetAllCoupons();
    if (!response) return;
    setCoupons(response);
  };


  useEffect(() => {
    fetchOrders();
    fetchCoupons();
  }, [fetchOrders]);


  useEffect(() => {
    const fetchUser = async () => {
      const userData = await GetMe();
      setUser(userData);
      setFullName(userData.fullName);
      setPhone(userData.phone);
      console.log(fullName, phone);
    };
    fetchUser();
  }, []);

  const handleEditProfile = async () => {
    if (user) {
      await EditUser(user.id, phone, fullName, image || undefined);
      const updatedUser = await GetMe();
      setUser(updatedUser);
      setModalVisible(false);
    }
  };

  const pickImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setImage({
          uri: image.path,
          type: image.mime,
          name: image.filename || 'profile.jpg',
        });
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Could not pick the image.');
      });
  };

  const handleLogout = async () => {
    await logoutUser();
    AsyncStorage.clear();
    authEmitter.emit('loginStatusChanged');
  };

  return (
    <View className=" flex-1">
      <HeaderBar title="Profile" />
      {user && (
        <View className="flex-row justify-between items-center mb-4 p-3 bg-white">
          <View className="flex-row items-center">
            <View className="relative h-20 w-20">
              <Avatar.Image
                size={65}
                source={
                  user.image
                    ? {uri: user.image}
                    : require('../../assets/app_images/avatar.png')
                }
              />
              <IconButton
                icon="pencil"
                size={15}
                onPress={pickImage}
                className="absolute bottom-0 right-0 bg-yellow-500 text-white"
              />
            </View>

            <View className="flex flex-col ml-2">
              <Text className=" font-semibold text-xl text-black bg-white mb-4">
                {fullName}
              </Text>
              <Text className=" text-sm p-1 rounded-2xl border border-yellow-500  text-ellipsis text-orange-700">
                {user.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="flex flex-row border border-gray-500 rounded-xl p-2 items-center focus:border-yellow-500"
            onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons
              name="account-edit"
              size={24}
              color="gray"
            />
            <Text className="font-semibold text-gray-400">Edit</Text>
          </TouchableOpacity>
        </View>
      )}

       <View className="flex-row justify-between bg-white items-center mx-4 my-2 p-4 rounded-lg shadow-md">
              {/* TOTAL ORDER */}
              <View className="flex w-[27%]">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="clipboard-text"
                    size={20}
                    color="#FF9100"
                  />
                  <Text className="text-gray-500 text-sm ml-2">Orders</Text>
                </View>
                <Text className="text-yellow-500 text-lg font-bold">{orders?.length}</Text>
              </View>
              {/* Vertical Line */}
              <View
                className="w-px bg-gray-300 mx-2"
                style={{height: '100%'}}
              ></View>
              {/* TOTAL SPEND */}
              <View className="flex w-[33%]">
              <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={20}
                    color="#FF9100"
                  />
                  <Text className="text-gray-500 text-sm ml-2">Total Spend</Text>
                </View>
                <Text className="text-yellow-500 text-lg font-bold">{totalSpend}</Text>
              </View>
              {/* Vertical Line */}
              <View
                className="w-px bg-gray-300 mx-2"
                style={{height: '100%'}}
              ></View>
              {/* TOTAL COUPON */}
              <View className="flex-1">
              <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="ticket"
                    size={20}
                    color="#FF9100"
                  />
                  <Text className="text-gray-500 text-sm ml-2">Coupon</Text>
                </View>
                <Text className="text-yellow-500 text-lg font-bold">{coupons?.length}</Text>
              </View>
            </View>
      

      <TouchableOpacity
        className=" flex flex-row mb-4 p-4 border border-gray-400 rounded space-x-2 bg-white mt-8"
        onPress={() => navigation.navigate('History')}>
        <Ionicons className="mr-4" name="calendar" size={30} color="#dd6b20" />
        <Text className="text-lg font-semibold text-orange-600">
          Order History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex flex-row mb-4 p-4 border border-gray-400 rounded space-x-2 bg-white mt-4"
        onPress={() => navigation.navigate('ChooseAddress')}>
        <Ionicons className="mr-4" name="location" size={30} color="#dd6b20" />
        <Text className="text-lg font-semibold text-orange-600">
          My Delivery Addresses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex flex-row mb-4 p-4 border border-gray-400 rounded space-x-2 bg-white mt-4"
        onPress={() => navigation.navigate('ChangePassword')}>
        <Ionicons name="key" size={30} color="#dd6b20" />
        <Text className="text-lg font-semibold text-orange-600">
          Change Password
        </Text>
      </TouchableOpacity>

      <View className="flex-row h-14 justify-center items-center w-full mt-14">
        <TouchableOpacity
          className="mb-4 flex justify-center items-center bg-white w-1/2 h-12 border border-orange-600 rounded-xl"
          onPress={() => setLogoutModalVisible(true)}>
          <Text className="text-orange-600 font-semibold text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-row justify-center items-center p-4 bg-white">
          <Text className="w-full border border-orange-600 text-center text-lg font-semibold p-3 rounded-xl text-orange-700">
            <MaterialCommunityIcons
              name="account-edit"
              size={30}
              color="#dd6b20"
            />{' '}
            Edit Profile
          </Text>
        </View>
        <View className="p-4 flex-1 justify-center">
          <View className="flex-row justify-center items-center w-full mb-4">
            <TouchableOpacity
              className="border border-yellow-500 rounded-full h-28 w-28"
              onPress={pickImage}>
              <Avatar.Image
                size={110}
                source={
                  image
                    ? {uri: image.uri}
                    : user && user.image
                    ? {uri: user.image}
                    : require('../../assets/app_images/avatar.png')
                }
              />
              <IconButton
                icon="plus"
                size={15}
                iconColor="white"
                //onPress={pickImage}
                className="absolute bottom-0 right-0 bg-yellow-500 text-white"
              />
            </TouchableOpacity>
          </View>

          <Fumi
            className="border border-gray-500 rounded-xl mt-4"
            label={'Full name'}
            iconClass={MaterialCommunityIcons}
            iconName={'account'}
            iconColor={'#f95a25'}
            iconSize={25}
            inputPadding={18}
            keyboardType="number-pad"
            value={fullName}
            onChangeText={setFullName}
          />
          <Fumi
            className="border border-gray-500 rounded-xl mt-4"
            label={'Phone number'}
            iconClass={Ionicons}
            iconName={'logo-whatsapp'}
            iconColor={'#f95a25'}
            iconSize={25}
            onChangeText={setPhone}
            inputPadding={18}
            keyboardType="number-pad"
            value={phone}
          />
          <View className="flex-row justify-center items-center p-2 h-12 w-full mb-4 mt-8">
            <TouchableOpacity
              className="flex justify-center items-center bg-yellow-500 rounded-xl w-1/2 h-12"
              onPress={handleEditProfile}>
              <Text className="text-lg font-semibold text-white">
                Save Changes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex justify-center items-center border border-yellow-500 rounded-xl w-1/2 h-12 ml-4"
              onPress={() => setModalVisible(false)}>
              <Text className="text-lg font-semibold text-orange-600">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              width: '80%', // Control width
              borderRadius: 10, // Optional: for rounded corners
              shadowColor: '#000', // Optional: for shadow
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <Text className="text-lg mb-4 text-center p-1 text-black">
              <Ionicons name="warning" size={30} color="#dd6b20" /> Are you sure
              you want to log out?
            </Text>
            <View className="flex-row w-full justify-center items-center space-x-4 mt-4">
              <TouchableOpacity
                className="flex justify-center items-center border border-yellow-500 rounded-xl w-1/2 h-12"
                onPress={() => setLogoutModalVisible(false)}>
                <Text className="text-lg font-semibold text-orange-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex justify-center items-center bg-yellow-500 rounded-xl w-1/2 h-12"
                onPress={handleLogout}>
                <Text className="text-lg font-semibold text-white">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
