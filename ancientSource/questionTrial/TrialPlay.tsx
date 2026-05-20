import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '../themeEmber/palette';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';
import { useFadeRise } from '../motionForge/animUtils';
import { TrialQuestion } from '../dataBridge/types';

type Props = {
  questions: TrialQuestion[];
  perQSeconds: number;
  onFinish: (result: { correct: number; bestCombo: number }) => void;
};

export const TrialPlay: React.FC<Props> = ({ questions, perQSeconds, onFinish }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(perQSeconds);

  const { opacity, translate } = useFadeRise([index]);
  const barWidth = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    barWidth.setValue(1);
    Animated.timing(barWidth, {
      toValue: 0,
      duration: perQSeconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    setTimeLeft(perQSeconds);
  }, [index, perQSeconds, barWidth]);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [index]);

  useEffect(() => {
    if (timeLeft === 0 && !locked) {
      setLocked(true);
      setCombo(0);
      const t = setTimeout(() => advance(), 1100);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, locked]);

  const q = questions[index];

  const handlePick = (key: string) => {
    if (locked) return;
    setSelected(key);
    setLocked(true);
    const ok = key === q.correctKey;
    if (ok) {
      setCorrect(c => c + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo(b => Math.max(b, newCombo));
    } else {
      setCombo(0);
    }
  };

  const advance = () => {
    if (index >= questions.length - 1) {
      onFinish({ correct, bestCombo });
      return;
    }
    setIndex(i => i + 1);
    setSelected(null);
    setLocked(false);
  };

  const barColor = timeLeft > perQSeconds * 0.5 ? palette.jade : timeLeft > perQSeconds * 0.25 ? palette.amber : palette.ember;

  return (
    <Animated.View style={[styles.screen, { opacity, transform: [{ translateY: translate }] }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>WORLD ATLAS · TRIAL</Text>
          <Text style={styles.counter}>
            {index + 1} <Text style={styles.counterMuted}>/ {questions.length}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.barShell}>
        <View style={styles.barHead}>
          <Text style={styles.barCap}>Time remaining</Text>
          <Text style={styles.barTime}>{timeLeft}s</Text>
        </View>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.promptCard}>
        <Text style={styles.prompt}>{q.prompt}</Text>
      </View>

      <View style={styles.options}>
        {q.options.map(opt => {
          const isSelected = selected === opt.key;
          const isCorrect = locked && opt.key === q.correctKey;
          const isWrong = locked && isSelected && opt.key !== q.correctKey;
          return (
            <SoftPress
              key={opt.key}
              onPress={() => handlePick(opt.key)}
              style={styles.optWrap}
              disabled={locked}
              scaleTo={0.98}>
              <View
                style={[
                  styles.opt,
                  isCorrect && styles.optCorrect,
                  isWrong && styles.optWrong,
                ]}>
                <View
                  style={[
                    styles.optKey,
                    isCorrect && styles.keyCorrect,
                    isWrong && styles.keyWrong,
                  ]}>
                  {isCorrect ? (
                    <Glyph name="check" size={14} color={palette.bone} />
                  ) : isWrong ? (
                    <Glyph name="close" size={14} color={palette.bone} />
                  ) : (
                    <Text style={styles.optKeyLabel}>{opt.key}</Text>
                  )}
                </View>
                <Text style={styles.optText}>{opt.text}</Text>
              </View>
            </SoftPress>
          );
        })}
      </View>

      {locked ? (
        <SoftPress onPress={advance} scaleTo={0.97}>
          <View style={styles.next}>
            <Text style={styles.nextLabel}>
              {index >= questions.length - 1 ? 'See Results' : 'Next Question'}
            </Text>
            <Glyph name="arrowRight" size={16} color={palette.bone} />
          </View>
        </SoftPress>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    paddingHorizontal: spacing.screenH,
    paddingTop: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
    marginBottom: 4,
  },
  counter: { color: palette.bone, fontSize: 26, fontWeight: '800' },
  counterMuted: { color: palette.muted, fontSize: 18, fontWeight: '700' },
  barShell: { marginTop: 18 },
  barHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  barCap: {
    color: palette.haze,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  barTime: { color: palette.bone, fontSize: 12, fontWeight: '800' },
  barTrack: {
    height: 5,
    backgroundColor: palette.iron,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: 5, borderRadius: 3 },
  promptCard: {
    marginTop: 22,
    backgroundColor: palette.inkSoft,
    borderRadius: radius.lg,
    padding: 22,
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.iron,
  },
  prompt: {
    color: palette.bone,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  options: { marginTop: 18 },
  optWrap: { marginBottom: 10 },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.iron,
  },
  optCorrect: { borderColor: palette.jade, backgroundColor: '#0F2A1C' },
  optWrong: { borderColor: palette.ember, backgroundColor: '#2A0A12' },
  optKey: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.smoke,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  keyCorrect: { backgroundColor: palette.jade },
  keyWrong: { backgroundColor: palette.ember },
  optKeyLabel: { color: palette.bone, fontSize: 13, fontWeight: '800' },
  optText: { color: palette.bone, fontSize: 14.5, flex: 1, fontWeight: '600' },
  next: {
    marginTop: 18,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    color: palette.bone,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginRight: 8,
  },
});

export default TrialPlay;