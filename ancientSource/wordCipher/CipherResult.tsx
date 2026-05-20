import React from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, spacing } from '../themeEmber/palette';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';

type Props = {
  score: number;
  solved: number;
  bestCombo: number;
  hintsUsed: number;
  timeLeft: number;
  onPlayAgain: () => void;
};

export const CipherResult: React.FC<Props> = ({
  score,
  solved,
  bestCombo,
  hintsUsed,
  timeLeft,
  onPlayAgain,
}) => {
  const onShare = async () => {
    try {
      await Share.share({
        message: `I scored ${score} on the Wyrm Culture Atlas word cipher — best combo x${bestCombo}.`,
      });
    } catch (_e) {}
  };

  return (
    <View style={styles.screen}>
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={['#1F7A52', '#0B2419']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.heroCard}>
          <View style={styles.heroInner}>
            <View style={styles.emblemHalo} />
            <Glyph name="swords" size={42} color={palette.jadeSoft} strokeWidth={1.5} />
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.statGrid}>
        <Stat value={String(solved)} label="Words Found" accent="jade" />
        <Stat value={`x${bestCombo}`} label="Best Streak" accent="ember" />
        <Stat value={String(hintsUsed)} label="Hints Used" accent="amber" />
        <Stat value={`${timeLeft}s`} label="Time Left" accent="amber" />
      </View>

      <View style={styles.footer}>
        <SoftPress onPress={onPlayAgain} scaleTo={0.97}>
          <View style={styles.primary}>
            <Text style={styles.primaryLabel}>Hunt Again</Text>
          </View>
        </SoftPress>
        <SoftPress onPress={onShare} style={{ marginTop: 10 }} scaleTo={0.97}>
          <View style={styles.share}>
            <Glyph name="share" size={16} color={palette.parchment} />
          </View>
        </SoftPress>
      </View>
    </View>
  );
};

const Stat: React.FC<{ value: string; label: string; accent: 'jade' | 'ember' | 'amber' }> = ({
  value,
  label,
  accent,
}) => {
  const colors = { jade: palette.jade, ember: palette.ember, amber: palette.amber };
  const icons = { jade: 'check', ember: 'flame', amber: 'bulb' } as const;
  return (
    <View style={styles.stat}>
      <Glyph name={icons[accent]} size={18} color={colors[accent]} />
      <Text style={[styles.statValue, { color: colors[accent] }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    paddingHorizontal: spacing.screenH,
    paddingTop: 32,
    paddingBottom: 24,
  },
  heroWrap: { alignItems: 'center' },
  heroCard: {
    width: 220,
    height: 220,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroInner: { alignItems: 'center', justifyContent: 'center' },
  emblemHalo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(63,198,138,0.18)',
  },
  scoreNumber: {
    color: palette.bone,
    fontSize: 44,
    fontWeight: '900',
    marginTop: 6,
  },
  scoreLabel: {
    color: 'rgba(236,232,222,0.7)',
    fontSize: 10,
    letterSpacing: 2.4,
    fontWeight: '700',
    marginTop: 4,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 32,
    rowGap: 12,
  },
  stat: {
    width: '48%',
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.iron,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  statLabel: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  footer: { marginTop: 'auto' },
  primary: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { color: palette.bone, fontSize: 15, fontWeight: '800', letterSpacing: 0.4 },
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

export default CipherResult;
