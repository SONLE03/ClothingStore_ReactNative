import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyPressable from './MyPressable';

const IconPressable = Animated.createAnimatedComponent(Icon);

const NextButtonArrow = ({ onBtnPress }) => {
  const arrowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    arrowAnim.setValue(0); // Reset animation value
  }, []);

  const transitionAnim = arrowAnim.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [36, 0, 0],
  });
  const opacityAnim = arrowAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0, 1],
  });
  const iconTransitionAnim = arrowAnim.interpolate({
    inputRange: [0, 0.35, 0.85, 1],
    outputRange: [0, 0, -36, -36],
  });
  const iconOpacityAnim = arrowAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0, 0],
  });

  const widthAnim = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [58, 258],
  });

  const marginBottomAnim = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [38, 0],
  });

  const radiusAnim = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: widthAnim,
          borderRadius: radiusAnim,
          marginBottom: marginBottomAnim,
        },
      ]}
    >
      <MyPressable
        style={{ flex: 1, justifyContent: 'center' }}
        android_ripple={{ color: 'darkgrey' }}
        onPress={() => {
          Animated.timing(arrowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            onBtnPress();
            arrowAnim.setValue(0); // Reset animation after button press
          });
        }}
      >
        <Animated.View
          style={[
            styles.signupContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: transitionAnim }],
            },
          ]}
        >
          <Text style={styles.signupText}>Sign up</Text>

          {/* <Icon name="arrow-forward" size={24} color="white" /> */}
        </Animated.View>

        <IconPressable
          style={[
            styles.icon,
            {
              opacity: iconOpacityAnim,
              transform: [{ translateY: iconTransitionAnim }],
            },
          ]}
          name="arrow-forward-ios"
          size={24}
          color="white"
        />
      </MyPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: 'rgb(21, 32, 54)',
    overflow: 'hidden',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  signupText: {
    fontSize: 18,
    fontFamily: 'WorkSans-Medium',
    color: 'white',
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default NextButtonArrow;
