import { useEffect } from 'react';
import { Alert, AppState } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCATION_CONSENT_KEY } from '../api/tokenStorage';
import { getDday, TripPhase } from '../../entities/main/api';
import {
  getMyGuardians,
  stopSharingLocation,
  updateMyLocation,
} from '../../entities/guardian/api';

/** 보내는 간격. 보호자 화면이 거의 실시간으로 보이게 */
export const SEND_EVERY_MS = 20_000;
const STALE_MS = 60_000;
const RECHECK_EVERY = 15;

const CONSENT_KEY = LOCATION_CONSENT_KEY;
export type Consent = 'yes' | 'no' | null;

// 동의는 이 기기의 선택이라 기기에 둔다. 저장이 막힌 환경이면 "안 물어본 상태" 로 본다
export async function getConsent(): Promise<Consent> {
  try {
    const value = await AsyncStorage.getItem(CONSENT_KEY);
    return value === 'yes' || value === 'no' ? value : null;
  } catch {
    return null;
  }
}

export async function setConsent(value: 'yes' | 'no'): Promise<void> {
  try {
    await AsyncStorage.setItem(CONSENT_KEY, value);
  } catch {
    // 못 저장하면 다음에 한 번 더 물어볼 뿐이다
  }
}

export async function setSharing(on: boolean): Promise<void> {
  await setConsent(on ? 'yes' : 'no');
  if (on) {
    Geolocation.requestAuthorization();
  } else {
    await stopSharingLocation().catch(() => {});
  }
}

/** 지금 위치를 보내도 되는지 */
export function shouldSend(state: {
  consent: Consent;
  phase: TripPhase | undefined;
  guardianCount: number;
}): boolean {
  return (
    state.consent === 'yes' &&
    state.phase === 'DURING' &&
    state.guardianCount > 0
  );
}

export function currentPosition(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(
      p =>
        resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      reject,
      // 정확도보다 배터리. 보호자에게 필요한 건 "어디쯤" 이다
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 },
    ),
  );
}

let asking: Promise<boolean> | null = null;

function askConsent(): Promise<boolean> {
  if (!asking) {
    asking = showConsent().finally(() => {
      asking = null;
    });
  }
  return asking;
}

function showConsent(): Promise<boolean> {
  return new Promise(resolve =>
    Alert.alert(
      '가족에게 위치를 알려줄까요?',
      '여행하는 동안 연결된 가족(보호자)이 내 위치를 볼 수 있어요.\n앱을 화면에서 내려도 20초~1분마다 보내요. 앱을 완전히 종료하면 멈추고, 여행이 끝나면 지워져요.\n마이 → 가족 연결에서 언제든 끌 수 있어요.',
      [
        { text: '안 할래요', style: 'cancel', onPress: () => resolve(false) },
        { text: '알려줄게요', onPress: () => resolve(true) },
      ],
      { cancelable: false },
    ),
  );
}

export function useLocationSharing(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    let timer: ReturnType<typeof setInterval> | null = null;
    let watchId: number | null = null;
    let lastSentAt = 0;
    let sending = false;
    let last: { latitude: number; longitude: number; at: number } | null = null;
    let generation = 0;

    const stop = () => {
      generation += 1;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        watchId = null;
      }
    };

    const start = async () => {
      stop();
      const mine = generation;
      const [dday, guardians] = await Promise.all([
        getDday().catch(() => null),
        getMyGuardians().catch(() => []),
      ]);
      // 기다리는 사이 앱이 뒤로 갔거나 다시 시작했다
      if (
        mine !== generation ||
        dday?.status !== 'DURING' ||
        guardians.length === 0
      ) {
        return;
      }
      let consent = await getConsent();
      if (consent === null) {
        consent = (await askConsent()) ? 'yes' : 'no';
        await setConsent(consent);
      }
      if (mine !== generation) {
        return;
      }
      let phase: TripPhase | undefined = dday.status;
      let guardianCount = guardians.length;
      let sentSinceCheck = 0;
      const send = async () => {
        if (sending) {
          return;
        }
        sending = true;
        lastSentAt = Date.now();
        try {
          await sendOnce();
        } finally {
          sending = false;
        }
      };
      const sendOnce = async () => {
        sentSinceCheck += 1;
        if (sentSinceCheck >= RECHECK_EVERY) {
          sentSinceCheck = 0;
          const [nextDday, nextGuardians] = await Promise.all([
            getDday().catch(() => null),
            getMyGuardians().catch(() => null),
          ]);
          if (nextDday) {
            phase = nextDday.status;
          }
          if (nextGuardians) {
            guardianCount = nextGuardians.length;
          }
        }
        const state = {
          consent: await getConsent(),
          phase,
          guardianCount,
        };
        if (!shouldSend(state)) {
          if (phase !== 'DURING' || guardianCount === 0) {
            stop();
          }
          return;
        }
        try {
          const fresh = last && Date.now() - last.at < STALE_MS ? last : null;
          const { latitude, longitude } = fresh ?? (await currentPosition());
          await updateMyLocation(latitude, longitude);
        } catch (e: any) {
          if (e?.status === 400) {
            stop();
          }
        }
      };

      if (consent === 'yes') {
        // 앱이 뒤로 가도 이어서 받으려면 "항상 허용" 과 위치 업데이트를 계속 켜 둬야 한다.
        // 거절해도 괜찮다. 아래 위치 요청이 실패하고 조용히 넘어간다
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'always',
          enableBackgroundLocationUpdates: true,
        });
        Geolocation.requestAuthorization();
        watchId = Geolocation.watchPosition(
          p => {
            last = {
              latitude: p.coords.latitude,
              longitude: p.coords.longitude,
              at: p.timestamp,
            };
            if (Date.now() - lastSentAt >= SEND_EVERY_MS - 2_000) {
              send();
            }
          },
          () => {},
          { enableHighAccuracy: false, distanceFilter: 0, maximumAge: 10_000 },
        );
      }

      if (mine !== generation) {
        return;
      }
      send();
      timer = setInterval(send, SEND_EVERY_MS);
    };

    start();
    const sub = AppState.addEventListener('change', next => {
      if (next === 'active') {
        start();
      }
    });
    return () => {
      stop();
      sub.remove();
    };
  }, [enabled]);
}
