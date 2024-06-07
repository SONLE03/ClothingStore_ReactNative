// ProductDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GetDetailProduct } from '../api/product/GetProductDetails';
import { GetAllProducts } from '../api/product/GetAllProducts';
import { AddProductToCart } from '../api/cart/AddProductToCart';
import { Product, ProductItem } from '../types';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import ClothesCard from '../components/product/ClothesCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ParseJSON } from '../api/auth/parseJSON';
import HeaderBar from '../components/customUIs/Headerbar';

const ProductDetailsScreen = ({ navigation }: any) => {
  const route = useRoute();
  //const navigation = useNavigation();
  const { productId } = route.params as { productId: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isBuyNow, setIsBuyNow] = useState<boolean>(false);
  const [isReadMore, setIsReadMore] = useState<boolean>(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const fetchedProducts = await GetAllProducts();
        const fetchedProduct = fetchedProducts.data.find(product => product.id === productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          const detailedProduct = await GetDetailProduct(productId);
          setProductItems(detailedProduct);
          setSelectedImage(fetchedProduct.images[0]);
          const relatedProducts = fetchedProducts.data.filter(product => product.category === fetchedProduct.category && product.id !== productId);
          setSuggestedProducts(relatedProducts);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetails();
  }, [productId]);

  const handleSizeSelect = (sizeName: string) => {
    setSelectedSize(sizeName);
    setSelectedColor(null);
    setAvailableQuantity(null);
    setPrice(null);
  };

  const handleColorSelect = (colorName: string) => {
    if (!selectedSize) return;

    setSelectedColor(colorName);
    const selectedProductItem = productItems.find(item => item.sizeName === selectedSize && item.colorName === colorName);
    if (selectedProductItem) {
      setAvailableQuantity(selectedProductItem.quantity);
      setPrice(selectedProductItem.price);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) return;
    const selectedProductItem = productItems.find(item => item.sizeName === selectedSize && item.colorName === selectedColor);
    if (selectedProductItem) {
        const customerId = await AsyncStorage.getItem('user_id');
        if (customerId !== null) {
            const ParseCustomerId = ParseJSON(customerId);

            console.log(ParseCustomerId);
      
            await AddProductToCart(ParseCustomerId, selectedProductItem.id, quantity);
            setModalVisible(false);
            Alert.alert('Success', 'Product added to cart');
          } else {
            Alert.alert('Error', 'Failed to add');
          }
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor || !product) return;
  
    const selectedProductItem = productItems.find(
      item => item.sizeName === selectedSize && item.colorName === selectedColor
    );
  
    if (selectedProductItem) {
      const orderItem = {
        productItemId: selectedProductItem.id,
        sizeName: selectedSize,
        colorName: selectedColor,
        quantity,
        price: selectedProductItem.price,
        product_Name: product?.product_Name,
        image: product?.images[0]
      };
      navigation.navigate('OrderScreen', { orderItems: [orderItem], amount: quantity * selectedProductItem.price });
    }
  };
  

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

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

  const availableSizes = [...new Set(productItems?.map(item => item.sizeName))];
  const availableColors = selectedSize ? [...new Set(productItems.filter(item => item.sizeName === selectedSize).map(item => item.colorName))] : [];

  return (
    <View className="flex flex-col justify-between bg-gray-200">
        <ScrollView>
            <View>
                <HeaderBar title="Product Details" />
                <>
                <Image
                    source={{ uri: selectedImage || (product.images && product.images[0]) }}
                    style={{ width: '100%', height: 300, borderWidth: 0.5, borderColor: 'black' }}
                    resizeMode="cover"
                    className="rounded-lg mb-4"
                />

                <Text className="text-orange-600 text-lg font-semibold mb-1 mt-2">Other figures:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 mt-2">
                    
                    {product.images && product.images.length > 0 && product.images.map((img, index) => (
                        <TouchableOpacity key={index} onPress={() => setSelectedImage(img)} className="mr-2">
                            <Image 
                                source={{ uri: img }} 
                                style={{ 
                                    width: 80, 
                                    height: 80, 
                                    borderWidth: 2,
                                    borderColor: img === selectedImage ? 'orange' : 'white' 
                                }} 
                                className="rounded-lg"  
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>


                    <View className='flex-row justify-start items-center bg-orange-600 mt-2 p-1 mb-2'>
                        <Ionicons name="pricetags" size={24} color="white"/>
                        <Text className="text-white text-2xl font-medium mb-2 ml-2">{product.product_Name}</Text>
                    </View>
                    
                    <View className="flex-row justify-start items-center px-3 mt-2 bg-white h-14">
                    <Text className="text-black text-lg font-semibold">Price: </Text>
                    <Text className="text-orange-600 text-lg font-semibold">
                        ₫{product.price.toLocaleString()}</Text>
                    

                    <View className='flex-row justify-start items-center w-20 h-10 px-3'>
                        <View className='flex-row justify-start items-center w-28 h-6 border border-green-500 rounded-md mt-1 px-2 '>
                            <Text className='text-green-600 text-center font-semibold'>Free refunds</Text>
                        </View>
                    </View>
                    </View>

                    <Text className="text-black text-lg mb-2 font-semibold p-2 h-12 bg-white mt-4">Category: {product.category}</Text>
                    <View className='bg-white mt-2'>
                        <Text className="text-black text-lg font-semibold p-2">Description: </Text>
                        <Text className="text-black text-lg mb-2 p-4">
                        {product.description.length > 40 && !isReadMore
                            ? `${product.description.substring(0, 40)}... `
                            : product.description}
                        {product.description.length > 40 && (
                            <TouchableOpacity onPress={() => setIsReadMore(!isReadMore)}>
                            <Text className="text-blue-500">{isReadMore ? 'Read less' : 'Read more'}</Text>
                            </TouchableOpacity>
                        )}
                        </Text>
                    </View>
                    <FlatList className='mt-6 bg-white'
                        data={suggestedProducts} 
                        renderItem={renderClothesCard} 
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 4 }}
                    />
                </>
            </View>

        </ScrollView>

        <View className="flex-row absolute bottom-0 w-full justify-start items-center
         mt-4">
            <Button className='w-1/2 bg-green-600 rounded'
                mode="contained"
                icon="cart-outline"
                
                onPress={() => {
                setIsBuyNow(false);
                setModalVisible(true);
                }}
            >
                Add to Cart
            </Button>
            <Button className='w-1/2 bg-orange-600 rounded'
                mode="contained"
                icon="credit-card-outline"
                onPress={() => {
                setIsBuyNow(true);
                setModalVisible(true);
                }}
            >
                Buy Now
            </Button>
           
        </View>

        <Modal isVisible={isModalVisible}>
            <View className="bg-white p-4 rounded-lg">
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignSelf: 'flex-end' }}>
                <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-black text-lg font-semibold mb-2">Select Size:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {availableSizes.map(size => (
                <TouchableOpacity
                    key={size}
                    onPress={() => handleSizeSelect(size)}
                    className={`mr-2 px-5 py-2 rounded-2xl border ${selectedSize === size ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-gray-200'}`}
                >
                    <Text className={`${selectedSize === size ? 'text-white' : 'text-gray-500'}`}>{size}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>

            {selectedSize && (
                <>
                <Text className="text-black text-lg font-semibold mb-2">Select Color:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {availableColors.map(color => (
                    <TouchableOpacity
                        key={color}
                        onPress={() => handleColorSelect(color)}
                        className={`mr-2 px-5 py-2 rounded-2xl border ${selectedColor === color ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-gray-200'}`}
                    >
                        <Text className={`${selectedColor === color ? 'text-white' : 'text-gray-500'}`}>{color}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
                
                </>
            )}

            {availableQuantity !== null && price !== null && (
                <View>
                <Text className="text-black text-base mb-2">Quantity Available: {availableQuantity}</Text>
                <Text className="text-black text-base mb-4">Price: ${price.toLocaleString()}</Text>
                </View>
            )}

            <TextInput
                mode="outlined"
                label="Quantity"
                value={quantity.toString()}
                onChangeText={(text: any) => setQuantity(Number(text))}
                keyboardType="numeric"
                disabled={availableQuantity === 0}
                className="mb-4"
            />

            <Button className=' bg-orange-500 rounded-md'
                mode="contained"
                onPress={isBuyNow ? handleBuyNow : handleAddToCart}
                disabled={availableQuantity === 0}
            >
                {isBuyNow ? 'Buy Now' : 'Add to Cart'}
            </Button>
            </View>
        </Modal>
        
    </View>
  );
};

export default ProductDetailsScreen;
