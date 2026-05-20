import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  colors: string[];
  locations?: number[];
  direction?: 'vertical' | 'horizontal' | 'diagonal';
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
};

const dirMap = {
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
};

export const MysticGradient: React.FC<Props> = ({
  colors,
  locations,
  direction = 'vertical',
  style,
  children,
  pointerEvents,
}) => {
  const { start, end } = dirMap[direction];
  return (
    <LinearGradient
      colors={colors}
      locations={locations as any}
      start={start}
      end={end}
      style={[styles.base, style]}
      pointerEvents={pointerEvents}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  base: {},
});

export default MysticGradient;
