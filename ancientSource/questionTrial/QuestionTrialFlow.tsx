import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { pickTrialSet, TRIAL_LENGTH, TRIAL_SECONDS_PER_Q } from '../dataBridge/trialBank';
import { TrialQuestion } from '../dataBridge/types';
import { keepKeys, writeValue, readValue } from '../storeRelic/keep';
import { TrialIntro } from './TrialIntro';
import { TrialPlay } from './TrialPlay';
import { TrialResult } from './TrialResult';

type Phase = 'intro' | 'play' | 'result';

export const QuestionTrialFlow: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<TrialQuestion[]>([]);
  const [outcome, setOutcome] = useState({ correct: 0, bestCombo: 0 });
  const fade = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [phase, fade]);

  const startTrial = () => {
    setQuestions(pickTrialSet(TRIAL_LENGTH));
    setPhase('play');
  };

  const finishTrial = async (r: { correct: number; bestCombo: number }) => {
    setOutcome(r);
    const pct = Math.round((r.correct / TRIAL_LENGTH) * 100);
    const prev = await readValue<number>(keepKeys.trialBestPct, 0);
    if (pct > prev) await writeValue(keepKeys.trialBestPct, pct);
    setPhase('result');
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      {phase === 'intro' && (
        <TrialIntro questionCount={TRIAL_LENGTH} secondsPerQ={TRIAL_SECONDS_PER_Q} onBegin={startTrial} />
      )}
      {phase === 'play' && (
        <TrialPlay
          questions={questions}
          perQSeconds={TRIAL_SECONDS_PER_Q}
          onFinish={finishTrial}
        />
      )}
      {phase === 'result' && (
        <TrialResult
          correct={outcome.correct}
          total={TRIAL_LENGTH}
          bestCombo={outcome.bestCombo}
          onPlayAgain={() => setPhase('intro')}
        />
      )}
    </Animated.View>
  );
};

export default QuestionTrialFlow;
