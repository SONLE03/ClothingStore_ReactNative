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

const HomeScreen = () => {
  //const ClothesList = useStore((state: any) => state.ClothesList);
  //const fetchClothesList = useStore((state: any) => state.fetchClothesList);
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
        prices={item.prices}
        category={item.category}
        branch={item.branch}
        productStatus={item.productStatus}
        image={item.image}
        buttonPressHandler={() => addToCart(item)}
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
              className="mx-5 mr-2 ml-8"
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find your clothes here..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchClothes(text);
            }}
            placeholderTextColor="#A9A9A9"
            className="flex-1 h-12 font-medium text-sm text-gray-600"
          />
          {searchText.length > 0 && (
            <TouchableOpacity className="mr-2" onPress={() => resetSearchClothes()}>
              <MaterialCommunityIcons className="mx-5" name="close-circle-outline" size={16} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Scroll View */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 my-4">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.name)}
              className={`mx-2 my-2 ${selectedCategory === category.name ? 'border-b-2 border-orange-500' : ''}`}
            >
              <Text className={`text-lg font-semibold ${selectedCategory === category.name ? 'text-orange-500' : 'text-gray-500'}`}>
                {category.name}
              </Text>
              {selectedCategory === category.name && (
                <View className={`w-2 h-2 bg-orange-500 rounded-full self-center mt-1`} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Clothes Cards */}
        <FlatList
          data={filteredClothes}
          numColumns={2}
          renderItem={renderClothesCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500">No clothes available</Text>
            </View>
          )}
        />

      </ScrollView>
    </View>
  );
};

export default HomeScreen;
