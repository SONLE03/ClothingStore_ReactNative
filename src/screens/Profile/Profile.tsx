import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Modal, Alert} from 'react-native';
import {Avatar, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {Fumi} from 'react-native-textinput-effects';
import {GetMe} from '../../api/auth/get-me';
import {EditUser} from '../../api/auth/change-profile';
import { EditUserAvatar } from '../../api/auth/change-avatar';
import logoutUser from '../../api/auth/logout';
import HeaderBar from '../../components/customUIs/Headerbar';
import { UserPropsDetail } from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
const ProfileScreen = ({navigation}: {navigation: any}) => {
  const [user, setUser] = useState<UserPropsDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date to display string (DD/MM/YYYY)
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle date selection
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && date) {
      // User selected a date
      setSelectedDate(date);
      setDateOfBirth(formatDate(date));
    }
    // If event.type === 'dismissed', user cancelled - do nothing
  };

  // Open date picker
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  // Calculate maximum date (today - for reasonable age limit)
  const getMaxDate = () => {
    return new Date(); // Today
  };

  // Calculate minimum date (100 years ago - reasonable limit)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate(),
    );
    return minDate;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('User not found', 'Please log in again.');
        navigation.navigate('LoginScreen');
        return;
      }
      const userData = await GetMe(userId);
      if (userData != null) {
        setUser(userData.data);
        setFullName(userData.data.FullName || '');
        setPhoneNumber(userData.data.PhoneNumber || '');
      }
    };
    fetchUser();
  }, []);

  const handleEditProfile = async () => {
    if (user) {
      await EditUser(
        user.Id,
        phoneNumber,
        fullName,
        '2000-06-09T16:09:18.637Z',
      );
      if (image) {
        await EditUserAvatar(user.Id, image);
      }
      const updatedUser = await GetMe(user.Id);
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
    logoutUser();
    navigation.navigate('LoginScreen'); // Redirect to login screen
    AsyncStorage.clear();
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
                      user.ImageSource
                        ? {uri: user.ImageSource}
                        : {uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                }
              />
              <IconButton
                icon="pencil"
                size={15}
                onPress={pickImage}
                className="absolute bottom-0 right-0 bg-orange-500 text-white"
              />
            </View>

            <View className="flex flex-col ml-2">
              <Text className=" font-semibold text-lg text-black bg-white mb-4">
                {fullName}
              </Text>
              <Text className=" text-sm p-1 rounded-2xl border border-orange-500  text-ellipsis text-orange-700">
                {user.Email || 'No email provided'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="flex flex-row border border-gray-500 rounded-xl p-2 items-center focus:border-orange-500"
            onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons
              name="account-edit"
              size={24}
              color="gray"
            />
            <Text className="font-semibold text-gray-600">Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        className="flex flex-row mb-4 p-4 border border-gray-400 rounded space-x-2 bg-white mt-4"
        onPress={() => navigation.navigate('ChangePasswordScreen')}>
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
              className="border border-orange-500 rounded-full h-28 w-28"
              onPress={pickImage}>
              <Avatar.Image
                size={110}
                source={
                  image
                    ? {uri: image.uri}
                    : user && user.ImageSource
                    ? {uri: user.ImageSource}
                    : {uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                }
              />
              <IconButton
                icon="plus"
                size={15}
                iconColor="white"
                //onPress={pickImage}
                className="absolute bottom-0 right-0 bg-orange-500 text-white"
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
            keyboardType="default"
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
            onChangeText={setPhoneNumber}
            inputPadding={18}
            inputMode="numeric"
            keyboardType="number-pad"
            value={phoneNumber}
          />

          <TouchableOpacity
            className="border border-gray-500 rounded-xl mt-4 px-5 py-4 flex-row items-center justify-start space-x-2"
            onPress={openDatePicker}>
            <Ionicons
              name="calendar"
              size={24}
              color="#f95a25"
              className="ml-4"
            />
            {/* Divider */}
            <View className="h-8 w-px bg-gray-300 mx-2" />
            <Text className="text-lg text-gray-700">
              {dateOfBirth || 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>

          {/* Android Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default" // Android default date picker
              onChange={onDateChange}
              maximumDate={getMaxDate()}
              minimumDate={getMinDate()}
            />
          )}

          <View className="flex-row justify-center items-center p-2 h-12 w-full mb-4 mt-12 space-x-4">
            <TouchableOpacity
              className="flex justify-center items-center border border-orange-500 rounded-xl w-1/2 h-12 mt-4"
              onPress={() => setModalVisible(false)}>
              <Text className="text-lg font-semibold text-orange-600">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex justify-center items-center bg-orange-500 rounded-xl w-1/2 h-12 mt-4"
              onPress={handleEditProfile}>
              <Text className="text-lg font-semibold text-white">
                Save Changes
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
            <Text className="text-lg mb-4 text-center p-1 text-gray-800">
              <Ionicons name="warning" size={30} color="#dd6b20" /> Are you sure
              want to log out?
            </Text>
            <View className="flex-row w-full justify-center items-center space-x-4 mt-4">
              <TouchableOpacity
                className="flex justify-center items-center border border-orange-500 rounded-xl w-1/2 h-12"
                onPress={() => setLogoutModalVisible(false)}>
                <Text className="text-lg font-semibold text-orange-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex justify-center items-center bg-orange-500 rounded-xl w-1/2 h-12"
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
