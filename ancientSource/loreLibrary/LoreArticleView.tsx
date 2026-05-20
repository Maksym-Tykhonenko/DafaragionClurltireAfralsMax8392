import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, spacing, gradientReeds } from '../themeEmber/palette';
import { Glyph } from '../sharedRunes/Glyph';
import { IconButton } from '../sharedRunes/IconButton';
import { LoreRecord } from '../dataBridge/types';

type Props = {
  article: LoreRecord;
  onBack: () => void;
};

export const LoreArticleView: React.FC<Props> = ({ article, onBack }) => {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [article.id, fade]);

  const onShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.body}`,
      });
    } catch (_e) {}
  };

  return (
    <Animated.View style={[styles.screen, { opacity: fade }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={gradientReeds[article.gradientKey] as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(8,8,11,0.95)']}
            start={{ x: 0, y: 0.55 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroTopRow}>
            <IconButton name="chevronLeft" onPress={onBack} />
            <IconButton name="share" onPress={onShare} variant="square" />
          </View>
          <View style={styles.heroCenter} pointerEvents="none">
            <View style={styles.glyphSlot}>
              <Glyph name="flame" size={56} color={palette.amberSoft} strokeWidth={1.5} />
            </View>
          </View>
          <View style={styles.heroProgress}>
            <View style={styles.heroBarTrack}>
              <View style={styles.heroBarFill} />
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.readTime}>{article.readingTime.toUpperCase()} READ</Text>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.hookWrap}>
            <View style={styles.hookBar} />
            <Text style={styles.hook}>{article.hookLine}</Text>
          </View>

          <Text style={styles.bodyText}>{article.body}</Text>

          <View style={styles.quoteWrap}>
            <Glyph name="quote" size={18} color={palette.ember} />
            <Text style={styles.quoteText}>{article.quote}</Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  scroll: { paddingBottom: 40 },
  heroWrap: { height: 240, position: 'relative' },
  heroTopRow: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  heroCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphSlot: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(8,8,11,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroBarTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroBarFill: {
    height: 2,
    width: '40%',
    backgroundColor: palette.amber,
  },
  body: { paddingHorizontal: spacing.screenH, paddingTop: 24 },
  readTime: {
    color: palette.amber,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: palette.bone,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    lineHeight: 32,
  },
  hookWrap: { flexDirection: 'row', marginTop: 14, marginBottom: 22 },
  hookBar: {
    width: 3,
    backgroundColor: palette.amber,
    borderRadius: 2,
    marginRight: 12,
  },
  hook: {
    flex: 1,
    color: palette.parchment,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bodyText: {
    color: palette.parchment,
    fontSize: 14.5,
    lineHeight: 24,
  },
  quoteWrap: {
    marginTop: 28,
    padding: 20,
    backgroundColor: palette.inkSoft,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: palette.ember,
  },
  quoteText: {
    color: palette.bone,
    fontSize: 13.5,
    fontStyle: 'italic',
    lineHeight: 21,
    marginTop: 8,
  },
});

export default LoreArticleView;
