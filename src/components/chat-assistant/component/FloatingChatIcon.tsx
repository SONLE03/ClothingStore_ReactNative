// components/chat/FloatingChatIcon.tsx
import React from 'react';
import {TouchableOpacity, View, Animated} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface FloatingChatIconProps {
  onPress: () => void;
  isVisible: boolean;
}

const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({
  onPress,
  isVisible,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 1000,
        transform: [{scale: scaleValue}],
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: 'opaque',
      }}>
      <TouchableOpacity
        onPress={handlePress}
        className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full shadow-lg items-center justify-center"
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <MaterialCommunityIcons name="assistant" size={28} color="orange" />
        <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
          <MaterialCommunityIcons name="robot" size={10} color="white" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingChatIcon;
