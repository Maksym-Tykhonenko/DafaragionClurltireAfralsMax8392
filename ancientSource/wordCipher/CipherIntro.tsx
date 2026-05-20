import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, spacing } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';

type Props = {
  wordCount: number;
  perSeconds: number;
  hintsPerWord: number;
  onEnter: () => void;
};

export const CipherIntro: React.FC<Props> = ({ wordCount, perSeconds, hintsPerWord, onEnter }) => (
  <View style={styles.screen}>
    <AtlasCrown eyebrow="WORLD ATLAS" title="Word Cipher" />
    <View style={styles.body}>
      <View style={styles.emblemWrap}>
        <LinearGradient
          colors={['rgba(217,38,63,0.25)', 'rgba(217,38,63,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.glow}
        />
        <LinearGradient
          colors={['#5A1020', '#1E0612']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emblemRing}>
          <Glyph name="scroll" size={56} color={palette.amber} strokeWidth={1.6} />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Decipher the Ancient Words</Text>
      <Text style={styles.subtitle}>
        Cultural words are hidden in ancient runes. Use hints to reveal letters. Solve before time runs out.
      </Text>

      <View style={styles.statRow}>
        <Stat value={String(wordCount)} label="Words" />
        <Stat value={`${perSeconds}s`} label="Time / W" />
        <Stat value={`${hintsPerWord}/word`} label="Hints" />
      </View>

      <SoftPress onPress={onEnter} scaleTo={0.97}>
        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>Enter the Codex</Text>
        </View>
      </SoftPress>
    </View>
  </View>
);

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
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
  },
  emblemWrap: { width: 220, height: 200, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  emblemRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217,38,63,0.45)',
  },
  title: {
    color: palette.bone,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 26,
    textAlign: 'center',
  },
  subtitle: {
    color: palette.haze,
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 26, width: '100%' },
  stat: {
    flex: 1,
    backgroundColor: palette.inkSoft,
    borderWidth: 1,
    borderColor: palette.iron,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: { color: palette.amber, fontSize: 22, fontWeight: '800' },
  statLabel: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  cta: {
    width: Dimensions.get('window').width * 0.9,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  ctaLabel: {
    color: palette.bone,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export default CipherIntro;
