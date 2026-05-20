import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, radius } from '../themeEmber/palette';
import { EmberButton } from '../sharedRunes/EmberButton';
import { SoftPress } from '../sharedRunes/SoftPress';
import { welcomeChapters, welcomeFinalImage } from '../dataBridge/welcomeChapters';
import { MysticGradient } from '../sharedRunes/MysticGradient';
import {useNavigation} from '@react-navigation/native';

type Props = { onFinish: () => void;
   };

const finalChapter = {
  title: 'Enter the Atlas',
  body: 'Save favorite locations, uncover ancient lore, and explore mythical world legends.',
  image: welcomeFinalImage,
};

const chapters = [...welcomeChapters, finalChapter];

export const WelcomeScroll: React.FC<Props> = ({ onFinish }) => {
  const navigation = useNavigation();

  const [idx, setIdx] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  const transitionTo = (next: number) => {
    if (next < 0) return;

    if (next >= chapters.length) {
      navigation.navigate('ShellCompon' as never);
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: -24,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIdx(next);
      slide.setValue(24);

      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const chapter = chapters[idx];
  const isFinal = idx === chapters.length - 1;

  return (
    <View style={styles.screen}>
      <Image source={chapter.image} style={styles.bg} resizeMode="cover" />
      <MysticGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.95)']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <View style={styles.progressRow}>
            {chapters.map((_, i) => {
              const active = i === idx;
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    active ? styles.dotActive : styles.dotIdle,
                  ]}
                />
              );
            })}
          </View>
          {!isFinal ? (
            <SoftPress onPress={onFinish} style={styles.skipWrap}>
              <View style={styles.skip}>
                <Text style={styles.skipLabel}>Skip</Text>
              </View>
            </SoftPress>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        <Animated.View
          style={[
            styles.body,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}>
          <Text style={styles.title}>{chapter.title}</Text>
          <Text style={styles.bodyText}>{chapter.body}</Text>
        </Animated.View>

        <View style={styles.footer}>
          <EmberButton
            label={isFinal ? 'Enter the Atlas' : 'Continue'}
            onPress={() => transitionTo(idx + 1)}
            style={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.ink },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  safe: { flex: 1, paddingHorizontal: 24 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 22, backgroundColor: palette.ember },
  dotIdle: { width: 6, backgroundColor: 'rgba(255,255,255,0.45)' },
  skipWrap: {},
  skip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skipLabel: { color: palette.bone, fontSize: 12, fontWeight: '700' },
  skipPlaceholder: { width: 56 },
  body: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  title: {
    color: palette.bone,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  bodyText: {
    color: palette.parchment,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: '95%',
  },
  footer: { paddingBottom: 12 },
});

export default WelcomeScroll;
