import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {Button, Checkbox, Dialog} from 'react-native-paper';
import {OrderItem, ExistedCoupon, AddressInfo} from '../../types';
import {GetAllCoupons} from '../../api/coupon/GetAllCoupons';
import {GetAllAdressByCustomer} from '../../api/address/GetAllAdressByCustomer';
import {CreateOrder} from '../../api/order/CreateOrder';
import {GetVNPayUrl} from '../../api/order/VNPay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import HeaderBar from '../../components/customUIs/Headerbar';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DeleteProductInCart} from '../../api/cart/DeleteProductInCart';

type OrderScreenRouteProp = RouteProp<
  {params: {orderItems: OrderItem[]; amount: number}},
  'params'
>;

const OrderScreen = ({navigation}: any) => {
  const route = useRoute<OrderScreenRouteProp>();
  //const navigation = useNavigation();
  const {orderItems, amount} = route.params;

  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<ExistedCoupon[]>([]);
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  //const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<number>(0); // default to COD
  const [discount, setDiscount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(amount);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  console.log(selectedAddress);

  useEffect(() => {
    fetchCoupons();
    fetchAddresses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchSelectedAddress = async () => {
        const address = await AsyncStorage.getItem('address');
        if (address) {
          setSelectedAddress(JSON.parse(address));
        }
      };
      fetchSelectedAddress();
    }, []),
  );

  useEffect(() => {
    calculateDiscountAndTotal();
  }, [selectedCoupon]);

  const fetchCoupons = async () => {
    const response = await GetAllCoupons();
    if (!response) return;
    setCoupons(response);
  };

  const handleSetSelectedAddress = async () => {
    // const Address = await AsyncStorage.getItem('address');
    // //console.log(Address)
    // if (Address) {
    //   setSelectedAddress(JSON.parse(Address));
    //   //console.log(selectedAddress);
    // }
    navigation.navigate('ChooseAddress');
  };

  const fetchAddresses = async () => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (customerId !== null) {
      const ParseCustomerId = JSON.parse(customerId);
      const response = await GetAllAdressByCustomer(ParseCustomerId);
      setAddresses(response);
    }
  };

  const calculateDiscountAndTotal = () => {
    if (selectedCoupon) {
      const selectedCouponObj = coupons.find(
        coupon => coupon.id === selectedCoupon,
      );
      if (selectedCouponObj) {
        const discountValue = (amount * selectedCouponObj.discountValue) / 100;
        setDiscount(discountValue);
        setTotalAmount(amount - discountValue);
      }
    } else {
      setDiscount(0);
      setTotalAmount(amount);
    }
  };

  const handleCreateOrder = async () => {
    const customerId = await AsyncStorage.getItem('user_id');
    if (!customerId || !selectedAddress) {
      Alert.alert('Please select an address');
      return;
    }

    const ParseCustomerId = JSON.parse(customerId);

    const newOrder = {
      coupon: selectedCoupon || '', // Ensure coupon is a string
      customerId: ParseCustomerId,
      addressId: selectedAddress,
      paymentMethod: paymentMethod,
      orderItemRequestList: orderItems.map(item => ({
        productItemId: item.productItemId,
        quantity: item.quantity,
      })),
    };

    setLoading(true);

    try {
      const response = await CreateOrder(newOrder);
      const orderId = response;
      const amount = totalAmount;

      if (response.success) {
        setLoading(true);
        if (paymentMethod === 1) {
          const vnpayUrl = await GetVNPayUrl(
            amount,
            'Thanh toan don hang by VNPAY',
            orderId,
          );
          console.log(vnpayUrl);

          navigation.navigate('VNPayScreen', {vnpayUrl});
          const deleteCart = await DeleteProductInCart(
            ParseCustomerId,
            orderItems,
          );
          console.log(deleteCart);
        } else {
          Alert.alert('Order created successfully!');

          const deleteCart = await DeleteProductInCart(
            ParseCustomerId,
            orderItems,
          );
          console.log(deleteCart);
          // setTimeout(() => {
          //   navigation.navigate('History');
          // } , 2000);
        }
      } else {
        //Alert.alert('Order created successfully!');
        setLoading(false);
        setVisible(true);
        AsyncStorage.removeItem('address');
        setTimeout(() => {
          navigation.navigate('Home');
        }, 2000);
        const deleteCart = await DeleteProductInCart(
          ParseCustomerId,
          orderItems,
        );
        console.log(deleteCart);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Failed to create order!Pls try again');
      setVisible(false);
      //setLoading(false);
    }
  };

  const fetchSelctedAddress = async () => {
    const Address = await AsyncStorage.getItem('address');
    console.log(Address);
    if (Address) {
      setSelectedAddress(JSON.parse(Address));
      //console.log(selectedAddress);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <HeaderBar title="Order" />
      <ScrollView className="p-2">
        <View className="flex-row w-full h-0">
          {[...Array(75)].map((_, i) => (
            <View
              key={i}
              className={`w-8 h-1 ${
                i % 3 === 0
                  ? 'bg-red-500'
                  : i % 3 === 1
                  ? 'bg-white'
                  : 'bg-blue-500'
              }`}
            />
          ))}
        </View>
        <View className="flex flex-col bg-white fixed mt-1">
          <View className="flex-row w-full justify-start mt-1">
            <Ionicons
              className="mt-2 text-yellow-500"
              name="location"
              size={24}
              color="red"
            />
            <Text className="text-sm font-bold mt-2 text-black">
              Delivery Address
            </Text>
          </View>

          <TouchableOpacity
            className="p-1 flex flex-col rounded-lg bg-white h-20"
            onPress={handleSetSelectedAddress}>
            <Text style={styles.selectedAddress}>
              Selected Address:{' '}
              {addresses.find(address => address.id === selectedAddress)?.phone}{' '}
              -
              {
                addresses.find(address => address.id === selectedAddress)
                  ?.province
              }{' '}
              -
              {
                addresses.find(address => address.id === selectedAddress)
                  ?.district
              }{' '}
              -{addresses.find(address => address.id === selectedAddress)?.ward}{' '}
              -
              {
                addresses.find(address => address.id === selectedAddress)
                  ?.specificAddress
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row w-full h-5">
          {[...Array(75)].map((_, i) => (
            <View
              key={i}
              className={`w-8 h-1 ${
                i % 3 === 0
                  ? 'bg-red-500'
                  : i % 3 === 1
                  ? 'bg-white'
                  : 'bg-blue-500'
              }`}
            />
          ))}
        </View>

        <Text className="text-lg font-bold my-2 text-black">Order Items</Text>
        {orderItems?.map(item => (
          <View
            key={item.productItemId}
            className="flex-row items-center mb-2 border border-yellow-500 rounded-lg p-2 bg-white">
            <Image source={{uri: item.image}} className="w-32 h-32 mr-4" />
            <View className="flex-col justify-center space-y-3">
              <Text className="text-lg text-black">{item.product_Name}</Text>
              <Text style={styles.itemPrice}>
                Price: {item.price.toLocaleString()}đ
              </Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}

        <Text className="text-lg font-bold my-2 text-black">Select Coupon</Text>
        <View className="p-1 border border-orange-400 rounded-lg bg-white">
          <Picker
            selectedValue={selectedCoupon}
            onValueChange={itemValue => setSelectedCoupon(itemValue)}
            //style={styles.couponContainer}
            className="border border-yellow-500 rounded-lg p-2 bg-white text-gray-600">
            {coupons.map(coupon => (
              <Picker.Item
                style={styles.discount}
                key={coupon.id}
                label={`${coupon.name} -Discount: ${coupon.discountValue}%`}
                value={coupon.id}
              />
            ))}
          </Picker>
        </View>

        <Text className="text-lg font-semibold my-2 text-black">
          Select Payment Method
        </Text>
        <View className="flex flex-row mb-2 bg-white h-14 my-4 border border-yellow-500 w-full">
          <TouchableOpacity
            onPress={() => setPaymentMethod(1)}
            style={styles.paymentMethodButton}>
            <Checkbox
              color="#f97316"
              status={paymentMethod === 0 ? 'checked' : 'unchecked'}
            />
            <Text className="font-semibold text-black">Pay by Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaymentMethod(2)}
            style={styles.paymentMethodButton}>
            <Checkbox
              color="#f97316"
              status={paymentMethod === 1 ? 'checked' : 'unchecked'}
            />
            <Text className="font-semibold text-black">Pay via VNPay</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col justify-end items-end bg-white border border-yellow-500 p-2">
          <Text className="text-lg fixed left-0 font-bold my-2 underline text-black">
            Summary
          </Text>
          <Text className="text-green-500" style={styles.summaryText}>
            Total Price: {amount?.toLocaleString()}đ
          </Text>
          <Text className="text-green-500" style={styles.summaryText}>
            Discount: {discount?.toLocaleString()}đ
          </Text>
          <Text className="text-orange-600" style={styles.summaryText}>
            Shipping Fee: 35,000đ
          </Text>
          <Text className="text-red-500" style={styles.summaryText}>
            Total Amount: {(totalAmount + 35000).toLocaleString()}đ
          </Text>
        </View>
        <View className="mt-10"></View>
      </ScrollView>

      <Button
        loading={loading}
        mode="contained"
        onPress={handleCreateOrder}
        className="m-2 bg-yellow-500 rounded-xl">
        Create Order
      </Button>

      <Dialog
        style={{backgroundColor: '#F0FFF4'}}
        visible={visible}
        onDismiss={hideDialog}>
        <Dialog.Icon icon="sticker-check-outline" size={35} color="green" />
        <Dialog.Title className="text-center text-green-600 font-semibold">
          Congratulation! Purchase successfully!
        </Dialog.Title>
        <Dialog.Content>
          <Text className="text-center text-green-600">
            Thank you for buying our products, the products will be processed
            and delivery to you soon!
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: 'green',
  },
  discount: {
    fontSize: 14,
    color: 'black',
  },
  itemQuantity: {
    fontSize: 14,
    color: 'green',
  },
  couponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    marginBottom: 8,
  },
  couponCode: {
    fontSize: 14,
  },
  selectedCoupon: {
    fontSize: 14,
    color: 'blue',
  },
  couponDiscount: {
    fontSize: 14,
    color: 'red',
  },
  selectedAddress: {
    fontSize: 14,
    marginVertical: 8,
    color: 'gray',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addressContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    marginBottom: 8,
  },
  addressDetails: {
    fontSize: 14,
  },
});

export default OrderScreen;
