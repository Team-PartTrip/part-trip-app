import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LaunchScreen from './src/screens/LaunchScreen';
import LoginView from './src/Auth/LoginView';
import SignUpView, { SignUpData } from './src/Auth/SingUpView';
import ConfirmEmail from './src/Auth/ConfirmEmail';
import ResetPassword from './src/Auth/ResetPassword';
import MainView from './src/screens/MainView';

type Screen = 'launch' | 'login' | 'signup' | 'confirmEmail' | 'resetPassword' | 'main';

type ConfirmMode = 'signup' | 'resetPassword';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<Screen>('launch');
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>('signup');
  const [signupData, setSignupData] = useState<SignUpData | undefined>(undefined);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'launch' && (
        <LaunchScreen onFinish={() => setScreen('login')} />
      )}
      {screen === 'login' && (
        <LoginView
          onLogin={() => setScreen('main')}
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
          onNext={(data) => {
            setSignupData(data);
            setConfirmMode('signup');
            setScreen('confirmEmail');
          }}
        />
      )}
      {screen === 'confirmEmail' && (
        <ConfirmEmail
          mode={confirmMode}
          signupData={confirmMode === 'signup' ? signupData : undefined}
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
      {screen === 'main' && <MainView />}
    </SafeAreaProvider>
  );
}

export default App;