import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING } from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfileImg from './ProfileImg';

interface HeaderBarProps {
    title?: string;

}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
  return (
    <View style={styles.HeaderContainer}>
        <GradientBGIcon name='menu' color={COLORS.primaryLightGreyHex} size={16} />
        <Text style={styles.HeaderText}> {title} </Text>
        <ProfileImg />
    </View>
  );
};

const styles = StyleSheet.create({
    HeaderContainer: {
        padding:SPACING.space_30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    HeaderText: {
        fontWeight: '500',
        fontSize: 20,
        color: COLORS.primaryWhiteHex,

    },
});

export default HeaderBar