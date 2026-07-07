import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface Coordinates {
  latitude: number;
  longitude: number;
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

/** 현재 위도/경도 조회 (권한이 없으면 요청 후 진행) */
export async function getCurrentLocation(): Promise<Coordinates> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw new Error('위치 권한이 필요합니다.');
  }

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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}
