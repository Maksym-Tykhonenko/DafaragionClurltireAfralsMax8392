import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../themeEmber/palette';
import { LoreLibraryScreen } from '../loreLibrary/LoreLibraryScreen';
import { LoreArticleView } from '../loreLibrary/LoreArticleView';
import { QuestionTrialFlow } from '../questionTrial/QuestionTrialFlow';
import { RelicDetail } from '../relicExplore/RelicDetail';
import { RelicExploreScreen } from '../relicExplore/RelicExploreScreen';
import { SavedVaultScreen } from '../savedVault/SavedVaultScreen';
import { WordCipherFlow } from '../wordCipher/WordCipherFlow';
import { WorldMapScreen } from '../worldMapView/WorldMapScreen';
import { keepKeys, pushUnique } from '../storeRelic/keep';
import { LoreRecord, RelicRecord } from '../dataBridge/types';
import { BottomNav } from './BottomNav';
import { PortKey } from './PortKey';

type SubPhase =
  | { kind: 'root' }
  | { kind: 'relic'; relic: RelicRecord; origin: PortKey }
  | { kind: 'article'; article: LoreRecord };

export const AtlasShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PortKey>('explore');
  const [sub, setSub] = useState<SubPhase>({ kind: 'root' });
  const [focusedMapId, setFocusedMapId] = useState<string | null>(null);
  const [vaultVisitTick, setVaultVisitTick] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeTab, sub, opacity]);

  const onTabChange = (next: PortKey) => {
    if (next === activeTab && sub.kind !== 'root') {
      setSub({ kind: 'root' });
      return;
    }
    setSub({ kind: 'root' });
    setActiveTab(next);
    if (next === 'vault') setVaultVisitTick(t => t + 1);
  };

  const openRelic = (relic: RelicRecord) => {
    pushUnique(keepKeys.recentRelicIds, relic.id, 12);
    setSub({ kind: 'relic', relic, origin: activeTab });
  };

  const openArticle = (article: LoreRecord) => {
    setSub({ kind: 'article', article });
  };

  const openOnAtlas = (relic: RelicRecord) => {
    setFocusedMapId(relic.id);
    setActiveTab('atlas');
    setSub({ kind: 'root' });
  };

  const backToRoot = () => {
    setSub({ kind: 'root' });
    if (activeTab === 'vault') setVaultVisitTick(t => t + 1);
  };

  const renderRoot = () => {
    switch (activeTab) {
      case 'explore':
        return <RelicExploreScreen onOpenRelic={openRelic} />;
      case 'vault':
        return <SavedVaultScreen onOpenRelic={openRelic} visitTick={vaultVisitTick} />;
      case 'atlas':
        return (
          <WorldMapScreen focusedId={focusedMapId} onOpenRelic={openRelic} />
        );
      case 'lore':
        return <LoreLibraryScreen onOpenArticle={openArticle} />;
      case 'trial':
        return <QuestionTrialFlow />;
      case 'cipher':
        return <WordCipherFlow />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <Animated.View style={[styles.canvas, { opacity }]}>
        {sub.kind === 'root' ? (
          renderRoot()
        ) : sub.kind === 'relic' ? (
          <RelicDetail
            relic={sub.relic}
            onBack={backToRoot}
            onOpenAtlas={sub.origin !== 'atlas' ? openOnAtlas : undefined}
          />
        ) : (
          <LoreArticleView article={sub.article} onBack={backToRoot} />
        )}
      </Animated.View>
      <BottomNav active={activeTab} onChange={onTabChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.ink },
  canvas: { flex: 1, overflow: 'hidden' },
});

export default AtlasShell;
