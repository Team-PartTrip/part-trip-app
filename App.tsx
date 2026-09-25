import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { setSessionExpiredHandler } from './src/shared/api/http';
import colors from './src/shared/tokens/colors';
import AppHeader from './src/shared/ui/AppHeader';
import TabBar, { TabKey } from './src/widgets/bottom-tab-bar/TabBar';

import LaunchScreen from './src/pages/LaunchScreen/LaunchScreen';
import LoginView from './src/pages/Auth/LoginView';
import PlaceDetailView from './src/pages/PlaceDetailView/PlaceDetailView';
import type { TourPlace } from './src/entities/main/api';
import MainView from './src/pages/MainView/MainView';
import FestivalScreen from './src/pages/FestivalScreen/FestivalScreen';
import ProfileView from './src/pages/ProfileView/ProfileView';
import PlannerScreen from './src/pages/PlannerScreen/PlannerScreen';
import PlanGroupView from './src/pages/PlannerScreen/PlanGroupView';
import PlanPeriodView from './src/pages/PlannerScreen/PlanPeriodView';
import PlanBlocksView from './src/pages/PlannerScreen/PlanBlocksView';
import PlanStatusView from './src/pages/PlannerScreen/PlanStatusView';
import type { PlanDraft } from './src/entities/planner/types';
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
import GuardianView from './src/pages/GuardianView/GuardianView';
import TravelPreferenceView from './src/pages/TravelPreferenceView/TravelPreferenceView';
import SeniorView from './src/pages/GuardianView/SeniorView';
import { useLocationSharing } from './src/shared/lib/locationSharing';
import RegionMapView from './src/pages/RegionMapView/RegionMapView';

export type RootStackParamList = {
  Launch: undefined;
  Login: undefined;
  Main: undefined;
  Planner: undefined;
  PlanGroup: undefined;
  PlanPeriod: { draft: PlanDraft };
  PlanBlocks: { draft: PlanDraft };
  PlanStatus: { planId: number };
  Notifications: undefined;
  NotificationDetail: { notification: Notification };
  PlaceDetail: { place: TourPlace };
  Festival: undefined;
  Record: undefined;
  RecordMap: { tripCardId: number };
  PhotoDetail: {
    tripCardId: number;
    /** 여행카드 타임라인의 사진 식별자(entryId) */
    photoId?: number;
  };
  CommentEdit: { tripCardId: number; photoId: number; mode: 'create' | 'edit' };
  PhotoDelete: { tripCardId: number };
  TripCards: undefined;
  TripCardDetail: { tripCardId: number };
  TripCardEdit: { tripCardId: number };
  TripCardDelete: undefined;
  RecordEdit: { id?: string };
  RecordComplete: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  Guardian: undefined;
  TravelPreference: undefined;
  Senior: { seniorUserId: string; nickName: string };
  RegionMap: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 상단 헤더 + 하단 탭바를 숨길 화면(인증/스플래시 + 자체 헤더를 가진 하위 화면)
const AUTH_ROUTES = [
  'Launch',
  'Login',
  'RecordEdit',
  'RecordComplete',
  'RegionMap',
  'PlanGroup',
  'PlanPeriod',
  'PlanBlocks',
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
  'PlaceDetail',
  'TripCardDetail',
  'TripCardEdit',
  'Profile',
  'Guardian',
  'TravelPreference',
  'Senior',
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
  // 탭바가 보이는 화면은 빠짐없이 적는다. 빠지면 어느 탭도 켜지지 않아
  // 사용자가 지금 어디에 있는지 알 수 없다.
  PlaceDetail: 'home',
  Notifications: 'home',
  NotificationDetail: 'home',
  Planner: 'planner',
  PlanStatus: 'planner',
  Record: 'record',
  RecordMap: 'record',
  TripCardDetail: 'record',
  TripCardEdit: 'record',
  Profile: 'profile',
  ProfileEdit: 'profile',
  Guardian: 'profile',
  TravelPreference: 'profile',
  Senior: 'profile',
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const [routeName, setRouteName] = useState<string | undefined>(undefined);

  const showChrome = !!routeName && !AUTH_ROUTES.includes(routeName);
  // 로그인한 화면에서만. 여행 중 · 보호자 있음 · 동의했을 때 위치를 보낸다
  useLocationSharing(showChrome);

  const activeTab =
    routeName && TAB_BY_ROUTE[routeName] ? TAB_BY_ROUTE[routeName] : '';

  const handleRouteChange = () => setRouteName(navRef.getCurrentRoute()?.name);

  // 토큰 갱신까지 실패하면 로그인 화면으로 되돌린다. 그대로 두면 모든
  // 화면이 계속 401 을 받아 앱을 껐다 켜는 수밖에 없다.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      if (navRef.isReady()) {
        navRef.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    });
  }, [navRef]);

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
                  <LoginView onLogin={() => navigation.replace('Main')} />
                )}
              </Stack.Screen>

              <Stack.Screen name="Main">
                {({ navigation }) => (
                  <MainView
                    onOpenNotifications={() =>
                      navigation.navigate('Notifications')
                    }
                    onOpenEvents={() => navigation.navigate('Festival')}
                    onOpenPlace={place =>
                      navigation.navigate('PlaceDetail', { place })
                    }
                  />
                )}
              </Stack.Screen>

              {/* 플래너 (Func-008) */}
              <Stack.Screen name="Planner">
                {({ navigation }) => (
                  <PlannerScreen
                    onCreate={() => navigation.navigate('PlanGroup')}
                    // 확정 전후 모두 같은 화면이다 (Func-005-06)
                    onOpenPlan={planId =>
                      navigation.navigate('PlanStatus', { planId })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanGroup">
                {({ navigation }) => (
                  <PlanGroupView
                    onBack={() => navigation.goBack()}
                    onNext={draft =>
                      navigation.navigate('PlanPeriod', { draft })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanPeriod">
                {({ navigation, route }) => (
                  <PlanPeriodView
                    draft={route.params.draft}
                    onBack={() => navigation.goBack()}
                    onNext={draft =>
                      navigation.navigate('PlanBlocks', { draft })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlanBlocks">
                {({ navigation, route }) => (
                  <PlanBlocksView
                    draft={route.params.draft}
                    onBack={() => navigation.goBack()}
                    // 마법사는 여기서 끝난다. 뒤로 가서 다시 만들면 플래너가
                    // 하나 더 생기므로, 목록 위에 계획 화면만 남긴다.
                    onCreated={planId =>
                      navigation.reset({
                        index: 1,
                        routes: [
                          { name: 'Planner' },
                          { name: 'PlanStatus', params: { planId } },
                        ],
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
                    onDeleted={() => navigation.navigate('Planner')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Notifications">
                {({ navigation }) => (
                  <NotificationListView
                    onBack={() => navigation.goBack()}
                    onOpen={notification =>
                      navigation.navigate('NotificationDetail', {
                        notification,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="NotificationDetail">
                {({ navigation, route }) => (
                  <NotificationDetailView
                    notification={route.params.notification}
                    onBack={() => navigation.goBack()}
                    onOpenLink={linkType => {
                      // 새 지역을 다녀왔다는 알림은 지도로 보낸다.
                      // 예전 알림(국가 획득 · WORLD_MAP)도 같은 지도로 보낸다
                      if (
                        linkType === 'REGION_MAP' ||
                        linkType === 'WORLD_MAP' ||
                        route.params.notification.type === 'COUNTRY_ACQUIRED'
                      ) {
                        navigation.navigate('RegionMap');
                      } else if (linkType === 'VOTE' || linkType === 'GROUP') {
                        // 어느 플래너인지까지는 아직 못 가려서 목록으로 보낸다
                        navigation.navigate('Planner');
                      } else {
                        navigation.navigate('Record');
                      }
                    }}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="PlaceDetail">
                {({ navigation, route }) => (
                  <PlaceDetailView
                    place={route.params.place}
                    onBack={() => navigation.goBack()}
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
              <Stack.Screen
                name="RecordMap"
                options={{ gestureEnabled: false }}
              >
                {({ navigation, route }) => (
                  <RecordMapView
                    tripCardId={route.params.tripCardId}
                    onBack={() => navigation.goBack()}
                    onOpenSpot={spot =>
                      navigation.navigate('PhotoDetail', {
                        tripCardId: spot.tripCardId,
                        photoId: spot.entryId ?? undefined,
                      })
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PhotoDetail">
                {({ navigation, route }) => (
                  <PhotoDetailView
                    tripCardId={route.params.tripCardId}
                    photoId={route.params.photoId}
                    onBack={() => navigation.goBack()}
                    onWriteComment={photo =>
                      navigation.navigate('CommentEdit', {
                        tripCardId: route.params.tripCardId,
                        photoId: photo.entryId ?? 0,
                        mode: 'create',
                      })
                    }
                    onEditComment={photo =>
                      navigation.navigate('CommentEdit', {
                        tripCardId: route.params.tripCardId,
                        photoId: photo.entryId ?? 0,
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
                    tripCardId={route.params.tripCardId}
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
                    onOpenRegionMap={() => navigation.navigate('RegionMap')}
                    onOpenGuardian={() => navigation.navigate('Guardian')}
                    onOpenTravelPreference={() =>
                      navigation.navigate('TravelPreference')
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
                  <ProfileEditView onConfirm={() => navigation.goBack()} />
                )}
              </Stack.Screen>

              <Stack.Screen name="TravelPreference">
                {({ navigation }) => (
                  <TravelPreferenceView onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>

              {/* 가족 연결 (Func-012) */}
              <Stack.Screen name="Guardian">
                {({ navigation }) => (
                  <GuardianView
                    onBack={() => navigation.goBack()}
                    onOpenSenior={senior =>
                      navigation.navigate('Senior', {
                        seniorUserId: senior.userId,
                        nickName: senior.nickName,
                      })
                    }
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Senior">
                {({ navigation, route }) => (
                  <SeniorView
                    seniorUserId={route.params.seniorUserId}
                    nickName={route.params.nickName}
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>

              {/* 내가 다녀온 곳 (Func-006) */}
              <Stack.Screen
                name="RegionMap"
                options={{ gestureEnabled: false }}
              >
                {({ navigation }) => (
                  <RegionMapView onBack={() => navigation.goBack()} />
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
