import React, { useMemo, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { palette, spacing } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { ChipRow } from '../sharedRunes/ChipRow';
import { useFadeRise } from '../motionForge/animUtils';
import { relicCategories, relicsByCategory } from '../dataBridge/relicAtlas';
import { RelicCategory, RelicRecord } from '../dataBridge/types';
import { RelicListCard } from './RelicListCard';

type Filter = RelicCategory | 'all';

type Props = {
  onOpenRelic: (relic: RelicRecord) => void;
};

export const RelicExploreScreen: React.FC<Props> = ({ onOpenRelic }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const { opacity, translate } = useFadeRise([filter]);

  const list = useMemo(() => relicsByCategory(filter), [filter]);

  return (
    <View style={styles.screen}>
      <AtlasCrown eyebrow="WORLD ATLAS" title="Explore" />
      <ChipRow items={relicCategories} active={filter} onChange={setFilter} />

      <Animated.View
        style={[
          styles.listWrap,
          { opacity, transform: [{ translateY: translate }] },
        ]}>
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {list.map(item => (
            <RelicListCard key={item.id} relic={item} onPress={() => onOpenRelic(item)} />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  listWrap: { flex: 1, marginTop: 10 },
  listContent: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 4,
    paddingBottom: 32,
  },
});

export default RelicExploreScreen;
