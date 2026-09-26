import { useEffect } from 'react';
import { Alert, AppState } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDday, TripPhase } from '../../entities/main/api';
import {
  getMyGuardians,
  stopSharingLocation,
  updateMyLocation,
} from '../../entities/guardian/api';

/** 보내는 간격. 보호자 화면의 "○분 전" 이 2분을 넘지 않게 */
export const SEND_EVERY_MS = 90_000;

const CONSENT_KEY = 'partTrip.locationSharing';
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
  appActive: boolean;
}): boolean {
  return (
    state.consent === 'yes' &&
    state.phase === 'DURING' &&
    state.guardianCount > 0 &&
    state.appActive
  );
}

function currentPosition(): Promise<{ latitude: number; longitude: number }> {
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

function askConsent(): Promise<boolean> {
  return new Promise(resolve =>
    Alert.alert(
      '가족에게 위치를 알려줄까요?',
      '여행하는 동안 연결된 가족(보호자)이 내 위치를 볼 수 있어요.\n앱을 켜 둔 동안만 1~2분마다 보내고, 여행이 끝나면 지워져요.\n프로필 → 가족 연결에서 언제든 끌 수 있어요.',
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
    let generation = 0;

    const stop = () => {
      generation += 1;
      if (timer) {
        clearInterval(timer);
        timer = null;
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
      if (consent === 'yes') {
        // 거절해도 괜찮다. 아래 getCurrentPosition 이 실패하고 조용히 넘어간다
        Geolocation.requestAuthorization();
      }

      const send = async () => {
        const state = {
          consent: await getConsent(),
          phase: dday.status,
          guardianCount: guardians.length,
          appActive: AppState.currentState === 'active',
        };
        if (!shouldSend(state)) {
          return;
        }
        try {
          const { latitude, longitude } = await currentPosition();
          await updateMyLocation(latitude, longitude);
        } catch (e: any) {
          // 여행이 방금 끝났다(400). 다음에 앱을 열 때 다시 확인한다
          if (e?.status === 400) {
            stop();
          }
        }
      };

      if (mine !== generation) {
        return;
      }
      send();
      timer = setInterval(send, SEND_EVERY_MS);
    };

    start();
    const sub = AppState.addEventListener('change', next =>
      next === 'active' ? start() : stop(),
    );
    return () => {
      stop();
      sub.remove();
    };
  }, [enabled]);
}
