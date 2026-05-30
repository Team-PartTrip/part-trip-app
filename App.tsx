import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LaunchScreen from './src/screens/LaunchScreen';
import LoginView from './src/Auth/LoginView';

type Screen = 'launch' | 'login';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<Screen>('launch');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'launch' && (
        <LaunchScreen onFinish={() => setScreen('login')} />
      )}
      {screen === 'login' && (
        <LoginView />
      )}
    </SafeAreaProvider>
  );
}

export default App;