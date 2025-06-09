import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../../types';
import ProductUtils from '../../util/DisplayPrice';
const FavouriteItemCard: React.FC<{
  item: Product;
  isChecked: boolean;
  onCheck: (productItemId: string, isChecked: boolean) => void;
  onDelete: (productItemId: string) => void;
}> = ({ item, isChecked, onCheck, onDelete }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#FFF', '#FFF']}
      style={styles.cardContainer}
    >
    <View className='w-full flex flex-row justify-between'>
      <View className='w-full' style={styles.cardContent}>
        {/* <CheckBox
          value={isChecked}
          onValueChange={(newValue) => onCheck(item.id, newValue)}
        /> */}
        {item.ImageSource ? (
          <ImageBackground
            source={{ uri: item.ImageSource}}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <View className='mr-2 flex-col'>
          <Text style={styles.productName}>{item.ProductName}</Text>
          <Text style={styles.productDetail}>Brand: {item.BrandName}</Text>
          <Text style={styles.productDetail}>Category: {item.CategoryName}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              đ<Text style={styles.priceValue}>{ProductUtils.getDisplayPrice(item.ProductVariants)}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity className=' right-0' onPress={() => onDelete(item.Id)}>
          <MaterialCommunityIcons name="trash-can" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
  },
  productDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6600',
  },
  priceValue: {
    color: '#000',
    fontWeight: '700',
  },
});

export default FavouriteItemCard;
