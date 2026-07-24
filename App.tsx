import React, { useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from './src/shared/tokens/colors';
import AppHeader from './src/shared/ui/AppHeader';
import TabBar, { TabKey } from './src/widgets/bottom-tab-bar/TabBar';

import LaunchScreen from './src/pages/LaunchScreen/LaunchScreen';
import LoginView from './src/pages/Auth/LoginView';
import SignUpView, { SignUpData } from './src/pages/Auth/SingUpView';
import ConfirmEmail from './src/pages/Auth/ConfirmEmail';
import SurveyView from './src/pages/Survey/SurveyView';
import ResetPassword from './src/pages/Auth/ResetPassword';
import MainView from './src/pages/MainView/MainView';
import FestivalScreen from './src/pages/FestivalScreen/FestivalScreen';
import DestinationScreen from './src/pages/DestinationScreen/DestinationScreen';
import CameraScreen from './src/pages/CameraScreen/CameraScreen';
import GuideResultView from './src/pages/CameraScreen/GuideResultView';
import NearbyPlacesScreen from './src/pages/NearbyPlacesScreen/NearbyPlacesScreen';
import CommunityView from './src/pages/CommunityView/CommunityView';
import PostDetailView from './src/pages/CommunityView/PostDetailView';
import PostCreateView from './src/pages/CommunityView/PostCreateView';
import DestinationPickerView from './src/pages/CommunityView/DestinationPickerView';
import MissionView from './src/pages/MissionView/MissionView';
import type { Mission } from './src/entities/mission/api';
import AttendanceView from './src/pages/MissionView/AttendanceView';
import MissionListView from './src/pages/MissionView/MissionListView';
import MissionDetailView from './src/pages/MissionView/MissionDetailView';
import MissionVerifyView from './src/pages/MissionView/MissionVerifyView';
import ProfileView from './src/pages/ProfileView/ProfileView';
import RecordView from './src/pages/RecordView/RecordView';
import RecordMapView from './src/pages/RecordView/RecordMapView';
import RecordEditView from './src/pages/RecordView/RecordEditView';
import RecordCompleteView from './src/pages/RecordView/RecordCompleteView';
import ProfileEditView from './src/pages/ProfileView/ProfileEditView';
import { consumeDestinationCallback } from './src/pages/CommunityView/destinationSelectBridge';
import { clearTokens } from './src/shared/api/tokenStorage';

export type RootStackParamList = {
  Launch: undefined;
  Login: undefined;
  SignUp: undefined;
  ConfirmEmail: {
    mode: 'signup' | 'resetPassword';
    signupData?: SignUpData;
    from?: 'login' | 'profile';
    initialEmail?: string;
  };
  Survey: { from?: 'signup' | 'profile' } | undefined;
  ResetPassword: { email: string; from?: 'login' | 'profile' };
  Main: undefined;
  Festival: undefined;
  Destination: undefined;
  Camera: undefined;
  NearbyPlaces: undefined;
  GuideResult: { imageId: number; photoUri: string };
  Community: undefined;
  PostDetail: { id: string; type?: 'free' | 'review' | 'route' };
  PostCreate: {
    tab?: 'free' | 'review' | 'route';
    destination?: { countryInfoId: number; name: string };
    editType?: 'free' | 'review' | 'route';
    editId?: string;
  };
  DestinationPicker: undefined;
  Record: undefined;
  RecordMap: undefined;
  RecordEdit: { id?: string };
  RecordComplete: undefined;
  Mission: undefined;
  Attendance: undefined;
  MissionList: undefined;
  MissionDetail: { mission: Mission };
  MissionVerify: { missionId: number };
  Profile: undefined;
  ProfileEdit: undefined;
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
  'PostDetail',
  'PostCreate',
  'DestinationPicker',
  'GuideResult',
  'RecordMap',
  'RecordEdit',
  'RecordComplete',
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
            <AppHeader
              onProfile={() => navRef.navigate('Profile')}
              refreshKey={routeName}
            />
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
                    onLogin={surveyCompleted =>
                      navigation.replace(surveyCompleted ? 'Main' : 'Survey')
                    }
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
                  const from = route.params?.from;
                  return (
                    <ConfirmEmail
                      mode={mode}
                      signupData={route.params?.signupData}
                      initialEmail={route.params?.initialEmail}
                      from={from}
                      onConfirm={email =>
                        mode === 'signup'
                          ? navigation.navigate('Login')
                          : navigation.navigate('ResetPassword', {
                              email: email ?? '',
                              from,
                            })
                      }
                    />
                  );
                }}
              </Stack.Screen>

              <Stack.Screen name="Survey">
                {({ navigation, route }) => (
                  <SurveyView
                    onComplete={() =>
                      route.params?.from === 'profile'
                        ? navigation.goBack()
                        : navigation.replace('Main')
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="ResetPassword">
                {({ navigation, route }) => (
                  <ResetPassword
                    email={route.params?.email ?? ''}
                    from={route.params?.from}
                    onConfirm={async () => {
                      await clearTokens();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    }}
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
                    onCaptured={(imageId, photoUri) =>
                      navigation.navigate('GuideResult', { imageId, photoUri })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="GuideResult">
                {({ navigation, route }) => (
                  <GuideResultView
                    imageId={route.params.imageId}
                    photoUri={route.params.photoUri}
                    onBack={() => navigation.goBack()}
                    onSaved={() => navigation.navigate('Camera')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="NearbyPlaces" component={NearbyPlacesScreen} />

              <Stack.Screen name="Festival" component={FestivalScreen} />
              <Stack.Screen name="Destination">
                {({ navigation }) => (
                  <DestinationScreen
                    onSaved={() => navigation.navigate('Main')}
                  />
                )}
              </Stack.Screen>

              {/* 커뮤니티 */}
              <Stack.Screen name="Community">
                {({ navigation }) => (
                  <CommunityView
                    onWrite={tab => navigation.navigate('PostCreate', { tab })}
                    onOpenPost={(id, type) =>
                      navigation.navigate('PostDetail', { id, type })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PostDetail">
                {({ navigation, route }) => (
                  <PostDetailView
                    id={route.params?.id}
                    type={route.params?.type}
                    onBack={() => navigation.goBack()}
                    onEdit={(editType, editId) =>
                      navigation.navigate('PostCreate', { editType, editId })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PostCreate">
                {({ navigation, route }) => (
                  <PostCreateView
                    initialTab={route.params?.tab}
                    destination={route.params?.destination}
                    editType={route.params?.editType}
                    editId={route.params?.editId}
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
                    onSelect={destination => {
                      consumeDestinationCallback(destination);
                      navigation.goBack();
                    }}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Record">
                {({ navigation }) => (
                  <RecordView
                    onOpenMap={() => navigation.navigate('RecordMap')}
                    onOpenRecord={id =>
                      navigation.navigate('RecordEdit', { id })
                    }
                    onWrite={() => navigation.navigate('RecordEdit', {})}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="RecordMap">
                {({ navigation }) => (
                  <RecordMapView
                    onBack={() => navigation.goBack()}
                    onToggleList={() => navigation.goBack()}
                    onOpenRecord={id =>
                      navigation.navigate('RecordEdit', { id })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="RecordEdit">
                {({ navigation }) => (
                  <RecordEditView
                    onBack={() => navigation.goBack()}
                    onDone={() => navigation.navigate('RecordComplete')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="RecordComplete">
                {({ navigation }) => (
                  <RecordCompleteView
                    onConfirm={() => navigation.navigate('Record')}
                    onHome={() => navigation.navigate('Main')}
                  />
                )}
              </Stack.Screen>

              {/* 미션 */}
              <Stack.Screen name="Mission">
                {({ navigation }) => (
                  <MissionView
                    onOpenAttendance={() => navigation.navigate('Attendance')}
                    onOpenCompleted={() => navigation.navigate('MissionList')}
                    onOpenDetail={mission =>
                      navigation.navigate('MissionDetail', { mission })
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
                    onOpenDetail={mission =>
                      navigation.navigate('MissionDetail', { mission })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MissionDetail">
                {({ navigation, route }) => (
                  <MissionDetailView
                    mission={route.params.mission}
                    onBack={() => navigation.goBack()}
                    onVerify={() =>
                      navigation.navigate('MissionVerify', {
                        missionId: route.params.mission.missionId,
                      })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MissionVerify">
                {({ navigation, route }) => (
                  <MissionVerifyView
                    missionId={route.params.missionId}
                    onBack={() => navigation.goBack()}
                    onDone={() => navigation.navigate('MissionList')}
                    onHome={() => navigation.navigate('Main')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Profile">
                {({ navigation }) => (
                  <ProfileView
                    onEdit={() => navigation.navigate('ProfileEdit')}
                    onOpenPost={(id, type) =>
                      navigation.navigate('PostDetail', { id, type })
                    }
                    onLogout={() =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ProfileEdit">
                {({ navigation }) => (
                  <ProfileEditView
                    onConfirm={() => navigation.goBack()}
                    onResetSurvey={() =>
                      navigation.navigate('Survey', { from: 'profile' })
                    }
                    onChangePassword={email =>
                      navigation.navigate('ConfirmEmail', {
                        mode: 'resetPassword',
                        from: 'profile',
                        initialEmail: email,
                      })
                    }
                  />
                )}
              </Stack.Screen>
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