import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, gradientReeds } from '../themeEmber/palette';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';
import { RelicRecord } from '../dataBridge/types';
import { keepKeys, readValue, toggleInList } from '../storeRelic/keep';

type Props = {
  relic: RelicRecord;
  onPress: () => void;
  refreshTick?: number;
};

export const RelicListCard: React.FC<Props> = ({ relic, onPress, refreshTick = 0 }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await readValue<(string | number)[]>(keepKeys.savedRelicIds, []);
      setSaved(list.includes(relic.id));
    })();
  }, [relic.id, refreshTick]);

  const onToggleSave = async () => {
    const next = await toggleInList(keepKeys.savedRelicIds, relic.id);
    setSaved(next.includes(relic.id));
  };

  const stops = (gradientReeds[relic.gradientKey] ?? gradientReeds.emberFlare) as [string, string];

  return (
    <SoftPress onPress={onPress} style={styles.wrap} scaleTo={0.985}>
      <View style={styles.card}>
        <LinearGradient
          colors={stops}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.row}>
          <View style={styles.thumbFrame}>
            <Image source={relic.image} style={styles.thumb} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <View style={styles.body}>
            <Text style={styles.name} numberOfLines={1}>
              {relic.name}
            </Text>
            <View style={styles.metaRow}>
              <Glyph name="pin" size={11} color={palette.parchment} />
              <Text style={styles.country}>  {relic.country}</Text>
            </View>
          </View>
          <SoftPress onPress={onToggleSave} hitSlop={12} style={styles.saveSlot} scaleTo={0.85}>
            <Glyph
              name={saved ? 'bookmarkFilled' : 'bookmark'}
              size={20}
              color={saved ? palette.amber : palette.bone}
              fill={saved ? palette.amber : 'none'}
            />
          </SoftPress>
        </View>
      </View>
    </SoftPress>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#15131A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  thumbFrame: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginRight: 14,
  },
  thumb: { width: '100%', height: '100%' },
  body: { flex: 1, justifyContent: 'center' },
  name: {
    color: palette.bone,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 5,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  country: { color: palette.parchment, fontSize: 12, letterSpacing: 0.3 },
  saveSlot: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RelicListCard;
