import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageProps,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProductItemInCart } from '../../types';

const CartItem: React.FC<{
  item: ProductItemInCart;
  isChecked: boolean;
  onCheck: (productItemId: string, isChecked: boolean) => void;
  onUpdateQuantity: (productItemId: string, quantity: number) => void;
  onDelete: (productItemId: string) => void;
}> = ({ item, isChecked, onCheck, onUpdateQuantity, onDelete }) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdateQuantity(item.productItemId, quantity);
    }, 5000);

    return () => clearTimeout(timer);
  }, [quantity]);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#FFF', '#FFF']}
      className="border border-orange-500 p-4 rounded-xl shadow-xl"
    >
      <View className="flex-row justify-between items-center">
        <CheckBox
          value={isChecked}
          onValueChange={(newValue) => onCheck(item.productItemId, newValue)}
        />
        {item.image ? (
          <ImageBackground
            source={{ uri: item.image }}
            resizeMode="cover"
            className="rounded-lg mb-4 overflow-hidden w-24 h-24"
          />
        ) : (
          <View className="rounded-lg mb-4 overflow-hidden bg-gray-300 w-24 h-24" />
        )}
        <TouchableOpacity onPress={() => onDelete(item.productItemId)}>
          <MaterialCommunityIcons name="trash-can" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text className="text-black text-lg font-medium text-ellipsis overflow-hidden">{item.product_Name}</Text>
      <Text className="text-black text-sm font-light truncate">Quantity: {quantity}</Text>
      <Text className="text-black text-sm font-light truncate">Size: {item.sizeName}</Text>
      <Text className="text-black text-sm font-light truncate">Color: {item.colorName}</Text>
      <View className="flex-row justify-between items-center mt-4">
        <Text className="text-orange-500 text-lg font-semibold">
          đ<Text className="text-black font-semibold">{item.price.toLocaleString()}</Text>
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}>
            <MaterialCommunityIcons name="minus-circle" size={24} color="black" />
          </TouchableOpacity>
          <TextInput className='h-9 p-1'
            style={styles.quantityInput}
            value={quantity.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setQuantity(Number(text))}
          />
          <TouchableOpacity onPress={() => setQuantity((prev) => prev + 1)}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  quantityInput: {
    width: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default CartItem;
