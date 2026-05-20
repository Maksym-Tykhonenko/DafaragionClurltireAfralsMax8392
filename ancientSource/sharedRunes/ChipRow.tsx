import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '../themeEmber/palette';
import { SoftPress } from './SoftPress';

type Chip<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  items: Chip<T>[];
  active: T;
  onChange: (key: T) => void;
};

export function ChipRow<T extends string>({ items, active, onChange }: Props<T>) {
  return (
    <View style={styles.outer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map(it => {
          const isActive = it.key === active;
          return (
            <SoftPress
              key={it.key}
              onPress={() => onChange(it.key)}
              style={styles.wrap}
              scaleTo={0.94}>
              <View style={[styles.chip, isActive ? styles.chipActive : styles.chipIdle]}>
                <Text style={[styles.label, isActive ? styles.labelActive : styles.labelIdle]}>
                  {it.label}
                </Text>
              </View>
            </SoftPress>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    height: 40,
  },
  row: {
    paddingHorizontal: spacing.screenH,
    alignItems: 'center',
  },
  wrap: { marginRight: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: 'transparent', borderColor: palette.iron },
  chipActive: { backgroundColor: palette.ember, borderColor: palette.ember },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  labelIdle: { color: palette.parchment },
  labelActive: { color: palette.bone },
});

export default ChipRow;
