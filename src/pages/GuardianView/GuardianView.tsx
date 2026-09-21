import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { guardianStyles as s } from './GuardianView.styles';
import colors from '../../shared/tokens/colors';
import { touch48 } from '../../shared/ui/hitSlop';
import { getConsent, setSharing } from '../../shared/lib/locationSharing';
import {
  acceptGuardianInvite,
  createGuardianInvite,
  getMyGuardians,
  getMySeniors,
  GuardianInvite,
  GuardianLink,
  unlinkGuardian,
} from '../../entities/guardian/api';

/** "2026-09-22T18:10:00" → "9월 22일 오후 6:10" */
export function formatUntil(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const hour = date.getHours();
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  const ampm = hour < 12 ? '오전' : '오후';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${ampm} ${h12}:${minute}`;
}

/** 받는 사람이 무엇을 해야 하는지까지 적는다. 코드만 보내면 어디에 넣는지 모른다 */
export function inviteMessage(code: string): string {
  return `PartTrip 보호자 초대 코드: ${code}\n앱의 프로필 → 가족 연결에서 코드를 넣어주세요. (24시간 동안 쓸 수 있어요)`;
}

interface Props {
  onBack?: () => void;
  /** 보호자: 시니어의 일정 · 위치 보기 */
  onOpenSenior?: (senior: GuardianLink) => void;
}

/**
 * 가족 연결 (명세 Func-012-03).
 *
 * 시니어가 코드를 만들어 자녀에게 보내면, 자녀가 보호자로 연결되어 일정과
 * 여행 중 위치를 본다. 보호자는 일정을 고칠 수 없다.
 */
const GuardianView: React.FC<Props> = ({ onBack, onOpenSenior }) => {
  const [guardians, setGuardians] = useState<GuardianLink[] | null>(null);
  const [invite, setInvite] = useState<GuardianInvite | null>(null);
  const [creating, setCreating] = useState(false);
  const [unlinking, setUnlinking] = useState<number | null>(null);
  const [seniors, setSeniors] = useState<GuardianLink[] | null>(null);
  const [code, setCode] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [sharing, setSharingOn] = useState(false);

  // 코드를 보내고 돌아오면 그 사이 연결된 보호자가 보이게 포커스마다 받는다
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getMyGuardians()
        .then(list => alive && setGuardians(list))
        .catch(() => alive && setGuardians([]));
      getMySeniors()
        .then(list => alive && setSeniors(list))
        .catch(() => alive && setSeniors([]));
      getConsent().then(consent => alive && setSharingOn(consent === 'yes'));
      return () => {
        alive = false;
      };
    }, []),
  );

  const makeCode = async () => {
    if (creating) {
      return;
    }
    setCreating(true);
    try {
      setInvite(await createGuardianInvite());
    } catch (e: any) {
      Alert.alert(
        '코드를 만들지 못했어요',
        e?.message ?? '잠시 후 다시 시도해주세요.',
      );
    } finally {
      setCreating(false);
    }
  };

  const shareCode = async () => {
    if (!invite) {
      return;
    }
    try {
      await Share.share({ message: inviteMessage(invite.code) });
    } catch {
      Alert.alert('보호자 초대 코드', invite.code);
    }
  };

  const toggleSharing = (on: boolean) => {
    setSharingOn(on);
    setSharing(on);
  };

  const accept = async () => {
    if (accepting || code.trim().length < 6) {
      return;
    }
    setAccepting(true);
    try {
      const link = await acceptGuardianInvite(code);
      setCode('');
      setSeniors(prev => [
        ...(prev ?? []).filter(s2 => s2.linkId !== link.linkId),
        link,
      ]);
      Alert.alert('연결했어요', `${link.nickName}님의 여행을 볼 수 있어요.`);
    } catch (e: any) {
      Alert.alert(
        '연결하지 못했어요',
        e?.message ?? '잠시 후 다시 시도해주세요.',
      );
    } finally {
      setAccepting(false);
    }
  };

  // 끊으면 그 가족은 바로 일정과 위치를 못 본다. 한 번 묻는다
  const confirmUnlink = (link: GuardianLink) =>
    Alert.alert(
      '연결 끊기',
      `${link.nickName}님과 연결을 끊을까요?\n끊으면 서로의 일정과 위치를 더 볼 수 없어요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '끊기',
          style: 'destructive',
          onPress: async () => {
            setUnlinking(link.linkId);
            try {
              await unlinkGuardian(link.linkId);
              // 시니어 쪽 · 보호자 쪽 어느 목록에서 끊었든 같은 연결이다
              setGuardians(prev =>
                (prev ?? []).filter(g => g.linkId !== link.linkId),
              );
              setSeniors(prev =>
                (prev ?? []).filter(g => g.linkId !== link.linkId),
              );
            } catch (e: any) {
              Alert.alert(
                '끊지 못했어요',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
            } finally {
              setUnlinking(null);
            }
          },
        },
      ],
    );

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={touch48(32)}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
        >
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>가족 연결</Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.lead}>
          가족이 보호자로 연결되면 내 여행 일정과 여행 중 위치를 볼 수 있어요.
          일정을 고칠 수는 없어요.
        </Text>

        <Text style={s.section}>보호자 초대하기</Text>
        {invite ? (
          <View style={s.codeBox}>
            <Text
              style={s.code}
              accessibilityLabel={`초대 코드 ${invite.code
                .split('')
                .join(' ')}`}
            >
              {invite.code}
            </Text>
            <Text style={s.codeUntil}>
              {formatUntil(invite.expiresAt)}까지 쓸 수 있어요
            </Text>
            <TouchableOpacity
              style={s.primaryBtn}
              activeOpacity={0.85}
              accessibilityRole="button"
              onPress={shareCode}
            >
              <Text style={s.primaryText}>가족에게 보내기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            disabled={creating}
            onPress={makeCode}
          >
            {creating ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={s.primaryText}>초대 코드 만들기</Text>
            )}
          </TouchableOpacity>
        )}

        <Text style={s.section}>내 보호자</Text>
        {guardians === null ? (
          <ActivityIndicator style={s.loading} color={colors.primary} />
        ) : guardians.length === 0 ? (
          <Text style={s.empty}>아직 연결된 가족이 없어요.</Text>
        ) : (
          guardians.map(link => (
            <View key={link.linkId} style={s.row}>
              <View style={s.rowBody}>
                <Text style={s.rowTitle}>{link.nickName}</Text>
                <Text style={s.rowSub}>{formatUntil(link.linkedAt)} 연결</Text>
              </View>
              <TouchableOpacity
                hitSlop={touch48(24)}
                accessibilityRole="button"
                accessibilityLabel={`${link.nickName}님과 연결 끊기`}
                disabled={unlinking !== null}
                onPress={() => confirmUnlink(link)}
              >
                <Text style={s.unlink}>
                  {unlinking === link.linkId ? '…' : '끊기'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {!!guardians?.length && (
          <View style={s.shareRow}>
            <View style={s.rowBody}>
              <Text style={s.rowTitle}>여행 중 위치 알려주기</Text>
              <Text style={s.rowSub}>
                여행하는 동안, 앱을 켜 둔 동안만 1~2분마다 보내요
              </Text>
            </View>
            <Switch
              value={sharing}
              onValueChange={toggleSharing}
              trackColor={{ true: colors.primary }}
              accessibilityLabel="여행 중 위치 알려주기"
            />
          </View>
        )}

        <Text style={s.section}>내가 보호하는 가족</Text>
        <Text style={s.lead}>가족에게 받은 6자리 코드를 넣어주세요.</Text>
        <View style={[s.acceptRow, s.locationBtn]}>
          <TextInput
            style={s.codeInput}
            placeholder="코드 6자리"
            placeholderTextColor={colors.placeholder}
            value={code}
            onChangeText={text => setCode(text.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            accessibilityLabel="보호자 초대 코드"
          />
          <TouchableOpacity
            style={[s.acceptBtn, code.trim().length < 6 && s.disabled]}
            activeOpacity={0.85}
            accessibilityRole="button"
            disabled={accepting || code.trim().length < 6}
            onPress={accept}
          >
            {accepting ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={s.primaryText}>연결</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={s.seniorList}>
          {seniors === null ? (
            <ActivityIndicator style={s.loading} color={colors.primary} />
          ) : (
            seniors.map(link => (
              <View key={link.linkId} style={s.row}>
                <TouchableOpacity
                  style={s.rowBody}
                  accessibilityRole="button"
                  accessibilityLabel={`${link.nickName}님의 여행 보기`}
                  onPress={() => onOpenSenior?.(link)}
                >
                  <Text style={s.rowTitle}>{link.nickName}</Text>
                  <Text style={s.rowSub}>일정 · 위치 보기 ›</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={touch48(24)}
                  accessibilityRole="button"
                  accessibilityLabel={`${link.nickName}님과 연결 끊기`}
                  disabled={unlinking !== null}
                  onPress={() => confirmUnlink(link)}
                >
                  <Text style={s.unlink}>
                    {unlinking === link.linkId ? '…' : '끊기'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default GuardianView;
