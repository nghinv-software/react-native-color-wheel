/**
 * Created by nghinv on Wed Jul 14 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import type Animated from 'react-native-reanimated';

export interface Vector<T = number> {
  x: T;
  y: T;
}

export declare const useVector: (x1?: number, y1?: number | undefined) => Vector<Animated.SharedValue<number>>;

export interface PolarPoint {
  theta: number;
  radius: number;
}

export const canvas2Cartesian = (v: Vector, center: Vector) => {
  'worklet';

  return {
    x: v.x - center.x,
    y: -1 * (v.y - center.y),
  };
};

export const cartesian2Canvas = (v: Vector, center: Vector) => {
  'worklet';

  return {
    x: v.x + center.x,
    y: -1 * v.y + center.y,
  };
};

export const cartesian2Polar = (v: Vector) => {
  'worklet';

  return {
    theta: Math.atan2(v.y, v.x),
    radius: Math.sqrt(v.x ** 2 + v.y ** 2),
  };
};

export const polar2Cartesian = (p: PolarPoint) => {
  'worklet';

  return {
    x: p.radius * Math.cos(p.theta),
    y: p.radius * Math.sin(p.theta),
  };
};

export const polar2Canvas = (p: PolarPoint, center: Vector) => {
  'worklet';

  return cartesian2Canvas(polar2Cartesian(p), center);
};

export const canvas2Polar = (v: Vector, center: Vector) => {
  'worklet';

  return cartesian2Polar(canvas2Cartesian(v, center));
};

export const toRadian = (theta: number) => {
  'worklet';

  return (theta * Math.PI) / 180;
};

export const toDeg = (theta: number) => {
  'worklet';

  return (theta * 180) / Math.PI;
};

const RGB_MAX = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

export function hex2Rgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function _normalizeAngle(degrees: number) {
  'worklet';

  return ((degrees % 360) + 360) % 360;
}

export const hsv2Rgb = (h: any, s: any, v: any) => {
  'worklet';

  if (typeof h === 'object') {
    const args = h;
    h = args.h; s = args.s; v = args.v;
  }

  h = _normalizeAngle(h);
  // @ts-ignore
  h = (h === HUE_MAX) ? 1 : (((h % HUE_MAX) / parseFloat(HUE_MAX)) * 6);
  // @ts-ignore
  s = (s === SV_MAX) ? 1 : ((s % SV_MAX) / parseFloat(SV_MAX));
  // @ts-ignore
  v = (v === SV_MAX) ? 1 : ((v % SV_MAX) / parseFloat(SV_MAX));

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return {
    r: Math.floor(r * RGB_MAX),
    g: Math.floor(g * RGB_MAX),
    b: Math.floor(b * RGB_MAX),
  };
};

export const rgb2Hex = (r: any, g: any, b: any) => {
  'worklet';

  if (typeof r === 'object') {
    const args = r;
    r = args.r; g = args.g; b = args.b;
  }
  r = Math.round(r).toString(16);
  g = Math.round(g).toString(16);
  b = Math.round(b).toString(16);

  r = r.length === 1 ? `0${r}` : r;
  g = g.length === 1 ? `0${g}` : g;
  b = b.length === 1 ? `0${b}` : b;

  return `#${r}${g}${b}`;
};

export function hsv2Hex(h: any, s: any, v: any) {
  'worklet';

  const rgb = hsv2Rgb(h, s, v);
  return rgb2Hex(rgb.r, rgb.g, rgb.b);
}

export function rgb2Hsv(r: any, g: any, b: any) {
  'worklet';

  if (typeof r === 'object') {
    const args = r;
    r = args.r; g = args.g; b = args.b;
  }

  // It converts [0,255] format, to [0,1]
  // @ts-ignore
  r = (r === RGB_MAX) ? 1 : ((r % RGB_MAX) / parseFloat(RGB_MAX));
  // @ts-ignore
  g = (g === RGB_MAX) ? 1 : ((g % RGB_MAX) / parseFloat(RGB_MAX));
  // @ts-ignore
  b = (b === RGB_MAX) ? 1 : ((b % RGB_MAX) / parseFloat(RGB_MAX));

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  const v = max;

  const d = max - min;

  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * HUE_MAX),
    s: Math.round(s * SV_MAX),
    v: Math.round(v * SV_MAX),
  };
}

export function hex2Hsv(hex: string) {
  'worklet';

  const rgb = hex2Rgb(hex)!;
  return rgb2Hsv(rgb.r, rgb.g, rgb.b);
}

export type HsvType = {
  h: number;
  s: number;
  v: number;
}
