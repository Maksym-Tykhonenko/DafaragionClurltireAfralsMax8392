import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootFlowController } from './ancientSource/atlasShell/RootFlowController';

export default function App() {
  return (
    <SafeAreaProvider>
      <RootFlowController />
    </SafeAreaProvider>
  );
}
