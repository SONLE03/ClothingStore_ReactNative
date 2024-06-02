import React from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardTypeOptions } from 'react-native';
import { GestureResponderEvent } from 'react-native';

type InputFieldProps = {
  label: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (text: string) => void;
  icon?: JSX.Element;
  fieldButtonLabel?: string;
  fieldButtonFunction?: (event: GestureResponderEvent) => void;
  marginBottom?: number;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  keyboardType = "default",
  onChangeText,
  icon,
  fieldButtonLabel,
  fieldButtonFunction,
  marginBottom = 0,
}) => {
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
        style={{ flex: 1, paddingVertical: 0, color: '#000000'}}
        onChangeText={onChangeText}
        placeholderTextColor="#000000"
      />
      {fieldButtonLabel && fieldButtonFunction && (
        <TouchableOpacity onPress={fieldButtonFunction}>
          <Text style={{ color: '#AD40AF', fontWeight: '700' }}>{fieldButtonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;