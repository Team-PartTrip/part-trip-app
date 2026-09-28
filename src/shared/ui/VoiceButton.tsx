import React, { useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import colors from '../tokens/colors';
import { MicIcon } from './icons';

interface Props {
  onText: (text: string) => void;
}

async function micAllowed(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

const VoiceButton: React.FC<Props> = ({ onText }) => {
  const [listening, setListening] = useState(false);

  useEffect(
    () => () => {
      Voice.destroy()
        .then(() => Voice.removeAllListeners())
        .catch(() => {});
    },
    [],
  );

  const start = async () => {
    if (!(await micAllowed())) {
      Alert.alert('알림', '마이크 권한을 허용해야 말로 찾을 수 있어요.');
      return;
    }
    const take = (e: { value?: string[] }) => {
      const text = e.value?.[0];
      if (text) {
        onText(text);
      }
    };
    Voice.onSpeechPartialResults = take;
    Voice.onSpeechResults = e => {
      take(e);
      setListening(false);
    };
    Voice.onSpeechEnd = () => setListening(false);
    Voice.onSpeechError = () => {
      setListening(false);
      Alert.alert('알림', '말을 알아듣지 못했어요. 다시 눌러 말해주세요.');
    };
    try {
      await Voice.start('ko-KR');
      setListening(true);
    } catch {
      Alert.alert('알림', '이 휴대폰에서는 음성 검색을 쓸 수 없어요.');
    }
  };

  const stop = () => {
    Voice.stop().catch(() => {});
    setListening(false);
  };

  return (
    <TouchableOpacity
      style={[st.btn, listening && st.btnOn]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={listening ? '말하기 멈추기' : '말로 찾기'}
      accessibilityState={{ selected: listening }}
      onPress={listening ? stop : start}
    >
      <MicIcon
        size={24}
        color={listening ? colors.textOnPrimary : colors.primary}
      />
    </TouchableOpacity>
  );
};

export const voiceStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1 },
});

const st = StyleSheet.create({
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tint,
  },
  btnOn: { backgroundColor: colors.primaryFill },
});

export default VoiceButton;
