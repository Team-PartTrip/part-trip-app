import React, { useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from './src/assets/constants/colors';
import AppHeader from './src/component/AppHeader';
import TabBar, { TabKey } from './src/component/TabBar';

import LaunchScreen from './src/screens/LaunchScreen/LaunchScreen';
import LoginView from './src/screens/Auth/LoginView';
import SignUpView, { SignUpData } from './src/screens/Auth/SingUpView';
import ConfirmEmail from './src/screens/Auth/ConfirmEmail';
import SurveyView from './src/screens/Survey/SurveyView';
import ResetPassword from './src/screens/Auth/ResetPassword';
import MainView from './src/screens/MainView/MainView';
import FestivalScreen from './src/screens/FestivalScreen/FestivalScreen';
import DestinationScreen from './src/screens/DestinationScreen/DestinationScreen';
import CameraScreen from './src/screens/CameraScreen/CameraScreen';
import NearbyPlacesScreen from './src/screens/NearbyPlacesScreen/NearbyPlacesScreen';
import CommunityView from './src/screens/CommunityView/CommunityView';
import PostDetailView from './src/screens/CommunityView/PostDetailView';
import PostCreateView from './src/screens/CommunityView/PostCreateView';
import DestinationPickerView from './src/screens/CommunityView/DestinationPickerView';
import RecordView from './src/screens/RecordView/RecordView';
import MissionView from './src/screens/MissionView/MissionView';
import AttendanceView from './src/screens/MissionView/AttendanceView';
import MissionListView from './src/screens/MissionView/MissionListView';
import MissionDetailView from './src/screens/MissionView/MissionDetailView';
import MissionVerifyView from './src/screens/MissionView/MissionVerifyView';
import ProfileView from './src/screens/ProfileView/ProfileView';

export type RootStackParamList = {
  Launch: undefined;
  Login: undefined;
  SignUp: undefined;
  ConfirmEmail: { mode: 'signup' | 'resetPassword'; signupData?: SignUpData };
  Survey: undefined;
  ResetPassword: { email: string };
  Main: undefined;
  Festival: undefined;
  Destination: undefined;
  Camera: undefined;
  NearbyPlaces: undefined;
  Community: undefined;
  PostDetail: { id: string };
  PostCreate: { tab?: 'free' | 'review' | 'route'; destination?: string };
  DestinationPicker: undefined;
  Record: undefined;
  Mission: undefined;
  Attendance: undefined;
  MissionList: undefined;
  MissionDetail: { id: string };
  MissionVerify: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 상단 헤더 + 하단 탭바를 숨길 화면(인증/스플래시 + 자체 헤더를 가진 하위 화면)
const AUTH_ROUTES = [
  'Launch',
  'Login',
  'SignUp',
  'ConfirmEmail',
  'Survey',
  'ResetPassword',
  'Attendance',
  'MissionList',
  'MissionDetail',
  'MissionVerify',
  'PostDetail',
  'PostCreate',
  'DestinationPicker',
];

// 탭 ↔ 라우트 매핑
const ROUTE_BY_TAB: Record<TabKey, keyof RootStackParamList> = {
  home: 'Main',
  community: 'Community',
  record: 'Record',
  mission: 'Mission',
};
const TAB_BY_ROUTE: Record<string, TabKey> = {
  Main: 'home',
  Community: 'community',
  Record: 'record',
  Mission: 'mission',
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const [routeName, setRouteName] = useState<string | undefined>(undefined);

  const showChrome = !!routeName && !AUTH_ROUTES.includes(routeName);

  const activeTab =
    routeName && TAB_BY_ROUTE[routeName]
      ? TAB_BY_ROUTE[routeName]
      : routeName === 'Camera' || routeName === 'NearbyPlaces'
      ? 'camera'
      : '';

  const handleRouteChange = () => setRouteName(navRef.getCurrentRoute()?.name);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        ref={navRef}
        onReady={handleRouteChange}
        onStateChange={handleRouteChange}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* 고정 상단 헤더 */}
          {showChrome && (
            <AppHeader onProfile={() => navRef.navigate('Profile')} />
          )}

          {/* 콘텐츠 (네비게이터로 교체되는 영역) */}
          <View style={{ flex: 1 }}>
            <Stack.Navigator
              initialRouteName="Launch"
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="Launch">
                {({ navigation }) => (
                  <LaunchScreen onFinish={() => navigation.replace('Login')} />
                )}
              </Stack.Screen>

              <Stack.Screen name="Login">
                {({ navigation }) => (
                  <LoginView
                    onLogin={() => navigation.replace('Main')}
                    onSignup={() => navigation.navigate('SignUp')}
                    onResetPassword={() =>
                      navigation.navigate('ConfirmEmail', {
                        mode: 'resetPassword',
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="SignUp">
                {({ navigation }) => (
                  <SignUpView
                    onBack={() => navigation.goBack()}
                    onNext={data =>
                      navigation.navigate('ConfirmEmail', {
                        mode: 'signup',
                        signupData: data,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="ConfirmEmail">
                {({ navigation, route }) => {
                  const mode = route.params?.mode ?? 'signup';
                  return (
                    <ConfirmEmail
                      mode={mode}
                      signupData={route.params?.signupData}
                      onConfirm={email =>
                        mode === 'signup'
                          ? navigation.navigate('Survey')
                          : navigation.navigate('ResetPassword', {
                              email: email ?? '',
                            })
                      }
                    />
                  );
                }}
              </Stack.Screen>

              <Stack.Screen name="Survey">
                {({ navigation }) => (
                  <SurveyView onComplete={() => navigation.replace('Login')} />
                )}
              </Stack.Screen>

              <Stack.Screen name="ResetPassword">
                {({ navigation, route }) => (
                  <ResetPassword
                    email={route.params?.email ?? ''}
                    onConfirm={() => navigation.navigate('Login')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Main">
                {({ navigation }) => (
                  <MainView
                    onOpenFestival={() => navigation.navigate('Festival')}
                    onOpenDestination={() => navigation.navigate('Destination')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Camera">
                {({ navigation }) => (
                  <CameraScreen
                    onOpenNearby={() => navigation.navigate('NearbyPlaces')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Festival" component={FestivalScreen} />
              <Stack.Screen name="Destination" component={DestinationScreen} />
              <Stack.Screen
                name="NearbyPlaces"
                component={NearbyPlacesScreen}
              />

              {/* 커뮤니티 */}
              <Stack.Screen name="Community">
                {({ navigation }) => (
                  <CommunityView
                    onWrite={tab => navigation.navigate('PostCreate', { tab })}
                    onOpenPost={id => navigation.navigate('PostDetail', { id })}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PostDetail">
                {({ navigation }) => (
                  <PostDetailView onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
              <Stack.Screen name="PostCreate">
                {({ navigation, route }) => (
                  <PostCreateView
                    initialTab={route.params?.tab}
                    destination={route.params?.destination}
                    onBack={() => navigation.goBack()}
                    onPickDestination={() =>
                      navigation.navigate('DestinationPicker')
                    }
                    onSubmit={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="DestinationPicker">
                {({ navigation }) => (
                  <DestinationPickerView
                    onBack={() => navigation.goBack()}
                    onSelect={name =>
                      navigation.navigate('PostCreate', { destination: name })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Record" component={RecordView} />

              {/* 미션 */}
              <Stack.Screen name="Mission">
                {({ navigation }) => (
                  <MissionView
                    onOpenAttendance={() => navigation.navigate('Attendance')}
                    onOpenCompleted={() => navigation.navigate('MissionList')}
                    onOpenDetail={id =>
                      navigation.navigate('MissionDetail', { id })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Attendance">
                {({ navigation }) => (
                  <AttendanceView onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
              <Stack.Screen name="MissionList">
                {({ navigation }) => (
                  <MissionListView
                    onBack={() => navigation.goBack()}
                    onOpenDetail={id =>
                      navigation.navigate('MissionDetail', { id })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MissionDetail">
                {({ navigation }) => (
                  <MissionDetailView
                    onBack={() => navigation.goBack()}
                    onVerify={() => navigation.navigate('MissionVerify')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MissionVerify">
                {({ navigation }) => (
                  <MissionVerifyView
                    onBack={() => navigation.goBack()}
                    onDone={() => navigation.navigate('MissionList')}
                    onHome={() => navigation.navigate('Main')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Profile" component={ProfileView} />
            </Stack.Navigator>
          </View>

          {/* 고정 하단 탭바 */}
          {showChrome && (
            <TabBar
              active={activeTab}
              onTabPress={key => navRef.navigate(ROUTE_BY_TAB[key] as never)}
              onCamera={() => navRef.navigate('Camera')}
            />
          )}
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;