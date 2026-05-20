import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { palette, radius } from '../themeEmber/palette';

type Item<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  items: Item<T>[];
  active: T;
  onChange: (key: T) => void;
};

export function SegmentSwitch<T extends string>({ items, active, onChange }: Props<T>) {
  const slide = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = React.useState(0);
  const activeIdx = items.findIndex(i => i.key === active);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: activeIdx,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeIdx, slide]);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const segW = width / Math.max(1, items.length);

  return (
    <View style={styles.track} onLayout={onLayout}>
      {width > 0 ? (
        <Animated.View
          style={[
            styles.pill,
            {
              width: segW - 8,
              left: slide.interpolate({
                inputRange: items.map((_, i) => i),
                outputRange: items.map((_, i) => i * segW + 4),
              }),
            },
          ]}
        />
      ) : null}
      {items.map(it => {
        const isActive = it.key === active;
        return (
          <Pressable key={it.key} style={styles.cell} onPress={() => onChange(it.key)}>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    padding: 4,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: palette.iron,
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: radius.md - 4,
    backgroundColor: palette.ember,
  },
  cell: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    color: palette.parchment,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  activeLabel: {
    color: palette.bone,
  },
});

export default SegmentSwitch;
