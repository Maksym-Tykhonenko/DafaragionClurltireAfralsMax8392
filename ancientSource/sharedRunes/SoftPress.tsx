import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';
import { pressSpring } from '../motionForge/animUtils';

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  scaleTo?: number;
  hitSlop?: number;
};

export const SoftPress: React.FC<Props> = ({ onPress, disabled, style, children, scaleTo = 0.97, hitSlop }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={() => pressSpring(scale, scaleTo)}
      onPressOut={() => pressSpring(scale, 1)}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
};

export default SoftPress;
