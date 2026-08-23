import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { notificationSettingsStyles as s } from './NotificationSettingsView.styles';
import {
  getNotificationSettings,
  updateNotificationSettings,
  NotificationSetting,
  NotificationType,
} from '../../entities/notification/api';

// 화면은 5줄이지만 서버 알림 종류는 6가지다.
// "투표"가 참여와 마감 임박 두 가지를 함께 켜고 끈다.
const GROUPS: {
  title: string;
  desc: string;
  types: NotificationType[];
}[] = [
  {
    title: '투표',
    desc: '그룹원이 투표하거나 마감이 다가올 때',
    types: ['VOTE_PARTICIPATED', 'VOTE_DEADLINE'],
  },
  {
    title: '기록',
    desc: '촬영한 사진 정리가 끝났을 때',
    types: ['PHOTO_ORGANIZED'],
  },
  {
    title: '국가 획득',
    desc: '새로운 국가를 획득했을 때',
    types: ['COUNTRY_ACQUIRED'],
  },
  {
    title: '여행카드',
    desc: '여행카드가 만들어졌을 때',
    types: ['TRIP_CARD_CREATED'],
  },
  {
    title: '그룹',
    desc: '초대가 수락되거나 새 멤버가 들어왔을 때',
    types: ['GROUP_INVITE_ACCEPTED'],
  },
];

const Toggle: React.FC<{ on: boolean; onPress: () => void }> = ({
  on,
  onPress,
}) => (
  <TouchableOpacity
    style={[s.toggle, on ? s.toggleOn : s.toggleOff]}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <View style={s.knob} />
  </TouchableOpacity>
);

interface Props {
  onBack?: () => void;
}

const NotificationSettingsView: React.FC<Props> = ({ onBack }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  // 야간 방해 금지는 서버에 저장할 곳이 없어 화면 안에서만 동작한다
  const [quiet, setQuiet] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      getNotificationSettings()
        .then(rows => alive && setSettings(rows))
        .catch(() => alive && setSettings([]))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, []),
  );

  const isOn = (types: NotificationType[]) =>
    types.every(t => settings.find(x => x.type === t)?.enabled !== false);

  const toggle = async (types: NotificationType[]) => {
    const next = !isOn(types);
    // 먼저 화면을 바꾸고 실패하면 되돌린다
    const before = settings;
    setSettings(prev =>
      prev.map(x => (types.includes(x.type) ? { ...x, enabled: next } : x)),
    );
    try {
      const rows = await updateNotificationSettings(
        types.map(t => ({ type: t, enabled: next })),
      );
      setSettings(rows);
    } catch (e: any) {
      setSettings(before);
      Alert.alert('실패', e?.message ?? '알림 설정을 바꾸지 못했습니다.');
    }
  };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>알림 설정</Text>
        <Text style={s.desc}>받고 싶은 알림만 켜두세요</Text>

        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : (
          <>
            <View style={s.card}>
              {GROUPS.map((g, i) => (
                <View key={g.title}>
                  {i > 0 && <View style={s.divider} />}
                  <View style={s.row}>
                    <View style={s.rowBody}>
                      <Text style={s.rowTitle}>{g.title}</Text>
                      <Text style={s.rowDesc}>{g.desc}</Text>
                    </View>
                    <Toggle on={isOn(g.types)} onPress={() => toggle(g.types)} />
                  </View>
                </View>
              ))}
            </View>

            <View style={s.card}>
              <View style={s.row}>
                <View style={s.rowBody}>
                  <Text style={s.rowTitle}>야간 방해 금지</Text>
                  <Text style={s.rowDesc}>설정한 시간에는 알림을 보내지 않아요</Text>
                </View>
                <Toggle on={quiet} onPress={() => setQuiet(v => !v)} />
              </View>
              <View style={s.divider} />
              <View style={s.quietRow}>
                <Text style={s.quietTime}>22:00 – 08:00</Text>
                <Text style={s.chevron}>›</Text>
              </View>
            </View>

            <Text style={s.note}>
              야간 방해 금지는 아직 서버에 저장되지 않아 앱을 다시 켜면 초기화돼요.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsView;
