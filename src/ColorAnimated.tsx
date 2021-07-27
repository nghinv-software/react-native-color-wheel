/**
 * Created by nghinv on Wed Jul 14 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import equals from 'react-fast-compare';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { springConfig, colors, HsvAnimated } from '@nghinv/react-native-animated';

interface ColorAnimatedProps {
  hsv: HsvAnimated;
  style?: StyleProp<ViewStyle>;
  isGestureActive?: Animated.SharedValue<boolean>;
}

function ColorAnimated(props: ColorAnimatedProps) {
  const {
    hsv,
    style,
    isGestureActive,
  } = props;

  const containerStyle = useAnimatedStyle(() => {
    const background = colors.hsv2Hex(hsv.h.value, hsv.s.value, hsv.v.value);

    return {
      // @ts-ignore
      backgroundColor: isGestureActive?.value ? background : withSpring(background, springConfig),
    };
  });

  return (
    <Animated.View
      style={[style, containerStyle]}
    />
  );
}

export default React.memo(ColorAnimated, equals);
