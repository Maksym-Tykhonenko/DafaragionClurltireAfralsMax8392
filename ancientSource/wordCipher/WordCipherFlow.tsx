import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  CIPHER_HINTS_PER_WORD,
  CIPHER_LENGTH,
  CIPHER_SECONDS_PER_WORD,
  pickCipherSet,
} from '../dataBridge/cipherBank';
import { CipherWord } from '../dataBridge/types';
import { keepKeys, readValue, writeValue } from '../storeRelic/keep';
import { CipherIntro } from './CipherIntro';
import { CipherPlay } from './CipherPlay';
import { CipherResult } from './CipherResult';

type Phase = 'intro' | 'play' | 'result';

type Result = {
  score: number;
  solved: number;
  bestCombo: number;
  hintsUsed: number;
  timeLeft: number;
};

export const WordCipherFlow: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [words, setWords] = useState<CipherWord[]>([]);
  const [result, setResult] = useState<Result>({
    score: 0,
    solved: 0,
    bestCombo: 0,
    hintsUsed: 0,
    timeLeft: 0,
  });
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [phase, fade]);

  const onEnter = () => {
    setWords(pickCipherSet(CIPHER_LENGTH));
    setPhase('play');
  };

  const onFinish = async (r: Result) => {
    setResult(r);
    const prev = await readValue<number>(keepKeys.cipherBestScore, 0);
    if (r.score > prev) await writeValue(keepKeys.cipherBestScore, r.score);
    setPhase('result');
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      {phase === 'intro' && (
        <CipherIntro
          wordCount={CIPHER_LENGTH}
          perSeconds={CIPHER_SECONDS_PER_WORD}
          hintsPerWord={CIPHER_HINTS_PER_WORD}
          onEnter={onEnter}
        />
      )}
      {phase === 'play' && (
        <CipherPlay
          words={words}
          perSeconds={CIPHER_SECONDS_PER_WORD}
          onFinish={onFinish}
        />
      )}
      {phase === 'result' && (
        <CipherResult
          score={result.score}
          solved={result.solved}
          bestCombo={result.bestCombo}
          hintsUsed={result.hintsUsed}
          timeLeft={result.timeLeft}
          onPlayAgain={() => setPhase('intro')}
        />
      )}
    </Animated.View>
  );
};

export default WordCipherFlow;
