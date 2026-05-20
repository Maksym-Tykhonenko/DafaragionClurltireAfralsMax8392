import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radius } from '../themeEmber/palette';
import { Glyph, GlyphName } from './Glyph';
import { SoftPress } from './SoftPress';

type Variant = 'pill' | 'square';

type Props = {
  name: GlyphName;
  onPress?: () => void;
  size?: number;
  color?: string;
  background?: string;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
  strokeWidth?: number;
};

export const IconButton: React.FC<Props> = ({
  name,
  onPress,
  size = 38,
  color = palette.bone,
  background = 'rgba(8,8,11,0.55)',
  variant = 'pill',
  style,
  strokeWidth = 2,
}) => (
  <SoftPress onPress={onPress} hitSlop={6}>
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: variant === 'pill' ? size / 2 : radius.md,
          backgroundColor: background,
        },
        style,
      ]}>
      <Glyph name={name} size={Math.round(size * 0.48)} color={color} strokeWidth={strokeWidth} />
    </View>
  </SoftPress>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});

export default IconButton;
