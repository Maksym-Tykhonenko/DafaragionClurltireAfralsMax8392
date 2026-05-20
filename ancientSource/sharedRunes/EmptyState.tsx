import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../themeEmber/palette';
import { Glyph, GlyphName } from './Glyph';

type Props = {
  iconName?: GlyphName;
  title: string;
  body: string;
};

export const EmptyState: React.FC<Props> = ({ iconName = 'scroll', title, body }) => (
  <View style={styles.wrap}>
    <View style={styles.glyph}>
      <View style={styles.glow} />
      <Glyph name={iconName} size={32} color={palette.amber} strokeWidth={1.8} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 36, paddingVertical: 48 },
  glyph: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: palette.faint,
    backgroundColor: palette.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.amber,
    opacity: 0.08,
  },
  title: { color: palette.bone, fontSize: 18, fontWeight: '800', marginBottom: 6, letterSpacing: 0.2 },
  body: { color: palette.haze, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});

export default EmptyState;
