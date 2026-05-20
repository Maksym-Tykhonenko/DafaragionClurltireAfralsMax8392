import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Share, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { CircularProgress } from '../sharedRunes/CircularProgress';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';
import { rankFor } from './trialEngine';

type Props = {
  correct: number;
  total: number;
  bestCombo: number;
  onPlayAgain: () => void;
};

export const TrialResult: React.FC<Props> = ({ correct, total, bestCombo, onPlayAgain }) => {
  const pct = total > 0 ? correct / total : 0;
  const display = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = React.useState(0);

  useEffect(() => {
    display.setValue(0);
    Animated.timing(display, {
      toValue: pct,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = display.addListener(({ value }) => setShown(Math.round(value * 100)));
    return () => display.removeListener(id);
  }, [pct, display]);

  const rank = rankFor(pct * 100);
  const ringColor = pct >= 0.66 ? palette.jade : pct >= 0.34 ? palette.amber : palette.ember;

  const onShare = async () => {
    try {
      await Share.share({
        message: `I scored ${Math.round(pct * 100)}% on the Wyrm Culture Atlas trial — rank: ${rank}.`,
      });
    } catch (_e) {}
  };

  return (
    <View style={styles.screen}>
      <AtlasCrown eyebrow="WORLD ATLAS" title="Results" />
      <View style={styles.body}>
        <View style={styles.ringWrap}>
          <CircularProgress size={180} ringWidth={10} progress={pct} color={ringColor}>
            <Text style={styles.percent}>{shown}%</Text>
            <Text style={styles.subPercent}>
              {correct}/{total}
            </Text>
          </CircularProgress>
        </View>

        <View style={styles.rankPill}>
          <Glyph name="sparkle" size={12} color={palette.amber} fill={palette.amber} />
          <Text style={styles.rankLabel}>  {rank}</Text>
        </View>

        <View style={styles.statRow}>
          <Stat value={String(correct)} label="Correct" tone="amber" />
          <Stat value={`x${bestCombo}`} label="Best Combo" tone="ember" />
        </View>

        <SoftPress onPress={onPlayAgain} style={styles.primaryWrap} scaleTo={0.97}>
          <View style={styles.primary}>
            <Text style={styles.primaryLabel}>Challenge Again</Text>
          </View>
        </SoftPress>
        <SoftPress onPress={onShare} style={styles.shareWrap} scaleTo={0.97}>
          <View style={styles.share}>
            <Glyph name="share" size={16} color={palette.parchment} />
          </View>
        </SoftPress>
      </View>
    </View>
  );
};

const Stat: React.FC<{ value: string; label: string; tone: 'amber' | 'ember' }> = ({
  value,
  label,
  tone,
}) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, { color: tone === 'amber' ? palette.amber : palette.ember }]}>
      {value}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenH,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  percent: { color: palette.bone, fontSize: 32, fontWeight: '800', letterSpacing: 0.4 },
  subPercent: { color: palette.muted, fontSize: 11, marginTop: 4, letterSpacing: 1 },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.inkSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    marginTop: 22,
    borderWidth: 1,
    borderColor: 'rgba(230,169,59,0.35)',
  },
  rankLabel: { color: palette.amber, fontSize: 13, fontWeight: '800', letterSpacing: 0.4 },
  statRow: { flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' },
  stat: {
    flex: 1,
    backgroundColor: palette.inkSoft,
    borderWidth: 1,
    borderColor: palette.iron,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  primaryWrap: { width: Dimensions.get('window').width * 0.9, marginTop: 28 },
  primary: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { color: palette.bone, fontSize: 15, fontWeight: '800', letterSpacing: 0.4 },
  shareWrap: { width: Dimensions.get('window').width * 0.9, marginTop: 10 },
  share: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.inkSoft,
    borderWidth: 1,
    borderColor: palette.iron,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TrialResult;
