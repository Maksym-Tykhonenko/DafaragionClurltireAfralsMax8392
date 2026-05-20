import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette, spacing } from '../themeEmber/palette';

type Props = {
  eyebrow: string;
  title: string;
  trailing?: React.ReactNode;
};

export const AtlasCrown: React.FC<Props> = ({ eyebrow, title, trailing }) => (
  <View style={styles.wrap}>
    <View style={styles.col}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
    {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 4,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  col: { flex: 1 },
  eyebrow: {
    color: palette.muted,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    color: palette.bone,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  trailing: { marginLeft: 12 },
});

export default AtlasCrown;
