/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useEffect, useCallback } from 'react';
import equals from 'react-fast-compare';
import Animated, { useSharedValue } from 'react-native-reanimated';
import ColorWheelComponent, { ColorWheelComponentProps } from './ColorWheelComponent';
import { hex2Hsv, HsvType } from './utils';

type ColorWheelComponentType = Omit<ColorWheelComponentProps, 'hsv' | 'onColorChange' | 'onColorConfirm'>;

export interface ColorWheelProps extends ColorWheelComponentType {
  initialColor?: string;
  onColorChange?: (color: string) => void;
  onColorConfirm?: (color: string) => void;
  hsv?: Animated.SharedValue<HsvType>;
}

ColorWheel.defaultProps = {
  initialColor: '#ffffff',
};

function ColorWheel(props: ColorWheelProps) {
  const {
    initialColor,
    onColorChange,
    onColorConfirm,
    ...otherProps
  } = props;
  const hsv = props.hsv ?? useSharedValue({ h: 0, s: 0, v: 100 });

  useEffect(() => {
    if (initialColor) {
      const hsvColor = hex2Hsv(initialColor!);
      hsv.value = hsvColor;
    }
  }, [initialColor, hsv]);

  const onWheelColorChange = useCallback((color) => {
    onColorChange?.(color);
  }, []);

  const onWheelColorConfirm = useCallback((color) => {
    onColorConfirm?.(color);
  }, []);

  return (
    <ColorWheelComponent
      {...otherProps}
      hsv={hsv}
      onColorChange={onWheelColorChange}
      onColorConfirm={onWheelColorConfirm}
    />
  );
}

export default React.memo(ColorWheel, equals);
