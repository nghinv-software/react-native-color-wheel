/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import { StyleSheet, Image, useWindowDimensions } from 'react-native';
import equals from 'react-fast-compare';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, withSpring, withTiming, runOnJS, useSharedValue } from 'react-native-reanimated';
import { springConfig, timingConfig, HsvAnimated, colors, vec, useVector, polar2Canvas, canvas2Polar, Vector } from '@nghinv/react-native-animated';

export interface ColorWheelComponentProps {
  hsv: HsvAnimated;
  isGestureActive?: Animated.SharedValue<boolean>;
  size?: number;
  thumbSize?: number;
  onColorChange: (color: string) => void;
  onColorConfirm: (color: string) => void;
  disabled?: boolean;
}

ColorWheelComponent.defaultProps = {
  thumbSize: 32,
  disabled: false,
};

function ColorWheelComponent(props: ColorWheelComponentProps) {
  const {
    thumbSize,
    hsv,
    onColorChange,
    onColorConfirm,
    disabled,
  } = props;
  const { width } = useWindowDimensions();
  const size = props.size ?? width - 32;
  const circleRadius = size / 2;
  const center = vec.create(circleRadius);
  const isGestureActive = props.isGestureActive ?? useSharedValue(false);
  const point = useVector(center.x, center.y);

  useAnimatedReaction(() => {
    const theta = (hsv.h.value * Math.PI) / 180;
    const radius = (hsv.s.value * circleRadius) / 100;
    return polar2Canvas({ theta, radius }, center);
  }, (position) => {
    if (!isGestureActive.value) {
      point.x.value = withTiming(position.x, timingConfig);
      point.y.value = withTiming(position.y, timingConfig);
    }
  });

  const processPan = (position: Vector<number>) => {
    'worklet';

    const polarPoint = canvas2Polar(position, center);
    const radius = Math.min(polarPoint.radius, circleRadius);
    const newPosition = polar2Canvas({
      theta: polarPoint.theta,
      radius,
    }, center);
    point.x.value = newPosition.x;
    point.y.value = newPosition.y;

    hsv.h.value = (polarPoint.theta * 180) / Math.PI;
    hsv.s.value = (radius * 100) / circleRadius;

    const color = colors.hsv2Hex(hsv.h.value, hsv.s.value, hsv.v.value);
    runOnJS(onColorChange)(color);
  };

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (event) => {
      isGestureActive.value = true;
      processPan({
        x: event.x,
        y: event.y,
      });
    },
    onActive: (event) => {
      processPan({
        x: event.x,
        y: event.y,
      });
    },
    onFinish: () => {
      const position = {
        x: point.x.value,
        y: point.y.value,
      };
      const polarPoint = canvas2Polar(position, center);

      if (polarPoint.radius < 10) {
        const newPosition = polar2Canvas({
          theta: 0,
          radius: 0,
        }, center);
        point.x.value = withSpring(newPosition.x, springConfig);
        point.y.value = withSpring(newPosition.y, springConfig);

        hsv.h.value = 0;
        hsv.s.value = 0;

        const color = colors.hsv2Hex(hsv.h.value, hsv.s.value, hsv.v.value);
        runOnJS(onColorChange)(color);
        runOnJS(onColorConfirm)(color);
      } else {
        const color = colors.hsv2Hex(hsv.h.value, hsv.s.value, hsv.v.value);
        runOnJS(onColorConfirm)(color);
      }
      isGestureActive.value = false;
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    const background = colors.hsv2Hex(hsv.h.value, hsv.s.value, 100);

    return {
      // @ts-ignore
      backgroundColor: isGestureActive.value ? background : withSpring(background, springConfig),
      transform: [
        { translateX: point.x.value },
        { translateY: point.y.value },
      ],
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      activeOffsetX={0}
      activeOffsetY={0}
      minDist={0}
      maxPointers={1}
      enabled={!disabled}
    >
      <Animated.View
        style={{ width: size, height: size }}
      >
        <Image
          source={require('./color-wheel.png')}
          resizeMode='contain'
          style={styles.image}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize! / 2,
              top: (-thumbSize! - 2) / 2,
              left: (-thumbSize! - 2) / 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  thumb: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default React.memo(ColorWheelComponent, equals);
