import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING } from '../../theme/theme';
import HeaderBar from '../../components/customUIs/Headerbar';
import EmptyListAnimation from '../../components/animation/EmptyListAnimation';
import FavouriteItemCard from '../../components/favourite/FavoritesItemCard';
import { GetFavouriteList } from '../../api/favourite/GetFavouriteList';
import { DeleteProductInFavourite } from '../../api/favourite/DeleteProductInFavourite';
import { FavouriteItems, Product } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParseJSON } from '../../api/auth/parseJSON';
import { Button } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FavoritesScreen = ({ navigation, route }: any) => {
  const [FavoriteList, setFavoriteList] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    getCartInfo();
  }, []);

  const getCartInfo = async () => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId !== null) {
      const ParseCustomerId = ParseJSON(customerId);
      const response = await GetFavouriteList(ParseCustomerId);
      setFavoriteList(response.data.data);
      console.log(FavoriteList); 
    }
  };

  const RefreshCartList = () => {
    getCartInfo();
  };

  const handleCheckItem = (productIds: string, isChecked: boolean) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (isChecked) {
        newSelectedItems.add(productIds);
      } else {
        newSelectedItems.delete(productIds);
      }
      return newSelectedItems;
    });
  };

  const handleCheckAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems(new Set(FavoriteList.map(item => item.Id)));
    } else {
      setSelectedItems(new Set());
    }
    setSelectAll(isChecked);
  };

  const handleDeleteItem = async (productIds: string) => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId) {
      const ParseCustomerId = ParseJSON(customerId);
      const itemToDelete = FavoriteList.find(item => item.Id === productIds);
      if (itemToDelete) {
        await DeleteProductInFavourite(ParseCustomerId, productIds);
        const updatedFavoriteList = FavoriteList.filter(item => item.Id !== productIds);
        setFavoriteList(updatedFavoriteList);
        setSelectedItems(prev => {
          const newSelectedItems = new Set(prev);
          newSelectedItems.delete(productIds);
          return newSelectedItems;
        });
      }
    }
  };

  const handleDeleteSelectedItems = async () => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId) {
      const ParseCustomerId = ParseJSON(customerId);
      const itemsToDelete = Array.from(selectedItems).map(productIds => productIds);
      console.log(itemsToDelete);
      // await DeleteProductInFavourite(ParseCustomerId, itemsToDelete);
      const updatedCartList = FavoriteList.filter(item => !selectedItems.has(item.Id));
      setFavoriteList(updatedCartList);
      setSelectedItems(new Set());
      setSelectAll(false);
    }
  };

  const buttonPressHandler = () => {
    const itemsToDelete = Array.from(selectedItems).map(productIds => productIds)
    
    navigation.navigate('ProductDetailsScreen', { itemsToDelete});
    console.log(selectedItems)
  };

  return (
    <View className='bg-gray-200' style={styles.ScreenContainer}>
      <View className="flex flex-col h-screen">
        <View style={styles.ItemContainer}>
          <HeaderBar title="Favorite" />
          <ScrollView>
            {FavoriteList.length == 0 ? (
              <EmptyListAnimation title={'Your Favorite is Empty'} />
            ) : (
             <View style={styles.ListItemContainer}>
              {FavoriteList.map((data: any) => (
                <FavouriteItemCard
                  key={data.Id || data.productItemId} // dùng data.Id nếu productItemId không tồn tại
                  item={data}
                  isChecked={selectedItems.has(data.Id || data.productItemId)}
                  onCheck={handleCheckItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </View>
            )}
          </ScrollView>

        </View>
        {FavoriteList.length != 0 ? (
          <View className="flex-col w-full justify-start items-start p-2 bg-gray-100 border border-t-gray-400 border-x-white border-b-white">
            {/* <View className="flex flex-row justify-start items-center bg-gray-100 p-2 mr-1">
              <CheckBox className='left-0' value={selectAll} onValueChange={handleCheckAll} />
              <Text className="text-orange-500 font-semibold text-lg mr-14">All</Text>
            </View> */}
            <View className='flex flex-row justify-end items-end w-full'>
              <TouchableOpacity
                className="ml-2 bg-red-500 rounded-lg p-1 w-24 h-10 flex flex-row justify-center items-center"
                onPress={handleDeleteSelectedItems}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text className="text-center text-white">Clear all</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <View className="mt-28" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    //backgroundColor: COLORS.primaryWhiteHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});

export default FavoritesScreen;
