import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING } from '../../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfileImg from './ProfileImg';

interface HeaderBarProps {
    title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
    return (
        <View className="p-4 flex flex-row items-center justify-between bg-orange-500 shadow-xl mb-4">
            <GradientBGIcon name="home" color={COLORS.primaryOrangeHex} size={16} />
            <Text className="font-medium text-2xl text-white"> {title} </Text>
            <ProfileImg />
        </View>
    );
};

export default HeaderBar;