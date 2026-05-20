import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { palette, spacing } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { EmptyState } from '../sharedRunes/EmptyState';
import { SectionLabel } from '../sharedRunes/SectionLabel';
import { RelicListCard } from '../relicExplore/RelicListCard';
import { useFadeRise } from '../motionForge/animUtils';
import { relicById } from '../dataBridge/relicAtlas';
import { RelicRecord } from '../dataBridge/types';
import { keepKeys, readValue } from '../storeRelic/keep';
import { RecentChip } from './RecentChip';

type Props = {
  onOpenRelic: (relic: RelicRecord) => void;
  visitTick: number;
};

export const SavedVaultScreen: React.FC<Props> = ({ onOpenRelic, visitTick }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);
  const { opacity, translate } = useFadeRise([visitTick, refreshTick]);

  useEffect(() => {
    (async () => {
      const s = await readValue<(string | number)[]>(keepKeys.savedRelicIds, []);
      const r = await readValue<(string | number)[]>(keepKeys.recentRelicIds, []);
      setSavedIds(s.map(String));
      setRecentIds(r.map(String));
    })();
  }, [visitTick, refreshTick]);

  const savedRelics = savedIds
    .map(id => relicById.get(id))
    .filter(Boolean) as RelicRecord[];
  const recentRelics = recentIds
    .map(id => relicById.get(id))
    .filter(Boolean) as RelicRecord[];

  const handlePress = (r: RelicRecord) => {
    onOpenRelic(r);
    setTimeout(() => setRefreshTick(t => t + 1), 200);
  };

  const isEmpty = savedRelics.length === 0 && recentRelics.length === 0;

  return (
    <View style={styles.screen}>
      <AtlasCrown eyebrow="WORLD ATLAS" title="Vault" />
      <Animated.View
        style={[
          styles.body,
          { opacity, transform: [{ translateY: translate }] },
        ]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {isEmpty ? (
            <EmptyState
              iconName="bookmark"
              title="Your vault is empty"
              body="Save a place from Explore or the World Atlas and it will appear here."
            />
          ) : (
            <>
              <SectionLabel label="YOUR COLLECTION" />
              {savedRelics.length === 0 ? (
                <View style={styles.miniEmpty}>
                  <EmptyState
                    iconName="bookmark"
                    title="No saved places"
                    body="Tap the bookmark on any location to save it here."
                  />
                </View>
              ) : (
                savedRelics.map(r => (
                  <RelicListCard
                    key={r.id}
                    relic={r}
                    onPress={() => handlePress(r)}
                    refreshTick={refreshTick}
                  />
                ))
              )}

              {recentRelics.length > 0 ? (
                <>
                  <SectionLabel label="RECENTLY VIEWED" style={{ marginTop: 22 }} />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentRow}>
                    {recentRelics.map(r => (
                      <RecentChip key={r.id} relic={r} onPress={() => handlePress(r)} />
                    ))}
                  </ScrollView>
                </>
              ) : null}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  body: { flex: 1 },
  content: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 6,
    paddingBottom: 32,
  },
  miniEmpty: { paddingVertical: 8 },
  recentRow: { paddingVertical: 4, paddingRight: 4 },
});

export default SavedVaultScreen;
