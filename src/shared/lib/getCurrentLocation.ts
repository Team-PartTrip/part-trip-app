import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 안드로이드 기본 위치 제공자(순정 GPS)는 실내/약한 신호에서 fix를 잡는 데
// 오래 걸려 타임아웃이 자주 남 - Google Play Services(융합 위치 제공자)를
// 쓰도록 설정하면 훨씬 빠르고 안정적으로 위치를 가져옴.
// 앱 부팅 시점(모듈 최상단)이 아니라 실제로 위치가 필요할 때 한 번만 설정한다.
let androidConfigured = false;
function configureAndroidIfNeeded() {
  if (Platform.OS !== 'android' || androidConfigured) return;
  androidConfigured = true;
  try {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      locationProvider: 'playServices',
    });
  } catch {
    // 설정 실패해도 기본 제공자로 계속 진행
  }
}

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: '위치 권한',
      message: '현재 위치 기반 기능을 사용하려면 위치 권한이 필요합니다.',
      buttonPositive: '확인',
      buttonNegative: '취소',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function requestPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(new Error(error.message || '위치 정보를 가져오지 못했습니다.'));
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 },
    );
  });
}

const RETRY_DELAYS_MS = [1500, 2500];

/** 현재 위도/경도 조회 (권한이 없으면 요청 후 진행)
 *  안드로이드 FusedLocationProvider는 위치를 잡기 직전 순간적으로
 *  "일시적으로 사용 불가"를 보고하는 경우가 있어, 바로 실패로 끝내지 않고
 *  짧은 간격으로 몇 차례 재시도한다. */
export async function getCurrentLocation(): Promise<Coordinates> {
  configureAndroidIfNeeded();

  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw new Error('위치 권한이 필요합니다.');
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await requestPosition();
    } catch (e: any) {
      lastError = e;
      if (attempt >= RETRY_DELAYS_MS.length) break;
      const delay = RETRY_DELAYS_MS[attempt];
      await new Promise<void>(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError ?? new Error('위치 정보를 가져오지 못했습니다.');
}
