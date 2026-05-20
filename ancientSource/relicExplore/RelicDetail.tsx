import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, spacing } from '../themeEmber/palette';
import { RelicRecord } from '../dataBridge/types';
import { Glyph } from '../sharedRunes/Glyph';
import { IconButton } from '../sharedRunes/IconButton';
import { SegmentSwitch } from '../sharedRunes/SegmentSwitch';
import { SoftPress } from '../sharedRunes/SoftPress';
import { keepKeys, toggleInList, readValue } from '../storeRelic/keep';

type Tab = 'lore' | 'history';

type Props = {
  relic: RelicRecord;
  onBack: () => void;
  onOpenAtlas?: (relic: RelicRecord) => void;
};

export const RelicDetail: React.FC<Props> = ({ relic, onBack, onOpenAtlas }) => {
  const [tab, setTab] = useState<Tab>('lore');
  const [saved, setSaved] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const tabFade = useRef(new Animated.Value(1)).current;
  const accordionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [relic.id, fade]);

  useEffect(() => {
    (async () => {
      const list = await readValue<(string | number)[]>(keepKeys.savedRelicIds, []);
      setSaved(list.includes(relic.id));
    })();
  }, [relic.id]);

  useEffect(() => {
    tabFade.setValue(0);
    Animated.timing(tabFade, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [tab, tabFade]);

  useEffect(() => {
    Animated.timing(accordionAnim, {
      toValue: timelineOpen ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [timelineOpen, accordionAnim]);

  const onSavePress = async () => {
    const next = await toggleInList(keepKeys.savedRelicIds, relic.id);
    setSaved(next.includes(relic.id));
  };

  const onSharePress = async () => {
    try {
      await Share.share({
        title: relic.name,
        message: `${relic.name} — ${relic.country}\n\n${relic.loreText}`,
      });
    } catch (_e) {}
  };

  return (
    <Animated.View style={[styles.screen, { opacity: fade }]}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={relic.image} style={styles.hero} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)', 'rgba(8,8,11,0.95)', '#08080B']}
            locations={[0, 0.35, 0.85, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroTopRow}>
            <IconButton name="chevronLeft" onPress={onBack} size={40} />
            <IconButton name="share" onPress={onSharePress} size={40} variant="square" />
          </View>
          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle}>{relic.name}</Text>
            <View style={styles.heroMeta}>
              <Glyph name="pin" size={12} color={palette.parchment} />
              <Text style={styles.heroMetaText}>
                {'  '}
                {relic.country} · {relic.region}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.actionRow}>
            {onOpenAtlas ? (
              <SoftPress onPress={() => onOpenAtlas(relic)} style={styles.actionFlex} scaleTo={0.96}>
                <View style={[styles.actionBtn, styles.actionPrimary]}>
                  <Glyph name="map" size={14} color={palette.bone} />
                  <Text style={styles.actionPrimaryLabel}>  Open Map</Text>
                </View>
              </SoftPress>
            ) : null}
            <SoftPress onPress={onSavePress} style={styles.actionFlex} scaleTo={0.96}>
              <View style={[styles.actionBtn, styles.actionGhost]}>
                <Glyph
                  name={saved ? 'bookmarkFilled' : 'bookmark'}
                  size={14}
                  color={saved ? palette.amber : palette.parchment}
                  fill={saved ? palette.amber : 'none'}
                />
                <Text style={[styles.actionLabel, saved && { color: palette.amber }]}>
                  {'  '}
                  {saved ? 'Saved' : 'Save'}
                </Text>
              </View>
            </SoftPress>
            <SoftPress onPress={onSharePress} scaleTo={0.92}>
              <View style={[styles.actionBtn, styles.iconOnly]}>
                <Glyph name="share" size={14} color={palette.parchment} />
              </View>
            </SoftPress>
          </View>

          <View style={styles.segmentWrap}>
            <SegmentSwitch
              items={[
                { key: 'lore', label: 'Lore' },
                { key: 'history', label: 'History' },
              ]}
              active={tab}
              onChange={setTab}
            />
          </View>

          <Animated.View style={{ opacity: tabFade }}>
            <View style={styles.textBlock}>
              <View style={styles.tickMark} />
              <Text style={styles.bodyText}>
                {tab === 'lore' ? relic.loreText : relic.historyText}
              </Text>
            </View>
          </Animated.View>

          <SoftPress onPress={() => setTimelineOpen(o => !o)} scaleTo={0.99}>
            <View style={styles.timelineToggle}>
              <View style={styles.timelineToggleLeft}>
                <Glyph name="scroll" size={14} color={palette.amber} />
                <Text style={styles.timelineToggleLabel}>  Mythology Timeline</Text>
              </View>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: accordionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                }}>
                <Glyph name="chevronDown" size={16} color={palette.parchment} />
              </Animated.View>
            </View>
          </SoftPress>

          {timelineOpen ? (
            <Animated.View style={[styles.timelineBody, { opacity: accordionAnim }]}>
              {relic.timeline.map((t, i) => (
                <View key={i} style={styles.timelineRow}>
                  <View style={styles.timelineColLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        i === 0 && { backgroundColor: palette.ember, borderColor: palette.ember },
                      ]}
                    />
                    {i < relic.timeline.length - 1 ? (
                      <View style={styles.timelineLine} />
                    ) : null}
                  </View>
                  <View style={styles.timelineCol}>
                    <Text style={styles.timelineYear}>{t.year.toUpperCase()}</Text>
                    <Text style={styles.timelineEvent}>{t.event}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  scrollBody: { paddingBottom: 32 },
  heroWrap: { height: 280, width: '100%', position: 'relative' },
  hero: { width: '100%', height: '100%' },
  heroTopRow: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroBottom: { position: 'absolute', bottom: 20, left: spacing.screenH, right: spacing.screenH },
  heroTitle: {
    color: palette.bone,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  heroMetaText: { color: palette.parchment, fontSize: 12, letterSpacing: 0.4 },
  body: { paddingHorizontal: spacing.screenH, paddingTop: 20 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  actionFlex: { flex: 1 },
  actionBtn: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimary: { backgroundColor: palette.ember },
  actionGhost: { backgroundColor: palette.inkSoft, borderWidth: 1, borderColor: palette.iron },
  iconOnly: {
    backgroundColor: palette.inkSoft,
    width: 46,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: palette.iron,
  },
  actionPrimaryLabel: { color: palette.bone, fontWeight: '700', fontSize: 13, letterSpacing: 0.4 },
  actionLabel: { color: palette.parchment, fontWeight: '700', fontSize: 13, letterSpacing: 0.4 },
  segmentWrap: { marginBottom: 22 },
  textBlock: { flexDirection: 'row', marginBottom: 22 },
  tickMark: {
    width: 3,
    backgroundColor: palette.ember,
    borderRadius: 2,
    marginRight: 14,
  },
  bodyText: { flex: 1, color: palette.parchment, fontSize: 14, lineHeight: 22 },
  timelineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.iron,
  },
  timelineToggleLeft: { flexDirection: 'row', alignItems: 'center' },
  timelineToggleLabel: { color: palette.bone, fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
  timelineBody: {
    marginTop: 8,
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: palette.iron,
  },
  timelineRow: { flexDirection: 'row', paddingVertical: 10 },
  timelineColLeft: { width: 18, alignItems: 'center' },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: palette.amber,
    backgroundColor: 'transparent',
    marginTop: 5,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: palette.faint,
    marginTop: 2,
  },
  timelineCol: { flex: 1, paddingLeft: 12 },
  timelineYear: { color: palette.amber, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  timelineEvent: { color: palette.parchment, fontSize: 13, marginTop: 4, lineHeight: 19 },
});

export default RelicDetail;
