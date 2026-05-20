import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '../themeEmber/palette';
import { Glyph, GlyphName } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';
import { ports, PortKey } from './PortKey';

type Props = {
  active: PortKey;
  onChange: (key: PortKey) => void;
};

const iconNameByPort: Record<PortKey, GlyphName> = {
  explore: 'pin',
  vault: 'bookmark',
  atlas: 'map',
  lore: 'book',
  trial: 'star',
  cipher: 'swords',
};

export const BottomNav: React.FC<Props> = ({ active, onChange }) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View style={[styles.shell, { paddingBottom: bottomPad + 6 }]}>
        <View style={styles.row}>
          {ports.map(port => (
            <NavCell
              key={port.key}
              label={port.label.toUpperCase()}
              isActive={port.key === active}
              iconName={iconNameByPort[port.key]}
              onPress={() => onChange(port.key)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const NavCell: React.FC<{
  label: string;
  iconName: GlyphName;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, iconName, isActive, onPress }) => {
  const fill = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: isActive ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isActive, fill]);

  const color = isActive ? palette.amber : palette.muted;
  const pillOpacity = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const pillScale = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const underlineWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });
  const iconScale = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <SoftPress onPress={onPress} style={styles.cell} scaleTo={0.94} hitSlop={4}>
      <View style={styles.cellInner}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            {
              opacity: pillOpacity,
              transform: [{ scale: pillScale }],
            },
          ]}
        />
        <View style={styles.content}>
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <Glyph
              name={iconName}
              size={22}
              color={color}
              strokeWidth={isActive ? 2.2 : 1.7}
            />
          </Animated.View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.label,
              {
                color,
                fontWeight: isActive ? '800' : '700',
              },
            ]}>
            {label}
          </Text>
          <Animated.View style={[styles.underline, { width: underlineWidth }]} />
        </View>
      </View>
    </SoftPress>
  );
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: palette.ink,
  },
  shell: {
    backgroundColor: '#080808',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(230,169,59,0.70)',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
      },
      android: {
        elevation: 18,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    justifyContent: 'space-around',
  },
  cell: {
    // flex: 1,
    paddingVertical: 2.5,
  },
  cellInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 4,
    position: 'relative',
    width: Dimensions.get('window').width * 0.97 / 6,
  },
  pill: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    bottom: 2,
    borderRadius: 16,
    backgroundColor: 'rgba(230,169,59,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(230,169,59,0.28)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  label: {
    fontSize: 10,
    marginTop: 5,
    letterSpacing: 1.3,
  },
  underline: {
    marginTop: 5,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.amber,
  },
});

export default BottomNav;