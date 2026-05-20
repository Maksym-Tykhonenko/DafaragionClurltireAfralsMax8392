import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { palette } from '../themeEmber/palette';

type Props = {
  label: string;
  accent?: string;
  style?: ViewStyle | ViewStyle[];
};

export const SectionLabel: React.FC<Props> = ({ label, accent = palette.amber, style }) => (
  <View style={[styles.row, style]}>
    <View style={[styles.dot, { backgroundColor: accent }]} />
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  dot: { width: 5, height: 5, borderRadius: 3, marginRight: 10 },
  text: { color: palette.muted, fontSize: 11, letterSpacing: 2, fontWeight: '700' },
});

export default SectionLabel;
