import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { palette, radius, spacing } from '../themeEmber/palette';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';
import { CipherWord } from '../dataBridge/types';
import {
  applyReveal,
  buildSlots,
  checkAnswer,
  hasHiddenLetters,
  HintState,
  initialHintState,
  Slot,
} from './cipherEngine';
import { MaskedWordRow } from './MaskedWordRow';

type Props = {
  words: CipherWord[];
  perSeconds: number;
  onFinish: (out: {
    score: number;
    solved: number;
    bestCombo: number;
    hintsUsed: number;
    timeLeft: number;
  }) => void;
};

const COMBO_BONUS = 5;
const BASE_POINTS = 10;
const HINT_PENALTY = 2;

export const CipherPlay: React.FC<Props> = ({ words, perSeconds, onFinish }) => {
  const [index, setIndex] = useState(0);
  const [slots, setSlots] = useState<Slot[]>(() => buildSlots(words[0]));
  const [hints, setHints] = useState<HintState>(initialHintState);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [solved, setSolved] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(perSeconds);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const word = words[index];
  const clueOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setSlots(buildSlots(words[index]));
    setHints(initialHintState);
    setInput('');
    setFeedback('idle');
    clueOpacity.setValue(0);
    barWidth.setValue(1);
    setTimeLeft(perSeconds);
    Animated.timing(barWidth, {
      toValue: 0,
      duration: perSeconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [index, words, perSeconds, barWidth, clueOpacity]);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [index]);

  useEffect(() => {
    if (timeLeft <= 0) {
      const t = setTimeout(() => advance(), 200);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const submit = () => {
    if (feedback !== 'idle') return;
    const ok = checkAnswer(input, word.answer);
    if (ok) {
      setFeedback('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      const newBest = Math.max(bestCombo, newCombo);
      setBestCombo(newBest);
      const bonus = BASE_POINTS + newCombo * COMBO_BONUS;
      const newScore = score + bonus;
      const newSolved = solved + 1;
      setScore(newScore);
      setSolved(newSolved);
      setSlots(slots.map((s, i) => ({ ...s, letter: word.answer[i] })));
      setTimeout(
        () => advance({ score: newScore, solved: newSolved, bestCombo: newBest }),
        900,
      );
    } else {
      setFeedback('wrong');
      setCombo(0);
      setTimeout(() => setFeedback('idle'), 600);
    }
  };

  const advance = (snapshot?: { score: number; solved: number; bestCombo: number }) => {
    if (index >= words.length - 1) {
      onFinish({
        score: snapshot?.score ?? score,
        solved: snapshot?.solved ?? solved,
        bestCombo: snapshot?.bestCombo ?? bestCombo,
        hintsUsed,
        timeLeft,
      });
      return;
    }
    setIndex(i => i + 1);
  };

  const handleSkip = () => {
    setCombo(0);
    advance();
  };

  const useClue = () => {
    if (hints.clueShown) return;
    setHints(h => ({ ...h, clueShown: true }));
    setHintsUsed(h => h + 1);
    setScore(s => Math.max(0, s - HINT_PENALTY));
    Animated.timing(clueOpacity, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const useReveal1 = () => {
    if (hints.reveal1Used) return;
    if (!hasHiddenLetters(slots)) return;
    setSlots(applyReveal(slots, word));
    setHints(h => ({ ...h, reveal1Used: true }));
    setHintsUsed(h => h + 1);
    setScore(s => Math.max(0, s - HINT_PENALTY));
  };

  const useReveal2 = () => {
    if (hints.reveal2Used) return;
    if (!hasHiddenLetters(slots)) return;
    setSlots(applyReveal(slots, word));
    setHints(h => ({ ...h, reveal2Used: true }));
    setHintsUsed(h => h + 1);
    setScore(s => Math.max(0, s - HINT_PENALTY));
  };

  const reveal1Disabled = hints.reveal1Used || !hasHiddenLetters(slots);
  const reveal2Disabled = hints.reveal2Used || !hasHiddenLetters(slots);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>WORLD ATLAS · CIPHER</Text>
          <Text style={styles.counter}>
            Word {index + 1} <Text style={styles.counterMuted}>/ {words.length}</Text>
          </Text>
        </View>
        <View style={styles.scorePill}>
          <Glyph name="sparkle" size={11} color={palette.amber} fill={palette.amber} />
          <Text style={styles.scoreLabel}>  {score}</Text>
        </View>
      </View>

      <View style={styles.timerWrap}>
        <View style={styles.barHead}>
          <Text style={styles.timerLabel}>Time</Text>
          <Text style={styles.timerValue}>{timeLeft}s</Text>
        </View>
        <View style={styles.timerTrack}>
          <View style={[styles.timerSegment, { backgroundColor: palette.jade, flex: 1 }]} />
          <View style={[styles.timerSegment, { backgroundColor: palette.amber, flex: 1 }]} />
          <View style={[styles.timerSegment, { backgroundColor: palette.ember, flex: 1 }]} />
          <Animated.View
            style={[
              styles.timerCover,
              {
                width: barWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.eraBadge}>
        <Text style={styles.eraText}>{word.era.toUpperCase()}</Text>
      </View>

      <View style={styles.maskedWrap}>
        <MaskedWordRow slots={slots} feedback={feedback} />
      </View>

      <Animated.View
        style={{
          opacity: clueOpacity,
          paddingHorizontal: spacing.screenH,
          marginTop: 12,
        }}>
        <View style={styles.clueRow}>
          <Glyph name="bulb" size={13} color={palette.amber} />
          <Text style={styles.clueText}>  {word.clue}</Text>
        </View>
      </Animated.View>

      <View style={styles.inputWrap}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your answer..."
          placeholderTextColor={palette.muted}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={feedback === 'idle'}
          onSubmitEditing={submit}
          style={styles.input}
        />
        <SoftPress onPress={submit} disabled={feedback !== 'idle'} hitSlop={10} scaleTo={0.9}>
          <View style={styles.submitBtn}>
            <Glyph name="arrowRight" size={18} color={palette.bone} />
          </View>
        </SoftPress>
      </View>

      <View style={styles.hintRow}>
        <View style={styles.hintCell}>
          <HintBtn idx={1} label="Hint 1" used={hints.clueShown} onPress={useClue} />
        </View>
        <View style={styles.hintCell}>
          <HintBtn idx={2} label="Hint 2" used={hints.reveal1Used} disabled={reveal1Disabled} onPress={useReveal1} />
        </View>
        <View style={styles.hintCell}>
          <HintBtn idx={3} label="Hint 3" used={hints.reveal2Used} disabled={reveal2Disabled} onPress={useReveal2} />
        </View>
      </View>

      <View style={styles.skipWrap} pointerEvents="box-none">
        <SoftPress onPress={handleSkip} hitSlop={6} style={styles.skipInner}>
          <Text style={styles.skipText}>Skip this word →</Text>
        </SoftPress>
      </View>
    </KeyboardAvoidingView>
  );
};

const HintBtn: React.FC<{
  idx: number;
  label: string;
  used?: boolean;
  disabled?: boolean;
  onPress: () => void;
}> = ({ label, used, disabled, onPress }) => (
  <SoftPress onPress={onPress} disabled={used || disabled} style={styles.hintWrap} scaleTo={0.94}>
    <View
      style={[
        styles.hintBtn,
        used && styles.hintUsed,
        disabled && !used && styles.hintDisabled,
      ]}>
      <Glyph
        name="bulb"
        size={13}
        color={used || disabled ? palette.muted : palette.amber}
      />
      <Text
        style={[
          styles.hintLabel,
          (used || disabled) && { color: palette.muted },
        ]}>
        {'  '}
        {label}
      </Text>
    </View>
  </SoftPress>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    paddingHorizontal: spacing.screenH,
    paddingTop: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
    marginBottom: 4,
  },
  counter: { color: palette.bone, fontSize: 22, fontWeight: '800' },
  counterMuted: { color: palette.muted, fontSize: 16, fontWeight: '700' },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.inkSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(230,169,59,0.25)',
  },
  scoreLabel: { color: palette.amber, fontSize: 13, fontWeight: '800' },
  timerWrap: { marginTop: 16 },
  barHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timerLabel: {
    color: palette.haze,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  timerValue: { color: palette.bone, fontSize: 11, fontWeight: '800' },
  timerTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: palette.iron,
    position: 'relative',
  },
  timerSegment: { height: '100%' },
  timerCover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.ink,
  },
  eraBadge: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: palette.inkSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(230,169,59,0.45)',
    marginTop: 18,
  },
  eraText: {
    color: palette.amber,
    fontSize: 10,
    letterSpacing: 2.4,
    fontWeight: '800',
  },
  maskedWrap: { marginTop: 22, alignItems: 'center' },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.inkSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.iron,
  },
  clueText: { color: palette.parchment, fontSize: 12.5, flex: 1, lineHeight: 18 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: palette.inkSoft,
    borderWidth: 1,
    borderColor: palette.iron,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    height: 48,
    color: palette.bone,
    fontSize: 14,
    letterSpacing: 0.6,
  },
  submitBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  hintCell: { flex: 1 },
  hintWrap: { width: '100%' },
  hintBtn: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,55,90,0.25)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(99,118,193,0.35)',
  },
  hintUsed: {
    borderColor: palette.faint,
    backgroundColor: palette.ash,
  },
  hintDisabled: {
    borderColor: palette.faint,
    backgroundColor: palette.ash,
  },
  hintLabel: {
    color: '#9DB1E8',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skipWrap: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  skipInner: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.sm,
  },
  skipText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default CipherPlay;
