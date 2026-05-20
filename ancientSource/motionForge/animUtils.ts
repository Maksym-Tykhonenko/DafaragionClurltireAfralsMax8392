import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useFadeRise(deps: any[] = [], opts?: { distance?: number; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(opts?.distance ?? 16)).current;

  useEffect(() => {
    opacity.setValue(0);
    translate.setValue(opts?.distance ?? 16);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: opts?.delay ?? 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 420,
        delay: opts?.delay ?? 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { opacity, translate };
}

export function useSpin(loopMs = 14000) {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: loopMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [loopMs, rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return spin;
}

export function usePulse(min = 0.6, max = 1, durationMs = 1400) {
  const value = useRef(new Animated.Value(min)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: max,
          duration: durationMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: min,
          duration: durationMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [min, max, durationMs, value]);
  return value;
}

export function pressSpring(scale: Animated.Value, toValue: number) {
  Animated.spring(scale, {
    toValue,
    useNativeDriver: true,
    speed: 30,
    bounciness: 6,
  }).start();
}

export function fadeReplace(opacity: Animated.Value, onMid: () => void) {
  Animated.sequence([
    Animated.timing(opacity, {
      toValue: 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
  ]).start(() => {
    onMid();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  });
}
