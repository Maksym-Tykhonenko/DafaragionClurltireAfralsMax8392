import React from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, spacing, gradientReeds } from '../themeEmber/palette';
import { AtlasCrown } from '../sharedRunes/AtlasCrown';
import { Glyph } from '../sharedRunes/Glyph';
import { SectionLabel } from '../sharedRunes/SectionLabel';
import { SoftPress } from '../sharedRunes/SoftPress';
import { useFadeRise } from '../motionForge/animUtils';
import { featuredLore, loreLibrary } from '../dataBridge/loreLibrary';
import { LoreRecord } from '../dataBridge/types';

type Props = {
  onOpenArticle: (article: LoreRecord) => void;
};

export const LoreLibraryScreen: React.FC<Props> = ({ onOpenArticle }) => {
  const { opacity, translate } = useFadeRise([]);
  const rest = loreLibrary.slice(1);

  return (
    <View style={styles.screen}>
      <AtlasCrown eyebrow="WORLD ATLAS" title="Lore" />

      <Animated.View
        style={[
          styles.body,
          { opacity, transform: [{ translateY: translate }] },
        ]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <SectionLabel label="FEATURED STORY" />

          <SoftPress onPress={() => onOpenArticle(featuredLore)} scaleTo={0.99}>
            <View style={styles.featured}>
              <LinearGradient
                colors={gradientReeds[featuredLore.gradientKey] as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View pointerEvents="none" style={styles.featuredEmblem}>
                <Glyph name="flame" size={56} color={palette.amberSoft} strokeWidth={1.4} />
              </View>
              <View style={styles.featuredBody}>
                <Text style={styles.featuredTitle}>{featuredLore.title}</Text>
                <Text style={styles.featuredHook} numberOfLines={2}>
                  {featuredLore.hookLine}
                </Text>
                <View style={styles.featuredFooter}>
                  <Glyph name="hourglass" size={12} color={palette.parchment} />
                  <Text style={styles.featuredTime}>  {featuredLore.readingTime}</Text>
                  <View style={{ flex: 1 }} />
                  <View style={styles.featuredArrow}>
                    <Glyph name="arrowRight" size={14} color={palette.bone} />
                  </View>
                </View>
              </View>
            </View>
          </SoftPress>

          <SectionLabel label={`${rest.length} ARTICLES`} style={{ marginTop: 28 }} />

          {rest.map(article => (
            <SoftPress
              key={article.id}
              onPress={() => onOpenArticle(article)}
              style={styles.articleWrap}
              scaleTo={0.99}>
              <View style={styles.article}>
                <View style={styles.articleBody}>
                  <Text style={styles.articleTitle} numberOfLines={1}>
                    {article.title}
                  </Text>
                  <View style={styles.articleMeta}>
                    <Glyph name="hourglass" size={11} color={palette.parchment} />
                    <Text style={styles.articleTime}>  {article.readingTime}</Text>
                  </View>
                </View>
                <Glyph name="chevronRight" size={16} color={palette.parchment} />
              </View>
            </SoftPress>
          ))}
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
  featured: {
    minHeight: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'flex-end',
    backgroundColor: '#1A0810',
  },
  featuredEmblem: {
    position: 'absolute',
    top: 20,
    right: 24,
    opacity: 0.4,
  },
  featuredBody: {},
  featuredTitle: {
    color: palette.bone,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  featuredHook: {
    color: 'rgba(236,232,222,0.85)',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  featuredTime: {
    color: palette.parchment,
    fontSize: 12,
    fontWeight: '600',
  },
  featuredArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(8,8,11,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  articleWrap: { marginBottom: 10 },
  article: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: palette.iron,
  },
  articleBody: { flex: 1 },
  articleTitle: {
    color: palette.bone,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  articleMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  articleTime: { color: palette.parchment, fontSize: 11 },
});

export default LoreLibraryScreen;
