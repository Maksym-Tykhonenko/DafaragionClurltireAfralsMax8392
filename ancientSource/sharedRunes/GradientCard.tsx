import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradientReeds, GradientStops } from '../themeEmber/palette';

type Props = {
  gradientKey?: string;
  colors?: GradientStops | string[];
  direction?: 'vertical' | 'horizontal' | 'diagonal';
  radius?: number;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
};

const dir = {
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
};

export const GradientCard: React.FC<Props> = ({
  gradientKey,
  colors,
  direction = 'diagonal',
  radius = 20,
  style,
  children,
}) => {
  const resolved = (colors ?? gradientReeds[gradientKey ?? 'emberFlare']) as string[];
  const { start, end } = dir[direction];
  return (
    <View style={[styles.frame, { borderRadius: radius }, style]}>
      <LinearGradient
        colors={resolved}
        start={start}
        end={end}
        style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: '#111014',
  },
  content: { flex: 1 },
});

export default GradientCard;
