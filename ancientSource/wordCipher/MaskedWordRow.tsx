import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette } from '../themeEmber/palette';
import { Slot } from './cipherEngine';

type Props = {
  slots: Slot[];
  feedback?: 'idle' | 'correct' | 'wrong';
};

export const MaskedWordRow: React.FC<Props> = ({ slots, feedback = 'idle' }) => (
  <View style={styles.row}>
    {slots.map(s => (
      <Tile key={s.index} slot={s} feedback={feedback} />
    ))}
  </View>
);

const Tile: React.FC<{ slot: Slot; feedback: 'idle' | 'correct' | 'wrong' }> = ({
  slot,
  feedback,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(slot.letter == null ? 0.45 : 1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: slot.letter == null ? 0.45 : 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    if (slot.revealedByHint) {
      scale.setValue(1.25);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    }
  }, [slot.letter, slot.revealedByHint, opacity, scale]);

  const isCorrect = feedback === 'correct';
  const isWrong = feedback === 'wrong';
  const stateColors: [string, string] = isCorrect
    ? ['#16462E', '#0B2419']
    : isWrong
    ? ['#3D0E1A', '#1A0610']
    : slot.revealedByHint
    ? ['#3A2A08', '#1A1306']
    : slot.locked
    ? ['#1F2027', '#16171D']
    : ['#16171D', '#0E0F14'];

  const borderColor = isCorrect
    ? palette.jade
    : isWrong
    ? palette.ember
    : slot.revealedByHint
    ? palette.amber
    : palette.iron;

  const letterColor = isCorrect
    ? palette.jadeSoft
    : isWrong
    ? palette.emberSoft
    : slot.revealedByHint
    ? palette.amberSoft
    : palette.bone;

  return (
    <Animated.View
      style={[
        styles.tile,
        { borderColor, transform: [{ scale }] },
      ]}>
      <LinearGradient
        colors={stateColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.Text style={[styles.letter, { color: letterColor, opacity }]}>
        {slot.letter ?? '_'}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  tile: {
    width: 34,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    marginBottom: 6,
  },
  letter: { fontSize: 17, fontWeight: '800', letterSpacing: 1.5 },
});

export default MaskedWordRow;
