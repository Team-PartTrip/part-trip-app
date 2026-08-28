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
import ResetPassword from './src/pages/Auth/ResetPassword';
import MainView from './src/pages/MainView/MainView';
import FestivalScreen from './src/pages/FestivalScreen/FestivalScreen';
import ProfileView from './src/pages/ProfileView/ProfileView';
import PlannerScreen from './src/pages/PlannerScreen/PlannerScreen';
import PlanGroupView from './src/pages/PlannerScreen/PlanGroupView';
import PlanDestinationView from './src/pages/PlannerScreen/PlanDestinationView';
import PlacePickerView from './src/pages/PlannerScreen/PlacePickerView';
import PlaceVoteView from './src/pages/PlannerScreen/PlaceVoteView';
import PlanCartView from './src/pages/PlannerScreen/PlanCartView';
import PlanStatusView from './src/pages/PlannerScreen/PlanStatusView';
import PlanConfirmView from './src/pages/PlannerScreen/PlanConfirmView';
import type {
  PlaceCategory,
  PlanDraft,
} from './src/entities/planner/types';
import NotificationListView from './src/pages/NotificationView/NotificationListView';
import NotificationDetailView from './src/pages/NotificationView/NotificationDetailView';
import type { Notification } from './src/entities/notification/api';
import RecordView from './src/pages/RecordView/RecordView';
import RecordMapView from './src/pages/RecordView/RecordMapView';
import PhotoDetailView from './src/pages/RecordView/PhotoDetailView';
import CommentEditView from './src/pages/RecordView/CommentEditView';
import PhotoDeleteView from './src/pages/RecordView/PhotoDeleteView';
import TripCardListView from './src/pages/RecordView/TripCardListView';
import TripCardDetailView from './src/pages/RecordView/TripCardDetailView';
import TripCardEditView from './src/pages/RecordView/TripCardEditView';
import TripCardDeleteView from './src/pages/RecordView/TripCardDeleteView';
import RecordEditView from './src/pages/RecordView/RecordEditView';
import RecordCompleteView from './src/pages/RecordView/RecordCompleteView';
import ProfileEditView from './src/pages/ProfileView/ProfileEditView';
import WorldMapView from './src/pages/WorldMapView/WorldMapView';
import CountryRecordView from './src/pages/WorldMapView/CountryRecordView';
import CountryAcquiredView from './src/pages/WorldMapView/CountryAcquiredView';
import AchievementView from './src/pages/WorldMapView/AchievementView';
import type {
  CountryAcquiredParams,
  VisitedCountry,
} from './src/entities/worldmap/types';
import { sampleAcquiredParamsOf } from './src/entities/worldmap/sampleData';
import { clearTokens } from './src/shared/api/tokenStorage';

export type RootStackParamList = {
  Launch: undefined;
  Login: undefined;
  SignUp: undefined;
  ConfirmEmail: {
    mode: 'signup' | 'resetPassword';
    signupData?: SignUpData;
  };
  ResetPassword: { email: string };
  Main: undefined;
  Planner: undefined;
  PlanGroup: undefined;
  PlanDestination: { draft: PlanDraft };
  PlacePicker: { draft: PlanDraft };
  PlanCart: { plannerId: number };
  PlaceVote: { planId: number; category?: PlaceCategory };
  PlanStatus: { planId: number };
  PlanConfirm: { planId: number };
  Notifications: undefined;
  NotificationDetail: { notification: Notification };
  Festival: undefined;
  Record: undefined;
  RecordMap: { tripCardId: number };
  PhotoDetail: {
    tripCardId: number;
    tripCardPlaceId?: number;
    photoId?: number;
  };
  CommentEdit: { photoId: number; mode: 'create' | 'edit' };
  PhotoDelete: { tripCardId: number };
  TripCards: undefined;
  TripCardDetail: { tripCardId: number };
  TripCardEdit: { tripCardId: number };
  TripCardDelete: undefined;
  RecordEdit: { id?: string };
  RecordComplete: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  WorldMap: undefined;
  CountryRecord: { country: VisitedCountry };
  CountryAcquired: CountryAcquiredParams;
  Achievement: undefined;
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
  'RecordEdit',
  'RecordComplete',
  'WorldMap',
  'CountryRecord',
  'CountryAcquired',
  'Achievement',
  'PlanGroup',
  'PlanDestination',
  'PlacePicker',
  'PlanCart',
  'PlaceVote',
  'PlanConfirm',
  'PhotoDetail',
  'CommentEdit',
  'PhotoDelete',
  'TripCards',
  'TripCardDelete',
];

// 자체 상단 영역(파란 헤더 또는 뒤로가기)을 가진 화면.
// 공용 AppHeader 까지 얹으면 상단 여백이 두 번 들어가서 크게 빈다.
const OWN_HEADER_ROUTES = [
  'Main',
  'Planner',
  'PlanStatus',
  'Record',
  'RecordMap',
  'Festival',
  'TripCardDetail',
  'TripCardEdit',
  'Profile',
  'Notifications',
  'NotificationDetail',
];

// 탭 ↔ 라우트 매핑
const ROUTE_BY_TAB: Record<TabKey, keyof RootStackParamList> = {
  home: 'Main',
  planner: 'Planner',
  record: 'Record',
  profile: 'Profile',
};
const TAB_BY_ROUTE: Record<string, TabKey> = {
  Main: 'home',
  // 축제·이벤트는 기능명세서 v3 에서 메인(Func-002-03) 소속으로 옮겨졌다
  Festival: 'home',
  Planner: 'planner',
  PlanStatus: 'planner',
  Record: 'record',
  RecordMap: 'record',
  TripCardDetail: 'record',
  TripCardEdit: 'record',
  Profile: 'profile',
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const [routeName, setRouteName] = useState<string | undefined>(undefined);

  const showChrome = !!routeName && !AUTH_ROUTES.includes(routeName);

  const activeTab =
    routeName && TAB_BY_ROUTE[routeName] ? TAB_BY_ROUTE[routeName] : '';

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
          {showChrome && !OWN_HEADER_ROUTES.includes(routeName ?? '') && (
            <AppHeader />
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
                          ? navigation.navigate('Login')
                          : navigation.navigate('ResetPassword', {
                              email: email ?? '',
                            })
                      }
                    />
                  );
                }}
              </Stack.Screen>


              <Stack.Screen name="ResetPassword">
                {({ navigation, route }) => (
                  <ResetPassword
                    email={route.params?.email ?? ''}
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
                    onOpenNotifications={() => navigation.navigate('Notifications')}
                    onOpenEvents={() => navigation.navigate('Festival')}
                  />
                )}
              </Stack.Screen>

              {/* 플래너 (Func-008) */}
              <Stack.Screen name="Planner">
                {({ navigation }) => (
                  <PlannerScreen
                    onCreate={() => navigation.navigate('PlanGroup')}
                    onOpenPlan={(planId, status) => {
                      // 확정된 계획은 최종 확인 화면, 그 밖에는 진행 현황으로
                      if (status === 'CONFIRMED') {
                        navigation.navigate('PlanConfirm', { planId });
                      } else {
                        navigation.navigate('PlanStatus', { planId });
                      }
                    }}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanGroup">
                {({ navigation }) => (
                  <PlanGroupView
                    onBack={() => navigation.goBack()}
                    onNext={draft =>
                      navigation.navigate('PlanDestination', { draft })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanDestination">
                {({ navigation, route }) => (
                  <PlanDestinationView
                    draft={route.params.draft}
                    onBack={() => navigation.goBack()}
                    onNext={draft =>
                      navigation.navigate('PlacePicker', { draft })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlacePicker">
                {({ navigation, route }) => (
                  <PlacePickerView
                    draft={route.params.draft}
                    onBack={() => navigation.goBack()}
                    onOpenCart={() =>
                      navigation.navigate('PlanCart', {
                        plannerId: route.params.draft.plannerId,
                      })
                    }
                    onStartVote={() =>
                      navigation.navigate('PlaceVote', {
                        planId: route.params.draft.plannerId,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanCart">
                {({ navigation, route }) => (
                  <PlanCartView
                    plannerId={route.params.plannerId}
                    onBack={() => navigation.goBack()}
                    onConfirm={() =>
                      navigation.navigate('PlanConfirm', {
                        planId: route.params.plannerId,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlaceVote">
                {({ navigation, route }) => (
                  <PlaceVoteView
                    planId={route.params.planId}
                    category={route.params.category}
                    onBack={() => navigation.goBack()}
                    onDone={() =>
                      navigation.navigate('PlanConfirm', {
                        planId: route.params.planId,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanStatus">
                {({ navigation, route }) => (
                  <PlanStatusView
                    planId={route.params.planId}
                    onBack={() => navigation.goBack()}
                    onOpenVote={category =>
                      navigation.navigate('PlaceVote', {
                        planId: route.params.planId,
                        category,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanConfirm">
                {({ navigation, route }) => (
                  <PlanConfirmView
                    planId={route.params.planId}
                    onBack={() => navigation.goBack()}
                    onStart={() => navigation.navigate('Planner')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Notifications">
                {({ navigation }) => (
                  <NotificationListView
                    onBack={() => navigation.goBack()}
                    onOpen={notification =>
                      navigation.navigate('NotificationDetail', { notification })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="NotificationDetail">
                {({ navigation, route }) => (
                  <NotificationDetailView
                    notification={route.params.notification}
                    onBack={() => navigation.goBack()}
                    onOpenLink={(linkType, linkId) => {
                      // 국가 획득 알림은 축하 화면(E3)으로 바로 보낸다
                      if (route.params.notification.type === 'COUNTRY_ACQUIRED') {
                        navigation.navigate(
                          'CountryAcquired',
                          sampleAcquiredParamsOf(linkId),
                        );
                      } else if (linkType === 'VOTE' || linkType === 'GROUP') {
                        // 플래너 화면은 아직 준비 중 안내만 띄운다
                        navigation.navigate('Planner');
                      } else if (linkType === 'WORLD_MAP') {
                        navigation.navigate('WorldMap');
                      } else {
                        navigation.navigate('Record');
                      }
                    }}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Festival">
                {({ navigation }) => (
                  <FestivalScreen onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>

              {/* 기록 (Func-005) */}
              <Stack.Screen name="Record">
                {({ navigation }) => (
                  <RecordView
                    onOpenTrip={tripCardId =>
                      navigation.navigate('RecordMap', { tripCardId })
                    }
                    onOpenTripCards={() => navigation.navigate('TripCards')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="RecordMap">
                {({ navigation, route }) => (
                  <RecordMapView
                    tripCardId={route.params.tripCardId}
                    onBack={() => navigation.goBack()}
                    onOpenSpot={spot =>
                      navigation.navigate('PhotoDetail', {
                        tripCardId: spot.tripCardId,
                        tripCardPlaceId: spot.tripCardPlaceId,
                      })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PhotoDetail">
                {({ navigation, route }) => (
                  <PhotoDetailView
                    tripCardId={route.params.tripCardId}
                    tripCardPlaceId={route.params.tripCardPlaceId}
                    photoId={route.params.photoId}
                    onBack={() => navigation.goBack()}
                    onWriteComment={photo =>
                      navigation.navigate('CommentEdit', {
                        photoId: photo.photoId,
                        mode: 'create',
                      })
                    }
                    onEditComment={photo =>
                      navigation.navigate('CommentEdit', {
                        photoId: photo.photoId,
                        mode: 'edit',
                      })
                    }
                    onDeletePhotos={() =>
                      navigation.navigate('PhotoDelete', {
                        tripCardId: route.params.tripCardId,
                      })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="CommentEdit">
                {({ navigation, route }) => (
                  <CommentEditView
                    photoId={route.params.photoId}
                    mode={route.params.mode}
                    onBack={() => navigation.goBack()}
                    onSaved={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PhotoDelete">
                {({ navigation, route }) => (
                  <PhotoDeleteView
                    tripCardId={route.params.tripCardId}
                    onBack={() => navigation.goBack()}
                    onDeleted={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>

              {/* 여행 카드 (Func-003) */}
              <Stack.Screen name="TripCards">
                {({ navigation }) => (
                  <TripCardListView
                    onBack={() => navigation.goBack()}
                    onOpenCard={tripCardId =>
                      navigation.navigate('TripCardDetail', { tripCardId })
                    }
                    onManage={() => navigation.navigate('TripCardDelete')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="TripCardDetail">
                {({ navigation, route }) => (
                  <TripCardDetailView
                    tripCardId={route.params.tripCardId}
                    onBack={() => navigation.goBack()}
                    onAddPhoto={() =>
                      navigation.navigate('TripCardEdit', {
                        tripCardId: route.params.tripCardId,
                      })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="TripCardEdit">
                {({ navigation, route }) => (
                  <TripCardEditView
                    tripCardId={route.params.tripCardId}
                    onBack={() => navigation.goBack()}
                    onSaved={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="TripCardDelete">
                {({ navigation }) => (
                  <TripCardDeleteView
                    onBack={() => navigation.goBack()}
                    onDeleted={() => navigation.goBack()}
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

              <Stack.Screen name="Profile">
                {({ navigation }) => (
                  <ProfileView
                    onOpenNotifications={() =>
                      navigation.navigate('Notifications')
                    }
                    onEdit={() => navigation.navigate('ProfileEdit')}
                    onOpenWorldMap={() => navigation.navigate('WorldMap')}
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
                  />
                )}
              </Stack.Screen>

              {/* 세계지도 */}
              <Stack.Screen name="WorldMap">
                {({ navigation }) => (
                  <WorldMapView
                    onBack={() => navigation.goBack()}
                    onOpenCountry={country =>
                      navigation.navigate('CountryRecord', { country })
                    }
                    onOpenAchievement={() => navigation.navigate('Achievement')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="CountryRecord">
                {({ navigation, route }) => (
                  <CountryRecordView
                    country={route.params.country}
                    onBack={() => navigation.goBack()}
                    onOpenRecord={id =>
                      navigation.navigate('RecordEdit', { id: String(id) })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="CountryAcquired">
                {({ navigation, route }) => (
                  <CountryAcquiredView
                    params={route.params}
                    onClose={() => navigation.goBack()}
                    onOpenCountry={() => navigation.navigate('Record')}
                    onOpenWorldMap={() => navigation.navigate('WorldMap')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Achievement">
                {({ navigation }) => (
                  <AchievementView onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </View>

          {/* 고정 하단 탭바 */}
          {showChrome && (
            <TabBar
              active={activeTab}
              onTabPress={key => navRef.navigate(ROUTE_BY_TAB[key] as never)}
            />
          )}
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;