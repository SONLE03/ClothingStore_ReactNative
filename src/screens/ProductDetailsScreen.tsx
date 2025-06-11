// ProductDetailsScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {GetDetailProduct} from '../api/product/get-product-detail';
import {GetAllProducts} from '../api/product/get-product';
import {AddProductToCart} from '../api/cart/AddProductToCart';
import {Product, ProductItem} from '../types';
import {Button, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import ClothesCard from '../components/product/ItemCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ParseJSON} from '../api/auth/parseJSON';
import HeaderBar from '../components/customUIs/Headerbar';
import {AddProductToFavourite} from '../api/favourite/add-favorite-product';
import {LogBox} from 'react-native';
import ProductUtils from '../util/DisplayPrice';

LogBox.ignoreLogs([
  ' Warning: Each child in a list should have a unique "key" prop',
]);

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead',
]);

const reviews = [
  {
    id: 1,
    name: 'John Doe',
    rating: 5,
    review:
      'This product is amazing! The quality is top-notch and it fits perfectly.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 4,
    review:
      'Great value for money. I love the design and the material feels durable.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    rating: 3,
    review: 'The product is okay, but I expected more from the brand.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 4,
    name: 'Bob Brown',
    rating: 5,
    review: 'Absolutely love this! It exceeded my expectations in every way.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
];

const ProductDetailsScreen = ({navigation}: any) => {
  const route = useRoute();
  //const navigation = useNavigation();
  const {productId} = route.params as {productId: string};
  const [product, setProduct] = useState<Product | null>(null);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(
    null,
  );
  const [price, setPrice] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isBuyNow, setIsBuyNow] = useState<boolean>(false);
  const [isReadMore, setIsReadMore] = useState<boolean>(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [favourite, setFavourite] = useState<string | null>(null);

  console.log(productId);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const fetchedProducts = await GetAllProducts();
        const fetchedProduct = fetchedProducts.data.find(
          product => product.Id === productId,
        );
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setProductItems(fetchedProduct.ProductVariants || []);
          setSelectedImage(fetchedProduct.ImageSource);
          const relatedProducts = fetchedProducts.data.filter(
            product =>
              product.CategoryName === fetchedProduct.CategoryName &&
              product.Id !== productId,
          );
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

    setSelectedColor(colorName);
    const selectedProductItem = productItems.find(
      item => item.ColorName === colorName,
    );
    if (selectedProductItem) {
      setAvailableQuantity(selectedProductItem.Quantity);
      setPrice(selectedProductItem.Price);
    }
  };

  const handleAddToFavourite = async (productIds: string[]) => {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      const ParseCustomerId = JSON.parse(userId);
      const add = await AddProductToFavourite(ParseCustomerId, productIds);
      console.log(add);
      if (add == false) {
        ToastAndroid.showWithGravity(
          'Fail to add this product to Wishlist! Pls try again!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          'This product is added to Wishlist!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setFavourite(add);
      }
    }
  };

  const handleAddToCart = async () => {
    const selectedProductItem = productItems.find(
      item =>
        item.ColorName === selectedColor,
    );
    console.log('selectedProductItem HIHIHIHI', selectedProductItem);
    if (selectedProductItem && selectedProductItem.Quantity > quantity) {
      const customerId = await AsyncStorage.getItem('user_id');
      if (customerId !== null) {
        const ParseCustomerId = ParseJSON(customerId);

        console.log(ParseCustomerId);

        await AddProductToCart(
          ParseCustomerId,
          {
            productId: selectedProductItem.Id,
            dimension: selectedProductItem.DisplayDimension,
            colorId: selectedProductItem.ColorId,
            quantity: quantity,
          }
        );
        setModalVisible(false);
        ToastAndroid.showWithGravity(
          'This product is added to Cart! Check now!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        Alert.alert('Error', 'Failed to add');
      }
    }
  }; console.log('QUANTITY', quantity);

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor || !product) return;

    const selectedProductItem = productItems.find(
      item =>
        item.ColorName === selectedColor,
    );
    console.log('selectedProductItem', selectedProductItem);

    if (selectedProductItem) {
      const orderItem = {
        productItemId: selectedProductItem.Id,
        sizeName: selectedSize,
        colorName: selectedColor,
        quantity,
        price: selectedProductItem.Price,
        product_Name: product?.ProductName,
        image: product?.ImageSource,
      };
      navigation.navigate('OrderScreen', {
        orderItems: [orderItem],
        amount: quantity * selectedProductItem.Price,
      });
    }
  };

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderClothesCard = ({item}: {item: Product}) => (
    <View className="w-1/2 p-2">
      <ClothesCard
        id={item.Id}
        product_Name={item.ProductName}
        description={item.Description}
        price={item.DisplayPrice}
        category={item.CategoryName}
        branch={item.BrandName}
        images={[item.ImageSource]}
        buttonPressHandler={() =>
          navigation.navigate('ProductDetailsScreen', {productId: item.Id})
        }
      />
    </View>
  );

  const availableColors = [...new Set(productItems?.map(item => item.ColorName))];
  console.log('selectedProductItems', productItems);

  return (
    <View className="flex flex-col justify-between bg-gray-100">
      <ScrollView>
        <View>
          <HeaderBar title="Product Details" />
          <>
            <Image
              source={{
                uri: selectedImage || (product.ImageSource),
              }}
              style={{
                width: '100%',
                height: 300,
                borderWidth: 0,
                borderColor: 'black',
              }}
              resizeMode="cover"
              className="rounded-lg mb-4"
            />

            <Text className="text-gray-600 text-sm font-semibold mb-1 mt-2 px-4 mr-4">
              Other figures:
            </Text>
            <View className="flex flex-row w-full px-4 mb-4 mt-2">
              {product.ImageSource && (
                <TouchableOpacity
                  onPress={() => setSelectedImage(product.ImageSource)}
                  className="mr-2">
                  <Image
                    source={{uri: product.ImageSource}}
                    style={{
                      width: 80,
                      height: 80,
                      borderWidth: 2,
                      borderColor: product.ImageSource === selectedImage ? 'orange' : 'white',
                    }}
                    className="rounded-lg"
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row justify-between border-gray-200 border bg-white items-center p-1">
              <View className="flex flex-row justify-center items-center">
                <Ionicons name="pricetags" size={24} color="black" />
                <Text className="text-black text-2xl font-regular mb-2 ml-2">
                  {product.ProductName}
                </Text>
              </View>

              <TouchableOpacity
                className="w-10 h-8"
                onPress={() => handleAddToFavourite([productId])}>
                <Ionicons
                  name="heart"
                  size={30}
                  color={favourite ? 'white' : 'gray'}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-col bg-white">
              <View className="flex-row justify-start items-center px-3 bg-white h-14">
                <Text className="text-[#F24E2E] text-lg font-semibold">
                  đ{ProductUtils.getDisplayPrice(product.ProductVariants)}
                </Text>
                <Text className="text-gray-400 text-sm font-semibold ml-2 line-through">
                  đ{product.ProductVariants[0].Price.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-start items-center w-20 h-10 ">
                <View className="flex-row justify-start items-center w-28 h-6  rounded-md mt-1 px-2">
                  <Ionicons name="checkmark-circle" size={20} color="red" />
                  <Text className="text-red-600 text-center font-semibold">
                    Free refunds
                  </Text>
                </View>
                <View className="flex-row justify-start items-center w-28 h-6  rounded-md mt-1 px-2">
                  <Ionicons name="car" size={20} color="darkcyan" />
                  <Text className="text-cyan-600 text-center font-semibold">
                    Free delivery
                  </Text>
                </View>
              </View>
            </View>
            {/* help me add an delivery inform: truck icon + We will deliver your order from date now to future 5 date*/}
            <View className="flex-col bg-white border border-gray-200">
              <View className="flex-row justify-start items-center px-3 mt-2 bg-white">
                <Ionicons name="car" size={24} color="darkcyan" />
                <Text className="text-gray-600 text-sm ml-2">
                  We will deliver your order from{' '}
                </Text>
              </View>
              <Text className="text-red-600 text-sm ml-[46px]">
                {new Date().toLocaleDateString()} to{' '}
                {new Date(
                  Date.now() + 5 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString()}
              </Text>
              <Text className="text-gray-600 text-sm ml-[46px] mb-4">
                Free shipping on orders over $50
              </Text>
            </View>

            <Text className="text-black text-lg mb-2 font-regular p-2 h-12 bg-white mt-4">
              Category: {product.CategoryName}
            </Text>
            <View className="bg-white mt-2">
              <Text className="text-black text-lg font-regular p-2">
                Product description:{' '}
              </Text>
              <Text className="text-black text-sm mb-2 px-2">
                {product.Description.length > 40 && !isReadMore
                  ? `${product.Description.substring(0, 40)}... `
                  : product.Description}
                {product.Description.length > 40 && (
                  <TouchableOpacity onPress={() => setIsReadMore(!isReadMore)}>
                    <Text className="text-blue-500">
                      {isReadMore ? 'Read less' : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </Text>
            </View>

            <View className="bg-white mt-2 p-4">
              <View className="flex flex-row items-center mb-2">
                <Text className="text-black text-lg font-semibold mb-2">
                  4.5
                </Text>
                <View className="flex flex-row items-center mb-2">
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Ionicons name="star-half" size={20} color="#FFD700" />
                  <Text className="ml-2 text-gray-600">4.5 (4 reviews)</Text>
                </View>
              </View>

              {reviews.map(review => (
                <View className="flex flex-row items-center mb-2 border-b border-gray-200 pb-2">
                  <View>
                    <View className="flex flex-row items-center mb-2">
                      <Image
                        source={{
                          uri:
                            review.image ||
                            'https://randomuser.me/api/portraits/women/1.jpg',
                        }}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                        className="rounded-full"
                      />
                      <Text className="text-black text-SM font-REGULAR">
                        {review.name}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center">
                      {[...Array(review.rating)].map((_, index) => (
                        <Ionicons
                          key={index}
                          name="star"
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                    <Text className="text-gray-600">{review.review}</Text>
                    <Image
                      source={{
                        uri:
                          product.ImageSource ||
                          'https://randomuser.me/api/portraits/women/1.jpg',
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        marginTop: 5,
                      }}
                      className="rounded-lg"
                    />
                  </View>
                </View>
              ))}
            </View>

            <View className="bg-white mt-2 p-4 mb-12">
              <Text className="text-black text-lg font-regular mb-2 text-center">
                Other related products:
              </Text>
              <FlatList
                className="mt-6 bg-white"
                data={suggestedProducts}
                renderItem={renderClothesCard}
                numColumns={2}
                keyExtractor={item => item.Id}
                contentContainerStyle={{paddingHorizontal: 4}}
              />
            </View>
          </>
        </View>
      </ScrollView>

      <View
        className="flex-row absolute bottom-0 w-full justify-center items-center
         mt-4">
        <Button
          className="w-1/2 bg-teal-500 rounded-none h-[61px] flex justify-center items-center"
          mode="contained"
          icon="cart-outline"
          onPress={() => {
            setIsBuyNow(false);
            setModalVisible(true);
          }}>
          Add to Cart
        </Button>
        <Button
          className="w-1/2 bg-[#F24E2E] rounded-none h-[61px] flex justify-center items-center"
          mode="contained"
          //icon="credit-card-outline"
          onPress={() => {
            setIsBuyNow(true);
            setModalVisible(true);
          }}>
          <View className="flex-col justify-center items-center space-x-2">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="cash-outline" size={24} color="white" />
              <Text className="text-white">Buy Now</Text>
            </View>
            {/* <Text className="text-white text-xs">{product.price}</Text> */}
          </View>
        </Button>
      </View>

      <Modal isVisible={isModalVisible}>
        <View className="bg-white p-4 rounded-lg">
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{alignSelf: 'flex-end'}}>
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          {/* <Text className="text-black text-lg font-semibold mb-2">
            Select Size:
          </Text> */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4">
            {availableSizes.map(size => (
              <TouchableOpacity
                key={size}
                onPress={() => handleSizeSelect(size)}
                className={`mr-2 px-5 py-2 rounded-2xl border ${
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 bg-gray-200'
                }`}>
                <Text
                  className={`${
                    selectedSize === size ? 'text-white' : 'text-gray-500'
                  }`}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}

            <>
              <Text className="text-black text-lg font-semibold mb-2">
                Select Color:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4">
                {availableColors.map(color => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => handleColorSelect(color)}
                    className={`mr-2 px-5 py-2 rounded-2xl border ${
                      selectedColor === color
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 bg-gray-200'
                    }`}>
                    <Text
                      className={`${
                        selectedColor === color ? 'text-white' : 'text-gray-500'
                      }`}>
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>

          {availableQuantity !== null && price !== null && (
            <View>
              <Text className="text-black text-base mb-2">
                Quantity Available: {availableQuantity}
              </Text>
              <Text className="text-black text-base mb-4">
                Price: ${price.toLocaleString()}
              </Text>
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

          <Button //lassName=' bg-yellow-500 rounded-md'
            mode="contained"
            buttonColor="#F15927"
            onPress={isBuyNow ? handleBuyNow : handleAddToCart}
            disabled={
              availableQuantity === 0 || (availableQuantity ?? 0) < quantity
            }
            textColor="white">
            {isBuyNow ? 'Buy Now' : 'Add to Cart'}
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetailsScreen;
