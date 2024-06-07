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
import { COLORS, SPACING } from '../theme/theme';
import HeaderBar from '../components/customUIs/Headerbar';
import EmptyListAnimation from '../components/animation/EmptyListAnimation';
import CartItem from '../components/cart/CartItem';
import { GetCartInfo } from '../api/cart/GetCartInfo';
import { EditProductInCart } from '../api/cart/EditProductInCart';
import { DeleteProductInCart } from '../api/cart/DeleteProductInCart';
import { ProductItemInCart } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParseJSON } from '../api/auth/parseJSON';
import { Button } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation, route }: any) => {
  const [CartList, setCartList] = useState<ProductItemInCart[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    getCartInfo();
  }, []);

  const getCartInfo = async () => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId !== null) {
      const ParseCustomerId = ParseJSON(customerId);
      const response = await GetCartInfo(ParseCustomerId);
      setCartList(response);
    }
  };

  const RefreshCartList = () => {
    getCartInfo();
  };

  const calculateTotalPrice = () => {
    return CartList.reduce((total, item) => {
      if (selectedItems.has(item.productItemId)) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const handleCheckItem = (productItemId: string, isChecked: boolean) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (isChecked) {
        newSelectedItems.add(productItemId);
      } else {
        newSelectedItems.delete(productItemId);
      }
      return newSelectedItems;
    });
  };

  const handleCheckAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems(new Set(CartList.map(item => item.productItemId)));
    } else {
      setSelectedItems(new Set());
    }
    setSelectAll(isChecked);
  };

  const handleUpdateQuantity = async (productItemId: string, quantity: number) => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId) {
      const ParseCustomerId = ParseJSON(customerId);
      await EditProductInCart(ParseCustomerId, productItemId, quantity);
      const updatedCartList = CartList.map(item => {
        if (item.productItemId === productItemId) {
          return { ...item, quantity };
        }
        return item;
      });
      setCartList(updatedCartList);
    }
  };

  const handleDeleteItem = async (productItemId: string) => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId) {
      const ParseCustomerId = ParseJSON(customerId);
      const itemToDelete = CartList.find(item => item.productItemId === productItemId);
      if (itemToDelete) {
        await DeleteProductInCart(ParseCustomerId, [{ productItemId, quantity: itemToDelete.quantity }]);
        const updatedCartList = CartList.filter(item => item.productItemId !== productItemId);
        setCartList(updatedCartList);
        setSelectedItems(prev => {
          const newSelectedItems = new Set(prev);
          newSelectedItems.delete(productItemId);
          return newSelectedItems;
        });
      }
    }
  };

  const handleDeleteSelectedItems = async () => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId) {
      const ParseCustomerId = ParseJSON(customerId);
      const itemsToDelete = Array.from(selectedItems).map(productItemId => {
        const item = CartList.find(item => item.productItemId === productItemId);
        return {
          productItemId,
          quantity: item ? item.quantity : 1,
        };
      });
      await DeleteProductInCart(ParseCustomerId, itemsToDelete);
      const updatedCartList = CartList.filter(item => !selectedItems.has(item.productItemId));
      setCartList(updatedCartList);
      setSelectedItems(new Set());
      setSelectAll(false);
    }
  };

  const tabBarHeight = useBottomTabBarHeight();

  const buttonPressHandler = () => {
    const selectedCartItems = CartList.filter(item => selectedItems.has(item.productItemId));
    const totalPrice = calculateTotalPrice();
    navigation.push('OrderScreen', { orderItems: selectedCartItems, amount: totalPrice });
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View className="flex flex-col h-screen">
        <View style={styles.ItemContainer}>
          <HeaderBar title="Cart" />
          <ScrollView>
            {CartList.length == 0 ? (
              <EmptyListAnimation title={'Cart is Empty'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {CartList.map((data: any) => (
                  <CartItem
                    key={data.productItemId}
                    item={data}
                    isChecked={selectedItems.has(data.productItemId)}
                    onCheck={handleCheckItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
        {CartList.length != 0 ? (
          <View className="flex-col w-full justify-start items-start p-2 bg-gray-100 border border-t-gray-400 border-x-white border-b-white">
            
            <View className="flex flex-row justify-start items-center bg-gray-100 p-2 mr-1">
              <CheckBox className='left-0' value={selectAll} onValueChange={handleCheckAll} />
              <Text className="text-orange-500 font-semibold text-lg mr-14">All</Text>
              <Text className="text-black font-semibold text-lg">Total Price:</Text>
              <Text className="text-orange-500 font-semibold text-lg"> {calculateTotalPrice().toLocaleString()}đ</Text>
            </View>

            <View className='flex flex-row justify-end items-end w-full'>
             
              <Button
                className="ml-2 bg-orange-500 rounded-lg p-1"
                textColor='white'
                onPress={buttonPressHandler}
              >
                Buy now
              </Button>

              <Button
                className="ml-2 bg-red-500 rounded-lg p-1 w-5"
                onPress={handleDeleteSelectedItems}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </Button>
              </View>
          </View>
        ) : (
          <></>
        )}
        <View className="mt-28" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
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

export default CartScreen;
