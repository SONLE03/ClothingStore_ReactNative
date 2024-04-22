import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SplashView from './SplashView';
import RelaxView from './RelaxView';
import CareView from './CareView';
import MoodDiaryView from './MoodDiaryView';
import WelcomeView from './WelcomeView';
import TopBackSkipView from './TopBackSkipView';
import CenterNextButton from './CenterNextButton';
import SignupScreen from './Signup';
const IntroductionAnimationScreen = () => {
  const navigation = useNavigation();
  const window = useWindowDimensions();

  const [currentPage, setCurrentPage] = useState(0);

  const animationController = useRef(new Animated.Value(0));
  const animValue = useRef(0);

  useEffect(() => {
    animationController.current.addListener(({ value }) => {
      animValue.current = value;
      setCurrentPage(value);
    });
  }, []);

  const relaxTranslateY = animationController.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.height, 0, 0, 0, 0],
  });

  const playAnimation = useCallback(
    (toValue, duration = 1600) => {
      Animated.timing(animationController.current, {
        toValue,
        duration,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
        useNativeDriver: false,
      }).start();
    },
    [],
  );

  const onNextClick = useCallback(() => {
    let toValue;
    if (animValue.current === 0) {
      toValue = 0.2;
    } else if (animValue.current >= 0 && animValue.current <= 0.2) {
      toValue = 0.4;
    } else if (animValue.current > 0.2 && animValue.current <= 0.4) {
      toValue = 0.6;
    } else if (animValue.current > 0.4 && animValue.current <= 0.6) {
      toValue = 0.8;
    } else if (animValue.current > 0.6 && animValue.current <= 0.8) {
      // Nếu là trang cuối cùng, điều hướng tới trang đăng ký
      navigation.navigate('SignupScreen'); // Đảm bảo 'Signup' là tên màn hình của SignupScreen trong hệ thống điều hướng
      return; // Dừng hàm sau khi điều hướng
    }
  
    toValue !== undefined && playAnimation(toValue);
  }, [playAnimation, navigation]);
  

  const onBackClick = useCallback(() => {
    let toValue;
    if (animValue.current >= 0.2 && animValue.current < 0.4) {
      toValue = 0.0;
    } else if (animValue.current >= 0.4 && animValue.current < 0.6) {
      toValue = 0.2;
    } else if (animValue.current >= 0.6 && animValue.current < 0.8) {
      toValue = 0.4;
    } else if (animValue.current === 0.8) {
      toValue = 0.6;
    }

    toValue !== undefined && playAnimation(toValue);
  }, [playAnimation]);

  const onSkipClick = useCallback(() => {
    playAnimation(0.8, 1200);
  }, [playAnimation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgb(245, 235, 226)' }}>
      <StatusBar barStyle={`${currentPage > 0 ? 'dark' : 'light'}-content`} />
      <SplashView onNextClick={onNextClick} animationController={animationController} />

      <Animated.View
        style={[
          styles.scenesContainer,
          { transform: [{ translateY: relaxTranslateY }] },
        ]}
      >
        <RelaxView animationController={animationController} />

        <CareView animationController={animationController} />

        <MoodDiaryView animationController={animationController} />

        <WelcomeView animationController={animationController} />

        
      </Animated.View>

      <TopBackSkipView onBackClick={onBackClick} onSkipClick={onSkipClick} animationController={animationController} />

      <CenterNextButton onNextClick={onNextClick} animationController={animationController} />
    </View>
  );
};

const styles = StyleSheet.create({
  scenesContainer: {
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});

export default IntroductionAnimationScreen;
