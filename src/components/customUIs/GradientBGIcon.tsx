import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING } from '../../theme/theme';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Link, useNavigation } from '@react-navigation/native';
import HomeScreen from '../../screens/HomeScreen';

interface GradientBGIconProps {
  name: string;
  color: string;
  size: number;
}

const GradientBGIcon: React.FC<GradientBGIconProps> = ({name, color, size}) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity style={styles.Container} onPress={() => navigation.goBack()}>
      <LinearGradient 
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
      style={styles.LinearGradientBG}
      >
        <MaterialComunityIcons className='focus:rotate-180' name={name} color="white" size={size} />
        
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth:2,
    borderColor: COLORS.secondaryDarkGreyHex,
    borderRadius: SPACING.space_12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryDarkGreyHex,
    overflow: 'hidden',
  },

  LinearGradientBG: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GradientBGIcon;