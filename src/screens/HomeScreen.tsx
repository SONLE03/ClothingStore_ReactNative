// HomeScreen.tsx

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GetAllCategory} from '../api/category/GetAllCategory';
import {Category, ExistedCoupon, Product} from '../types';
import {GetAllProducts} from '../api/product/GetAllProducts';
import HeaderBar from '../components/customUIs/Headerbar';
import ClothesCard from '../components/product/ClothesCard';
import {Input} from 'react-native-elements';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GetAllOrderByCustomer} from '../api/order/GetAllOrderByCustomer';
import { GetAllCoupons } from '../api/coupon/GetAllCoupons';

LogBox.ignoreLogs([
  ' Warning: Each child in a list should have a unique "key" prop',
]);

const bannerImages = [
  require('../assets/images/banner-01.png'),
  require('../assets/images/banner-02.png'),
  require('../assets/images/banner-03.png'),
  require('../assets/images/banner-04.png'),
];

const CARD_WIDTH = Dimensions.get('window').width * 0.9;

const HomeScreen = ({navigation}: any) => {
  const [ClothesList, setClothesList] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredClothes, setFilteredClothes] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
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

  //console.log(selectedCategory);

  useEffect(() => {
    const fetchData = async () => {
      const fetchClothesList = await GetAllProducts();
      setClothesList(fetchClothesList.data);
      const fetchedCategories = await GetAllCategory();
      setCategories(fetchedCategories);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (ClothesList) {
      setFilteredClothes(
        ClothesList.filter((clothes: Product) =>
          clothes.product_Name.toLowerCase().includes(searchText.toLowerCase()),
        ),
      );
    }
  }, [searchText, ClothesList]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredClothes(
        ClothesList.filter(
          (clothes: Product) => clothes.category === selectedCategory,
        ),
      );
    } else {
      setFilteredClothes(ClothesList);
    }
  }, [selectedCategory, ClothesList]);

  const handleScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / CARD_WIDTH);
    setCurrentBannerIndex(index);
  };

  const searchClothes = (text: string) => {
    setSearchText(text);
  };

  const resetSearchClothes = () => {
    setSearchText('');
  };

  const renderBannerCard = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => navigation.navigate('Event')}>
      <View className="p-2 rounded-xl overflow-hidden">
        <Image
          source={item}
          style={{
            width: CARD_WIDTH,
            height: CARD_WIDTH * 0.6,
            borderRadius: 12,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  const renderClothesCard = ({item}: {item: Product}) => (
    <TouchableOpacity
      className="w-1/2 p-1"
      onPress={() =>
        navigation.navigate('ProductDetailsScreen', {productId: item.id})
      }>
      <ClothesCard
        id={item.id}
        product_Name={item.product_Name}
        description={item.description}
        price={item.price}
        category={item.category}
        branch={item.branch}
        productStatus={item.productStatus}
        images={item.images}
        buttonPressHandler={() =>
          navigation.navigate('ProductDetailsScreen', {productId: item.id})
        }
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Banner Scroll View */}
      <View className="flex-col justify-center my-3">
        <ScrollView
          className="m-2"
          horizontal
          //pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={100000}
          ref={scrollViewRef}>
          {bannerImages.map((image, index) => (
            <View key={index} style={{width: CARD_WIDTH}}>
              {renderBannerCard({item: image})}
            </View>
          ))}
        </ScrollView>
        {/* Mini Points */}
        <View className="flex-row justify-center mt-2">
          {bannerImages.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentBannerIndex ? 'bg-yellow-500' : 'bg-gray-500'
              }`}
            />
          ))}
        </View>
      </View>

      <View className="flex-row justify-between bg-white items-center mx-4 my-2 p-4 rounded-lg shadow-md">
        {/* TOTAL ORDER */}
        <View className="flex w-[30%]">
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
        <View className="flex-1">
          <Text className="text-gray-500 text-sm">Total Spend</Text>
          <Text className="text-yellow-500 text-lg font-bold">{totalSpend}</Text>
        </View>
        {/* Vertical Line */}
        <View
          className="w-px bg-gray-300 mx-2"
          style={{height: '100%'}}
        ></View>
        {/* TOTAL COUPON */}
        <View className="flex-1">
          <Text className="text-gray-500 text-sm">Total Coupon</Text>
          <Text className="text-yellow-500 text-lg font-bold">{coupons?.length}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row mx-4 my-6 rounded-2xl bg-gray-50 border border-yellow-500 items-center">
        <TouchableOpacity
          className="flex ml-2"
          onPress={() => searchClothes(searchText)}>
          <MaterialCommunityIcons
            name="home-search"
            size={25}
            color={searchText.length > 0 ? '#FF9100' : '#A9A9A9'}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search Clothes"
          placeholderTextColor="#A9A9A9"
          value={searchText}
          onChangeText={text => searchClothes(text)}
          className="flex-1 p-3 mx-2 text-gray-500"
        />
        <TouchableOpacity
          className="flex mr-2"
          onPress={() => resetSearchClothes()}>
          <MaterialCommunityIcons
            name="close"
            size={25}
            color={searchText.length > 0 ? '#FF9100' : '#A9A9A9'}
          />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View className="flex-row justify-center mt-2 mb-4 bg-white p-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            className={`py-2 px-4 mx-2 rounded-full border ${
              selectedCategory === ''
                ? 'bg-yellow-500 border-yellow-500'
                : 'border-gray-500'
            }`}
            onPress={() => setSelectedCategory('')}>
            <Text
              className={`${
                selectedCategory === '' ? 'text-white' : 'text-gray-500'
              } text-sm font-medium`}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category.name}
              className={`py-2 px-4 mx-2 rounded-full border ${
                selectedCategory === category.name
                  ? 'bg-yellow-500 border-yellow-500'
                  : 'border-gray-500'
              }`}
              onPress={() => setSelectedCategory(category.name)}>
              <Text
                className={`${
                  selectedCategory === category.name
                    ? 'text-white'
                    : 'text-gray-500'
                } text-sm font-medium`}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text className="text-lg font-bold mx-4 my-2 text-orange-600 border border-b-orange-600 border-x-white border-t-gray-200 p-0 ">
        Our newest products here
      </Text>
    </>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prevIndex => {
        const nextIndex =
          prevIndex + 1 >= bannerImages.length ? 0 : prevIndex + 1;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * CARD_WIDTH,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderBar title="Furnistore" />
      <FlatList
        className="bg-gray-100"
        data={filteredClothes}
        numColumns={2}
        renderItem={renderClothesCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{paddingHorizontal: 4, paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center mt-20 mb-20">
            <Text className="text-gray-500 text-lg">No product Found</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
