import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { palette, radius } from '../themeEmber/palette';
import { RelicRecord } from '../dataBridge/types';
import { project, gridLines } from './canvasMath';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';

type Props = {
  relics: RelicRecord[];
  selectedId?: string | null;
  onSelect: (relic: RelicRecord) => void;
};

export const AtlasCanvas: React.FC<Props> = ({ relics, selectedId, onSelect }) => {
  const [box, setBox] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    setBox({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const { xs, ys } = box.width > 0 ? gridLines(box) : { xs: [], ys: [] };

  return (
    <View style={styles.canvas} onLayout={onLayout}>
      {/* Continent silhouettes */}
      <View style={[styles.land, { left: '6%', top: '14%', width: '34%', height: '46%' }]} />
      <View style={[styles.land, { left: '18%', top: '50%', width: '22%', height: '38%' }]} />
      <View style={[styles.land, { left: '40%', top: '20%', width: '50%', height: '54%' }]} />
      <View style={[styles.landSoft, { left: '14%', top: '20%', width: '24%', height: '32%' }]} />
      <View style={[styles.landSoft, { left: '46%', top: '24%', width: '36%', height: '40%' }]} />

      {/* Latitude / longitude grid */}
      {xs.map((x, i) => (
        <View
          key={`x${i}`}
          style={{
            position: 'absolute',
            left: x,
            top: 0,
            bottom: 0,
            width: StyleSheet.hairlineWidth,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />
      ))}
      {ys.map((y, i) => (
        <View
          key={`y${i}`}
          style={{
            position: 'absolute',
            top: y,
            left: 0,
            right: 0,
            height: StyleSheet.hairlineWidth,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />
      ))}

      {/* Equator + meridian emphasis */}
      <View
        style={{
          position: 'absolute',
          top: '40%',
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(230,169,59,0.18)',
        }}
      />

      {/* Compass rose */}
      <View style={styles.compass}>
        <Glyph name="compass" size={22} color={palette.amber} strokeWidth={1.6} />
        <Text style={styles.compassLabel}>N</Text>
      </View>

      {/* Scale */}
      <View style={styles.scale}>
        <View style={styles.scaleBar} />
        <Text style={styles.scaleText}>~ 2000 km</Text>
      </View>

      {/* Markers */}
      {box.width > 0
        ? relics.map(r => {
            const p = project(r.coordinates.lat, r.coordinates.lng, box);
            return (
              <Marker
                key={r.id}
                relic={r}
                isSelected={r.id === selectedId}
                x={p.x}
                y={p.y}
                onPress={() => onSelect(r)}
              />
            );
          })
        : null}
    </View>
  );
};

const Marker: React.FC<{
  relic: RelicRecord;
  x: number;
  y: number;
  isSelected: boolean;
  onPress: () => void;
}> = ({ x, y, isSelected, onPress }) => {
  const scale = useRef(new Animated.Value(isSelected ? 1.2 : 1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.25 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
    if (isSelected) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    return undefined;
  }, [isSelected, scale, pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.4] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: x - 16, top: y - 38 }}>
      {isSelected ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 4,
            top: 22,
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: palette.ember,
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          }}
        />
      ) : null}
      <SoftPress onPress={onPress} hitSlop={10} scaleTo={0.86}>
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
          <View style={styles.pinBody}>
            <View style={styles.pinDot} />
          </View>
          <View style={styles.pinStem} />
        </Animated.View>
      </SoftPress>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#0C0C12',
    overflow: 'hidden',
    position: 'relative',
  },
  land: {
    position: 'absolute',
    backgroundColor: '#171823',
    borderRadius: 90,
    opacity: 0.95,
  },
  landSoft: {
    position: 'absolute',
    backgroundColor: '#1E1F2A',
    borderRadius: 70,
    opacity: 0.6,
  },
  compass: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(8,8,11,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(230,169,59,0.25)',
  },
  compassLabel: {
    position: 'absolute',
    top: -1,
    color: palette.amber,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  scale: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    alignItems: 'flex-start',
  },
  scaleBar: {
    width: 50,
    height: 3,
    backgroundColor: palette.parchment,
    borderRadius: 2,
  },
  scaleText: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  pinBody: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.ember,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.ember,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4,
  },
  pinDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFD6DC',
  },
  pinStem: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: palette.ember,
    marginTop: -2,
  },
});

export default AtlasCanvas;
