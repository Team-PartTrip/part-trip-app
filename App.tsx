import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LaunchScreen from './src/screens/LaunchScreen';
import LoginView from './src/Auth/LoginView';
import SignUpView from './src/Auth/SingUpView';
import ConfirmEmail from './src/Auth/ConfirmEmail';
import ResetPassword from './src/Auth/ResetPassword';

type Screen = 'launch' | 'login' | 'signup' | 'confirmEmail' | 'resetPassword';

type ConfirmMode = 'signup' | 'resetPassword';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<Screen>('launch');
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>('signup');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'launch' && (
        <LaunchScreen onFinish={() => setScreen('login')} />
      )}
      {screen === 'login' && (
        <LoginView
          onSignup={() => setScreen('signup')}
          onResetPassword={() => {
            setConfirmMode('resetPassword');
            setScreen('confirmEmail');
          }}
        />
      )}
      {screen === 'signup' && (
        <SignUpView
          onBack={() => setScreen('login')}
          onNext={() => {
            setConfirmMode('signup');
            setScreen('confirmEmail');
          }}
        />
      )}
      {screen === 'confirmEmail' && (
        <ConfirmEmail
          mode={confirmMode}
          onConfirm={() => {
            if (confirmMode === 'signup') {
              setScreen('login');
            } else {
              setScreen('resetPassword');
            }
          }}
        />
      )}
      {screen === 'resetPassword' && (
        <ResetPassword onConfirm={() => setScreen('login')} />
      )}
    </SafeAreaProvider>
  );
}

export default App;