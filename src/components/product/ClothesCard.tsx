import React, { useEffect } from 'react';
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CARD_WIDTH = Dimensions.get('window').width * 0.32;

interface ClothesCardProps {
  id: string;
  product_Name: string;
  description: string;
  price: number;
  category: string;
  branch: string;
  productStatus: string;
  images: string[];
  buttonPressHandler: (product: any) => void;
}

const ClothesCard: React.FC<ClothesCardProps> = ({
  id,
  product_Name,
  description,
  price,
  category,
  branch,
  productStatus,
  images,
  buttonPressHandler,
}) => {

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <LinearGradient 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#FFF', '#FFF']}
      className="border border-orange-500 p-4 rounded-xl shadow-xl"
    >
      {images && images.length > 0 ? (
        <ImageBackground
          source={{ uri: images[0] }}
          style={{ width: CARD_WIDTH, height: CARD_WIDTH }}
          resizeMode="cover"
          className="rounded-lg mb-4 overflow-hidden"
        >
          <View className='w-full flex justify-end items-center bg-opacity-10'>
            <View className="flex-row border border-red-500 bg-opacity-5 items-start justify-start h-10 gap-2 p-1 absolute top-0 left-0 rounded-br-xl rounded-tl-lg">
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color="red"
              />
              </Animated.View>
              <Text className="text-red-500 text-base font-medium">New</Text>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={{ width: CARD_WIDTH, height: CARD_WIDTH }} className="rounded-lg mb-4 overflow-hidden bg-gray-300" />
      )}
      <Text className="text-black text-lg font-medium text-ellipsis overflow-visible h-10">{product_Name}</Text>
      <Text className="text-black text-xs font-light truncate">{category}</Text>
      <View className="flex-row justify-between items-center mt-4">
        <Text className="text-orange-500 text-lg font-semibold">
          đ<Text className="text-black font-semibold">{price.toLocaleString()}</Text>
        </Text>
        <TouchableOpacity className='bg-orange-500 p-2 rounded-lg'
          onPress={() => {
            buttonPressHandler({
              id,
              product_Name,
              description,
              price,
              category,
              branch,
              productStatus,
              images,
            });
          }}
        >
          <MaterialCommunityIcons
            color="#FFF"
            name={'plus'}
            size={15}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ClothesCard;
