import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { palette } from '../themeEmber/palette';
import { useSpin, usePulse } from '../motionForge/animUtils';
import { Glyph } from '../sharedRunes/Glyph';

type Props = {
  durationMs?: number;
  onComplete: () => void;
};

export const BootSigil: React.FC<Props> = ({ durationMs = 3400, onComplete }) => {
  const fastSpin = useSpin(7000);
  const slowSpin = useSpin(18000);
  const pulse = usePulse(0.4, 0.9, 1400);
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 700,
      delay: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = setTimeout(onComplete, durationMs);
    return () => clearTimeout(id);
  }, [durationMs, onComplete, progress, titleOpacity]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const reverseSpin = slowSpin;
  const reverse = Animated.multiply(slowSpin as unknown as Animated.Value, 1);

  return (
    <View style={styles.screen}>
      {/* Layered atlas backdrop */}
      <View style={styles.haze} />
      <View style={styles.hazeAlt} />

      {/* Outer rotating rune ring */}
      <View style={styles.center}>
        <Animated.View style={[styles.ringOuter, { transform: [{ rotate: fastSpin }] }]}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            return (
              <View
                key={i}
                style={[
                  styles.runeTick,
                  {
                    transform: [{ rotate: `${angle}deg` }, { translateY: -110 }],
                    backgroundColor: i % 6 === 0 ? palette.amber : palette.faint,
                    height: i % 6 === 0 ? 14 : 8,
                  },
                ]}
              />
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.ringInner, { transform: [{ rotate: reverseSpin }] }]}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360;
            return (
              <View
                key={i}
                style={[
                  styles.innerDot,
                  {
                    transform: [{ rotate: `${angle}deg` }, { translateY: -78 }],
                    backgroundColor: i % 3 === 0 ? palette.emberSoft : palette.amberDeep,
                  },
                ]}
              />
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.emblem, { opacity: pulse }]}>
          <Glyph name="compass" size={56} color={palette.amber} strokeWidth={1.6} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.titleBlock, { opacity: titleOpacity }]}>
        <Text style={styles.eyebrow}>WORLD ATLAS</Text>
        <Text style={styles.title}>Wyrm Culture Atlas</Text>
        <Text style={styles.body}>Aligning the runes of ancient cultures</Text>
      </Animated.View>

      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haze: {
    position: 'absolute',
    top: '20%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: palette.emberDeep,
    opacity: 0.16,
  },
  hazeAlt: {
    position: 'absolute',
    bottom: '18%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: palette.amberDeep,
    opacity: 0.12,
  },
  center: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  ringOuter: {
    position: 'absolute',
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runeTick: { position: 'absolute', width: 3, borderRadius: 2 },
  ringInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emblem: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: palette.faint,
    backgroundColor: '#1A1208',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    position: 'absolute',
    top: '15%',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  eyebrow: { color: palette.muted, fontSize: 11, letterSpacing: 3.2, fontWeight: '700' },
  title: { color: palette.bone, fontSize: 26, fontWeight: '800', marginTop: 6, letterSpacing: 0.6 },
  body: { color: palette.haze, fontSize: 13, marginTop: 6, letterSpacing: 0.4 },
  barTrack: {
    position: 'absolute',
    bottom: '14%',
    width: '60%',
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.iron,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    backgroundColor: palette.ember,
  },
});

export default BootSigil;
