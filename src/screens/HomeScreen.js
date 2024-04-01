import { Pressable, SafeAreaView, StyleSheet, Text, View, TextInput, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import OfferCard from "../components/OfferCard";


const HomeScreen = (navigation) => {

    useEffect(() => {
        navigation.setOptionsI({
            headerShown:false

        })
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row px-5 mt-6 justify-between items-center">
                <View className="flex-row bg-black justify-center items-center rounded-full w-10 h-10">
                    <MaterialIcons name='menu' size={24} color={"#fff"}/>
                </View>
                <View>
                    <Pressable className="flex-row justify-center items-center border 
                    border-slate-400 rounded-full">
                        <Image className="h-12 w-12"/>
                        <Text className="font-semibold py-2 pr-4 pl-2">Login</Text>
                    </Pressable>
                </View>
            </View>

            <View className="mt-6 px-5">
                <Text className="font-bold text-2xl">Welcome, User</Text>
                <Text className="font-bold text-xl text-gray-500">Our Fashion App</Text>
            </View>

            <View className="mt-6 px-5">
                <View className="flex-row bg-gray-200 p-2 px-3 items-center rounded-3xl">
                    <View>
                        <MaterialIcon name='search' size={24} color={"#111"}/>
                    </View>

                    <TextInput 
                        placeholder='Search...'
                        placeholderTextColor={"#666666"}
                        className="px-2"
                    />
                </View>
            </View>

            <View className="mt-6 p-5">
                <OfferCard />
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})