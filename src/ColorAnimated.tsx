/**
 * Created by nghinv on Wed Jul 14 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import equals from 'react-fast-compare';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { springConfig } from '@nghinv/react-native-animated';
import { hsv2Hex, HsvType } from './utils';

interface ColorAnimatedProps {
  hsv: Animated.SharedValue<HsvType>;
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
    const background = hsv2Hex(hsv.value.h, hsv.value.s, hsv.value.v);

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
