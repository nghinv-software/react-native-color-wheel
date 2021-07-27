/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useEffect, useCallback } from 'react';
import equals from 'react-fast-compare';
import { colors, HsvAnimated, useHsv } from '@nghinv/react-native-animated';
import ColorWheelComponent, { ColorWheelComponentProps } from './ColorWheelComponent';

type ColorWheelComponentType = Omit<ColorWheelComponentProps, 'hsv' | 'onColorChange' | 'onColorConfirm'>;

export interface ColorWheelProps extends ColorWheelComponentType {
  initialColor?: string;
  onColorChange?: (color: string) => void;
  onColorConfirm?: (color: string) => void;
  hsv?: HsvAnimated;
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
  const hsv = props.hsv ?? useHsv({ h: 0, s: 0, v: 100 });

  useEffect(() => {
    if (initialColor) {
      const hsvColor = colors.hex2Hsv(initialColor!);
      hsv.h.value = hsvColor.h;
      hsv.s.value = hsvColor.s;
      hsv.v.value = hsvColor.v;
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
