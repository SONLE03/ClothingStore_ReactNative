import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type PasswordInputProps = {
  label: string;
  icon?: React.ReactNode;
  onChangeText: (text: string) => void;
  marginBottom?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search';
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  icon,
  onChangeText,
  marginBottom,
  keyboardType,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: marginBottom,
      }}
    >
      {icon}
      <TextInput
        placeholder={label}
        keyboardType={keyboardType}
        style={{ flex: 1, paddingVertical: 0, color: '#000000' }}
        secureTextEntry={!showPassword}
        onChangeText={onChangeText}
        placeholderTextColor="#000000"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Feather
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          color='#AD40AF'
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;