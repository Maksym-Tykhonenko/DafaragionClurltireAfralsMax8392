import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { palette, radius } from '../themeEmber/palette';
import { pressSpring } from '../motionForge/animUtils';

type Variant = 'primary' | 'ghost' | 'outline' | 'amber';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  icon?: React.ReactNode;
};

export const EmberButton: React.FC<Props> = ({ label, onPress, variant = 'primary', disabled, style, icon }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const vstyle = variantStyles[variant];
  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => pressSpring(scale, 0.96)}
      onPressOut={() => pressSpring(scale, 1)}
      onPress={onPress}>
      <Animated.View
        style={[
          styles.base,
          vstyle.container,
          disabled && styles.disabled,
          { transform: [{ scale }] },
          style,
        ]}>
        {icon ? <Animated.View style={{ marginRight: 8 }}>{icon}</Animated.View> : null}
        <Text style={[styles.label, vstyle.label, disabled && styles.disabledLabel]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.lg,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },
  disabled: { opacity: 0.5 },
  disabledLabel: { opacity: 0.8 },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: palette.ember },
    label: { color: palette.bone },
  }),
  amber: StyleSheet.create({
    container: { backgroundColor: palette.amber },
    label: { color: palette.ink },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: palette.smoke },
    label: { color: palette.bone },
  }),
  outline: StyleSheet.create({
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.faint },
    label: { color: palette.parchment },
  }),
};

export default EmberButton;
