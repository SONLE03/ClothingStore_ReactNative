import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
// import Config from '../Config';

const MyPressable = ({ style, android_ripple = { color: 'lightgrey' }, touchOpacity = 0.4, children, ...restOfProps }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        style,
        { opacity: touchOpacity + 1},
      ]}
      android_ripple={android_ripple}
      {...restOfProps}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    // Define any default styles for the Pressable component here
  },
});

export default MyPressable;
