import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native-reanimated/lib/typescript/Animated";

const OfferCard = () => {
    return (
        <View className="flex-row max-w-[2] mr-6 max-h-[160px] overflow-hidden
        bg-[#c7c7c7] rounded-2x1">
            <View className="px-4 py-2">
                <Text className="font-extrabold text-2x1">50% Off</Text>
                <Text className="text-lg">On everything today</Text>
                <Text className="text-xs my-2">With code: ABCDE</Text>

                <Pressable className="bg-black 2-20 rounded-2xl">
                    <Text className="text-white text-xs font-semibold mx-3 my-1">Get now</Text>
                </Pressable>
            </View>

            <View>
                <Image className="h-[150px] w-[55px] object-contain"/>
            </View>
        </View>
    )
}

export default OfferCard

const styles = StyleSheet.create({})