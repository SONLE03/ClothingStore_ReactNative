// HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore } from '../store/store';
import ClothesCard from '../components/product/ClothesCard';
import { GetAllCategory } from '../api/category/GetAllCategory';
import { Category, Product } from '../types';
import { GetAllProducts } from '../api/product/GetAllProducts';
import HeaderBar from '../components/customUIs/Headerbar';

const bannerImages = [
  require('../assets/images/asphalt-9.jpeg'),
  require('../assets/images/Altos-Odyssey.jpeg'),
  require('../assets/images/genshin-impact.jpeg'),
  require('../assets/images/pokemon-unite.jpeg'),
];

const CARD_WIDTH = Dimensions.get('window').width * 0.9;

const HomeScreen = ({ navigation }: any) => {
  //const navigation = useNavigation();
  const [ClothesList, setClothesList] = useState<Product[]>([]);
  const addToCart = useStore((state: any) => state.addToCart);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredClothes, setFilteredClothes] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const fetchClothesList = await GetAllProducts();
      console.log(fetchClothesList.data);
      setClothesList(fetchClothesList.data);
      const fetchedCategories = await GetAllCategory();
      setCategories(fetchedCategories);
    };
    fetchData();
  }, [ ]);

  useEffect(() => {
    if (ClothesList) {
      setFilteredClothes(
        ClothesList.filter((clothes: Product) =>
          clothes.product_Name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, ClothesList]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredClothes(
        ClothesList.filter((clothes: Product) => clothes.category === selectedCategory)
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

  const renderBannerCard = ({ item }: { item: any }) => (
    <View className="p-2 rounded-xl overflow-hidden">
      <Image
        source={item}
        style={{ width: CARD_WIDTH, height: CARD_WIDTH * 0.6, borderRadius: 12 }}
      />
    </View>
  );

  const renderClothesCard = ({ item }: { item: Product }) => (
    <View className="w-1/2 p-2">
      <ClothesCard
        id={item.id}
        product_Name={item.product_Name}
        description={item.description}
        price={item.price}
        category={item.category}
        branch={item.branch}
        productStatus={item.productStatus}
        images={item.images}
        buttonPressHandler={() => navigation.navigate('ProductDetailsScreen', { productId: item.id })}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-200">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Home" />
        {/* Banner Scroll View */}
        <View className="flex-col justify-center my-3">
          <ScrollView className='m-2'
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={20}
          >
            {bannerImages.map((image, index) => (
              <View key={index} style={{ width: CARD_WIDTH }}>
                {renderBannerCard({ item: image })}
              </View>
            ))}
          </ScrollView>
          {/* Mini Points */}
          <View className="flex-row justify-center mt-2">
            {bannerImages.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${index === currentBannerIndex ? 'bg-orange-500' : 'bg-gray-500'}`}
              />
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row mx-4 my-6 rounded-2xl bg-gray-50 border border-orange-500 items-center">
          <TouchableOpacity className="flex ml-2" onPress={() => searchClothes(searchText)}>
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
            onChangeText={(text) => searchClothes(text)}
            className="flex-1 p-3 mx-2"
          />
          <TouchableOpacity
            className="flex mr-2"
            onPress={() => resetSearchClothes()}
          >
            <MaterialCommunityIcons
              name="close"
              size={25}
              color={searchText.length > 0 ? '#FF9100' : '#A9A9A9'}
            />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View className="flex-row justify-center mt-2 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              className={`py-2 px-4 rounded-full border ${selectedCategory === '' ? 'bg-orange-500 border-orange-500' : 'border-gray-500'}`}
              onPress={() => setSelectedCategory('')}
            >
              <Text className={`${selectedCategory === '' ? 'text-white' : 'text-gray-500'} text-sm font-medium`}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`py-2 px-4 mx-2 rounded-full border ${selectedCategory === category.id ? 'bg-orange-500 border-orange-500' : 'border-gray-500'}`}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text className={`${selectedCategory === category.id ? 'text-white' : 'text-gray-500'} text-sm font-medium`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Clothes List */}
        <FlatList
          data={filteredClothes}
          numColumns={2}
          renderItem={renderClothesCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
        <View className='flex w-full mt-20'/>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
