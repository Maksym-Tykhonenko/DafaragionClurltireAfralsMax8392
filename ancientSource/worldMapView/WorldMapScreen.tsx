import React, { useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { ChipRow } from '../sharedRunes/ChipRow';
import { Glyph } from '../sharedRunes/Glyph';
import { SoftPress } from '../sharedRunes/SoftPress';
import { useFadeRise } from '../motionForge/animUtils';
import { pickRandomRelic, relicCategories, relicsByCategory } from '../dataBridge/relicAtlas';
import { RelicCategory, RelicRecord } from '../dataBridge/types';
import { AtlasCanvas } from './AtlasCanvas';

type Filter = RelicCategory | 'all';

type Props = {
  focusedId?: string | null;
  onOpenRelic: (relic: RelicRecord) => void;
};

export const WorldMapScreen: React.FC<Props> = ({ focusedId, onOpenRelic }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(focusedId ?? null);
  const list = useMemo(() => relicsByCategory(filter), [filter]);
  const { opacity, translate } = useFadeRise([filter]);

  const onRandom = () => {
    const r = pickRandomRelic();
    setSelectedId(r.id);
    setTimeout(() => onOpenRelic(r), 320);
  };

  const onMarkerSelect = (r: RelicRecord) => {
    setSelectedId(r.id);
    setTimeout(() => onOpenRelic(r), 220);
  };

  return (
    <View style={styles.screen}>
      <AtlasCrown eyebrow="WORLD ATLAS" title="World Atlas" />
      <ChipRow items={relicCategories} active={filter} onChange={setFilter} />

      <Animated.View
        style={[
          styles.canvasWrap,
          { opacity, transform: [{ translateY: translate }] },
        ]}>
        <AtlasCanvas relics={list} selectedId={selectedId} onSelect={onMarkerSelect} />
      </Animated.View>

      <View style={styles.footer}>
        <SoftPress onPress={onRandom} scaleTo={0.97}>
          <View style={styles.randomBtn}>
            <Glyph name="flame" size={16} color={palette.bone} />
            <Text style={styles.randomLabel}>  Open randomly</Text>
          </View>
        </SoftPress>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  canvasWrap: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: spacing.screenH,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.iron,
  },
  footer: { paddingHorizontal: spacing.screenH, paddingVertical: 16 },
  randomBtn: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.ember,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  randomLabel: {
    color: palette.bone,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});

export default WorldMapScreen;
