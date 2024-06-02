import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

type CustomButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#0066FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;