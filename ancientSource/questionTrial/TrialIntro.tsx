import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, spacing } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';

type Props = {
  questionCount: number;
  secondsPerQ: number;
  onBegin: () => void;
};

export const TrialIntro: React.FC<Props> = ({ questionCount, secondsPerQ, onBegin }) => (
  <View style={styles.screen}>
    <AtlasCrown eyebrow="WORLD ATLAS" title="Trial of Lore" />
    <View style={styles.body}>
      <View style={styles.emblemWrap}>
        <LinearGradient
          colors={['rgba(230,169,59,0.30)', 'rgba(230,169,59,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.glow}
        />
        <View style={styles.emblemRing}>
          <View style={styles.emblemInner}>
            <Glyph name="trophy" size={56} color={palette.amber} strokeWidth={1.6} />
          </View>
        </View>
      </View>

      <Text style={styles.title}>Test Your Atlas Knowledge</Text>
      <Text style={styles.subtitle}>
        {questionCount} questions · Build combos · Claim your rank
      </Text>

      <View style={styles.statRow}>
        <Stat value={String(questionCount)} label="Questions" accent />
        <Stat value={`${secondsPerQ}s`} label="Time / Q" />
      </View>

      <SoftPress onPress={onBegin} scaleTo={0.97}>
        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>Begin the Trial</Text>
        </View>
      </SoftPress>
    </View>
  </View>
);

const Stat: React.FC<{ value: string; label: string; accent?: boolean }> = ({ value, label, accent }) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, accent && { color: palette.ember }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  body: { flex: 1, paddingHorizontal: spacing.screenH, alignItems: 'center', justifyContent: 'center' },
  emblemWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    borderWidth: 1,
    borderColor: 'rgba(230,169,59,0.3)',
    backgroundColor: 'rgba(20,16,10,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(230,169,59,0.45)',
    backgroundColor: '#1A1208',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: palette.bone,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 28,
    textAlign: 'center',
  },
  subtitle: {
    color: palette.haze,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  statRow: { flexDirection: 'row', gap: 12, marginTop: 28, width: '100%' },
  stat: {
    flex: 1,
    backgroundColor: palette.inkSoft,
    borderWidth: 1,
    borderColor: palette.iron,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: { color: palette.bone, fontSize: 24, fontWeight: '800' },
  statLabel: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  cta: {
    width: Dimensions.get('window').width * 0.9,
    height: 55,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  ctaLabel: {
    color: palette.bone,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export default TrialIntro;
