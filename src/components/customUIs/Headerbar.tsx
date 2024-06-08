import React from 'react'
import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';

import { COLORS, SPACING } from '../../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfileImg from './ProfileImg';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderBarProps {
    title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
    const navigation = useNavigation<NavigationProp<any>>();
    return (
        <View className="p-4 flex flex-row items-center justify-between bg-orange-500 shadow-xl mb-4">
            <TouchableOpacity className='rounded-xl' onPress={() => navigation.navigate('Home')}>
                <GradientBGIcon  name="home" color={COLORS.primaryOrangeHex} size={16} />
            </TouchableOpacity>
            <Text className="font-medium text-2xl text-white"> {title} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
                <Ionicons name="cart" size={24} color="white" />

            </TouchableOpacity>
        </View>
    );
};

export default HeaderBar;