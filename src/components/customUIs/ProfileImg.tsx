import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { COLORS, SPACING } from '../../theme/theme';



const ProfileImg = () => {
  return (
    <View style={styles.ImageContainer}>
      <Image 
        source={require('../../assets/app_images/avatar.png')} 
        style={styles.Image}

      />
    </View>
  );
};

const styles = StyleSheet.create({
    ImageContainer: {
        height: SPACING.space_36,
        width: SPACING.space_36,
        borderRadius: SPACING.space_12,
        borderColor: COLORS.secondaryDarkGreyHex,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: COLORS.primaryWhiteHex

    },

    Image: {
        height: SPACING.space_36,
        width: SPACING.space_36,

    },
});

export default ProfileImg;