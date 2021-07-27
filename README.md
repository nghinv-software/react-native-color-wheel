# @nghinv/react-native-color-wheel

React Native Color Wheel Library use reanimated 2

---

[![CircleCI](https://circleci.com/gh/nghinv-software/react-native-color-wheel.svg?style=svg)](https://circleci.com/gh/nghinv-software/react-native-color-wheel)
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]][all-contributors]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]

<p align="center">
<img src="./assets/demo.png" width="300"/>
</p>

## Installation

```sh
yarn add @nghinv/react-native-color-wheel
```

or 

```sh
npm install @nghinv/react-native-color-wheel
```

## Usage

```js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import ColorWheel, { ColorAnimated } from '@nghinv/react-native-color-wheel';
import { colors, useHsv } from '@nghinv/react-native-animated';
import Slider from '@nghinv/react-native-slider';

function App() {
  const [color, setColor] = useState('#0000ff');
  const isGestureActive = useSharedValue(false);
  const hsv = useHsv({
    h: 0,
    s: 0,
    v: 100,
  });

  useEffect(() => {
    const hsvValue = colors.hex2Hsv('#0000ff');
    hsv.h.value = hsvValue.h;
    hsv.s.value = hsvValue.s;
    hsv.v.value = hsvValue.v;
  }, [hsv]);

  const onChange = (v: number) => {
    hsv.v.value = v;
  };

  return (
    <View style={styles.container}>
      <ColorAnimated
        hsv={hsv}
        isGestureActive={isGestureActive}
        style={styles.currentColor}
      />
      <ColorWheel
        hsv={hsv}
        isGestureActive={isGestureActive}
        size={260}
        // initialColor={color}
        onColorChange={(value) => {
          // setColor(value);
          hsv.value = hex2Hsv(value);
        }}
        onColorConfirm={(value) => {
          console.log('onColorConfirm', value);
        }}
      />
      <Slider
        width={240}
        style={{ marginTop: 32 }}
        value={hsv.v.value}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  currentColor: {
    width: 80,
    height: 40,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default App;
```

# Property

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| initialColor | `string` | `#ffffff` |  |
| size | `number` | `screen_width - 32` |  |
| thumbSize | `number` | `32` |  |
| disabled | `boolean` | `false` |  |
| onColorChange | `(color: string) => void` | `undefined` |  |
| onColorConfirm | `(color: string) => void` | `undefined` |  |
| hsv | `HsvAnimated` | `undefined` |  |
| isGestureActive | `Animated.SharedValue<boolean>` | `undefined` |  |

---
## Credits

- [@Nghi-NV](https://github.com/Nghi-NV)


[version-badge]: https://img.shields.io/npm/v/@nghinv/react-native-color-wheel.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nghinv/react-native-color-wheel
[license-badge]: https://img.shields.io/npm/l/@nghinv/react-native-color-wheel.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[all-contributors]: #contributors
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
