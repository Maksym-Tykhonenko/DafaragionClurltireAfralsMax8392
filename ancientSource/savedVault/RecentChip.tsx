import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius } from '../themeEmber/palette';
import { RelicRecord } from '../dataBridge/types';
import { SoftPress } from '../sharedRunes/SoftPress';

type Props = {
  relic: RelicRecord;
  onPress: () => void;
};

export const RecentChip: React.FC<Props> = ({ relic, onPress }) => {
  const short = relic.name.split(' ')[0];
  return (
    <SoftPress onPress={onPress} style={styles.item} scaleTo={0.94}>
      <View style={styles.imageWrap}>
        <Image source={relic.image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
          start={{ x: 0, y: 0.45 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {short}
      </Text>
    </SoftPress>
  );
};

const styles = StyleSheet.create({
  item: { width: 72, alignItems: 'center', marginRight: 12 },
  imageWrap: {
    width: 64,
    height: 80,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.ash,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  image: { width: '100%', height: '100%' },
  name: {
    color: palette.parchment,
    fontSize: 11,
    marginTop: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default RecentChip;
