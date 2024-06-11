import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Button, Image } from 'react-native';
import { AnimationConfig, Icon, IconElement, Tab, TabView } from '@ui-kitten/components';
import { GetAllOrderByCustomer } from '../../api/order/GetAllOrderByCustomer';
import { OrderDetails } from '../../api/order/OrderDetails';
import { UpdateOrderStatus } from '../../api/order/UpdateOrderStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import { Orders, OrderDetail } from '../../types';
import HeaderBar from '../../components/customUIs/Headerbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: Failed prop type: Invalid props.style key `tintColor` supplied to `Text`',
]);

const OrderHistoryScreen = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const fetchOrders = useCallback(async () => {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
            const ParseCustomerId = JSON.parse(userId);
            console.log(ParseCustomerId);
            const orders = await GetAllOrderByCustomer(ParseCustomerId);
            setOrders(orders);
            console.log(orders);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [fetchOrders])
    );

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleOrderClick = async (order: Orders) => {
        setSelectedOrder(order);
        const details = await OrderDetails(order.orderId);
        setOrderDetails(details);
        setModalVisible(true);
    };

    const handleCancelOrder = async () => {
        if (selectedOrder) {
            await UpdateOrderStatus(selectedOrder.orderId, 1);
            const userId = await AsyncStorage.getItem('user_id');
            if (userId) {
                const ParseCustomerId = JSON.parse(userId);
                const orders = await GetAllOrderByCustomer(ParseCustomerId);
                setOrders(orders);
                setModalVisible(false);
            }
        }
    };

    const renderTabContent = (status: string) => {
        const filteredOrders = orders?.filter(order => order.status === status);
        return (
            <ScrollView className="p-4">
                {filteredOrders && filteredOrders.length === 0 ? (
                    <View className="flex-1 justify-center items-center mt-20">
                        <Image source={require('../../assets/app_images/no-order.png')} style={{ width: 200, height: 200 }} />
                        <Text className="text-center text-lg text-gray-600 font-semibold mt-4">You don't have any available orders here</Text>
                    </View>
                ) : (
                    filteredOrders?.map(order => (
                        <TouchableOpacity
                            key={order.orderId}
                            className="mb-4 border p-4 rounded-2xl bg-white"
                            onPress={() => handleOrderClick(order)}
                        >
                            <View className="flex-row justify-between items-center border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-gray-600"><Ionicons name="calendar-outline" size={20} color="black" />  Order Date:</Text>
                                <Text className="text-gray-600">
                                    {new Intl.DateTimeFormat('default', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false // Use 24-hour format
                                    }).format(new Date(order.orderDate))}
                                </Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-2 border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-gray-600"> <Ionicons name="person-outline" size={20} color="black" /> Customer Name:</Text>
                                <Text className="text-gray-600">{order.customerName}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-2 border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-gray-600"><Ionicons name="call-outline" size={20} color="black" />  Customer Phone:</Text>
                                <Text className="text-gray-600">{order.customerPhone}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-2 border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-gray-600"><Ionicons name="cash-outline" size={20} color="black" />  Total bills:</Text>
                                <Text className="text-gray-600">{order.total}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
                <View className='mt-32'/>
            </ScrollView>
        );
    };

    return (
        <View className="flex-1">
            <HeaderBar title="Order History" />
            <TabView className="p-2" selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
                <Tab
                    title={<Text className="text-green-500">Completed</Text>}
                    className="h-20 text-green-500"
                    icon={<Ionicons name="checkmark-circle" size={24} color="green" />}
                >
                    {renderTabContent('COMPLETED')}
                </Tab>
                <Tab
                    title="Pending"
                    className="h-20"
                    icon={<Ionicons name="hourglass" size={24} color="orange" />}
                >
                    {renderTabContent('PENDING')}
                </Tab>
                <Tab
                    title="Delivering"
                    className="h-20"
                    icon={<MaterialCommunityIcons name="truck-delivery-outline" size={24} color="blue" />}
                >
                    {renderTabContent('DELIVERING')}
                </Tab>
                <Tab
                    title="Canceled"
                    className="h-20"
                    icon={<Ionicons name="close-circle" size={24} color="red" />}
                >
                    {renderTabContent('CANCELED')}
                </Tab>
            </TabView>

            <Modal visible={modalVisible} animationType="slide">
                <View className="p-4 flex-1">
                    <View className="flex-row justify-center items-center bg-orange-500 h-12 rounded-2xl p-2">
                        <Text className="text-xl font-bold text-center text-white "><Ionicons name="sparkles" size={25} color="white" /> Order Details</Text>
                    </View>  
                    
                    {selectedOrder && (
                        <>
                            <View className="flex-row justify-between items-center border border-b-gray-300 border-x-white border-t-white mt-16">
                                <Text className="font-bold text-lg text-gray-600"><Ionicons name="calendar-outline" size={20} color="black" />  Order Date:</Text>
                                <Text className="text-gray-600 text-lg">
                                    {new Intl.DateTimeFormat('default', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false // Use 24-hour format
                                    }).format(new Date(selectedOrder.orderDate))}
                                </Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-6 border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-lg text-gray-600"> <Ionicons name="person-outline" size={20} color="black" /> Customer Name:</Text>
                                <Text className="text-gray-600 text-lg">{selectedOrder.customerName}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-6 border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-lg text-gray-600"><Ionicons name="call-outline" size={20} color="black" />  Customer Phone:</Text>
                                <Text className="text-gray-600 text-lg">{selectedOrder.customerPhone}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-6 border border-b-gray-300 border-x-white border-t-white">
                                <Text className="font-bold text-lg text-gray-600"><Ionicons name="cash-outline" size={20} color="black" />  Total bills:</Text>
                                <Text className="text-gray-600 text-lg">{selectedOrder.total}</Text>
                            </View>
                        </>
                    )}
                    <ScrollView className="mt-2">
                    <DataTable className='mt-4 border border-gray-400 rounded-xl font-semibold text-lg text-center p-1 '>
                        <DataTable.Header>
                           
                            <DataTable.Title className='flex justify-start' textStyle={{ color: 'orange', fontSize: 16, fontWeight: 'bold' }}>Product Name</DataTable.Title>
                            <DataTable.Title className='flex justify-center' textStyle={{ color: 'orange', fontSize: 16, fontWeight: 'bold' }}>Quantity</DataTable.Title>
                            <DataTable.Title className='flex justify-center' textStyle={{ color: 'orange', fontSize: 16, fontWeight: 'bold' }}>Price</DataTable.Title>
                            <DataTable.Title className='flex justify-end' textStyle={{ color: 'orange', fontSize: 16, fontWeight: 'bold' }}>Total</DataTable.Title>
                        </DataTable.Header>
                        {orderDetails.map((item, index) => (
                            <DataTable.Row key={index}>
                                
                                <DataTable.Cell textStyle={{ color: 'black', fontSize: 16 }}>{item.productName}</DataTable.Cell>
                                <DataTable.Cell className='flex justify-center' textStyle={{ color: 'black', fontSize: 16 }}>{item.quantity}</DataTable.Cell>
                                <DataTable.Cell className='flex justify-center' textStyle={{ color: 'black', fontSize: 16 }}>{item.price}</DataTable.Cell>
                                <DataTable.Cell className='flex justify-end' textStyle={{ color: 'black', fontSize: 16 }}>{item.total}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                    </ScrollView>
                    
                    
                    {selectedOrder && selectedOrder.status === 'PENDING' && (
                        <View>
                            {/* <Button title="Cancel Order" onPress={() => setCancelModalVisible(true)} /> */}

                            <TouchableOpacity className= 'flex flex-row justify-center items-center h-12 border-orange-600 border p-2 rounded-xl mt-8' onPress={() => setCancelModalVisible(true)} >
                                <Text className="text-orange-600 font-bold text-lg">Cancel purchase</Text>
                            </TouchableOpacity>   

                            
                            
                        </View>
                    )}  

                    <TouchableOpacity className= 'flex flex-row justify-center items-center h-12 bg-orange-500 p-2 rounded-xl mt-8'  onPress={() => setModalVisible(false)} >
                        <Text className="text-white font-bold text-lg">Close</Text>
                    </TouchableOpacity>

                    </View>
                    <Modal visible={cancelModalVisible} animationType="slide" transparent={true}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{
                                    backgroundColor: 'white',
                                    padding: 20,
                                    width: '80%', // Control width
                                    borderRadius: 10, // Optional: for rounded corners
                                    shadowColor: '#000', // Optional: for shadow
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5
                                }}>
                                    <Text className="text-lg mb-4 text-center p-1 text-black"><Ionicons name="warning" size={30} color="#dd6b20"/> Are you sure want to cancel this order?</Text>
                                    <View className="flex-row w-full justify-center items-center space-x-4 mt-4">
                                        
                                        <TouchableOpacity className='flex justify-center items-center border border-orange-500 rounded-xl w-1/2 h-12' onPress={() => setCancelModalVisible(false)}>
                                            <Text className="text-lg font-semibold text-orange-600">Cancel</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity className='flex justify-center items-center bg-orange-500 rounded-xl w-1/2 h-12' onPress={handleCancelOrder}>
                                            <Text className="text-lg font-semibold text-white">OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                </View>
                            </Modal>  
            
            </Modal>
        </View>
    );
};

export default OrderHistoryScreen;
