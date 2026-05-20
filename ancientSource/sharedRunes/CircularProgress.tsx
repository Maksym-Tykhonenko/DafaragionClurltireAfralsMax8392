import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { palette } from '../themeEmber/palette';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  ringWidth?: number;
  progress: number; // 0..1
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
};

export const CircularProgress: React.FC<Props> = ({
  size,
  ringWidth = 10,
  progress,
  color = palette.ember,
  trackColor = palette.iron,
  children,
}) => {
  const radius = (size - ringWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const anim = useRef(new Animated.Value(0)).current;
  const [dash, setDash] = useState(circumference);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => {
      setDash(circumference * (1 - value));
    });
    return () => anim.removeListener(id);
  }, [progress, circumference, anim]);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={ringWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={ringWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dash}
          fill="none"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={styles.inner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  inner: { alignItems: 'center', justifyContent: 'center' },
});

export default CircularProgress;
