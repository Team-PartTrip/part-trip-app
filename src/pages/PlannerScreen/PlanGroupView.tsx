import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planGroupStyles as s } from './PlanGroupView.styles';
import WizardHeader from './WizardHeader';
import MemberAvatar from './MemberAvatar';
import colors from '../../shared/tokens/colors';
import {
  createPlanner,
  getPlannerMembers,
  PlannerMember,
} from '../../entities/planner/api';
import { PlanDraft } from '../../entities/planner/types';

const MAX_HEADCOUNT = 10;


interface Props {
  onBack?: () => void;
  onNext?: (draft: PlanDraft) => void;
}

const PlanGroupView: React.FC<Props> = ({ onBack, onNext }) => {
  const [together, setTogether] = useState(true);
  const [headcount, setHeadcount] = useState(4);
  // 피그마 C2 에는 없는 입력이다. 서버가 title 을 @NotBlank 로 받고,
  // 없으면 플래너 목록(C1)에서 계획을 구분할 수 없어서 넣었다.
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState<PlannerMember[]>([]);
  const [plannerId, setPlannerId] = useState<number | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 혼자 여행이면 인원은 나 한 명으로 고정된다
  const finalHeadcount = together ? headcount : 1;

  /**
   * 플래너를 아직 안 만들었으면 만든다.
   * 초대하기와 다음이 모두 필요로 해서, 한 번만 만들고 재사용한다.
   */
  const ensurePlanner = async (): Promise<number | null> => {
    if (plannerId !== null) {
      return plannerId;
    }
    if (!title.trim()) {
      Alert.alert('알림', '여행 제목을 입력해주세요.');
      return null;
    }
    try {
      setBusy(true);
      const created = await createPlanner({
        title: title.trim(),
        memberCount: finalHeadcount,
        isSolo: !together,
      });
      setPlannerId(created.plannerId);
      setInviteCode(created.inviteCode);
      setMembers(await getPlannerMembers(created.plannerId).catch(() => []));
      return created.plannerId;
    } catch (e: any) {
      Alert.alert('생성 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const invite = async () => {
    const id = await ensurePlanner();
    if (id === null) {
      return;
    }
    Alert.alert(
      '초대 코드',
      `${inviteCode ?? ''}\n\n이 코드를 전달하면 참여할 수 있어요.`,
    );
  };

  const next = async () => {
    const id = await ensurePlanner();
    if (id === null) {
      return;
    }
    onNext?.({
      plannerId: id,
      headcount: finalHeadcount,
      countryName: '',
      cityName: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <View style={s.safeArea}>
      <WizardHeader title="여행 그룹 정하기" step={1} onBack={onBack} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.modeRow}>
          {[
            { on: !together, label: '혼자 여행', icon: '🧍' },
            { on: together, label: '함께 여행', icon: '🧑‍🤝‍🧑' },
          ].map(mode => (
            <TouchableOpacity
              key={mode.label}
              style={[s.modeCard, mode.on && s.modeCardOn]}
              activeOpacity={0.85}
              onPress={() => setTogether(mode.label === '함께 여행')}
            >
              <View style={[s.modeDot, mode.on && s.modeDotOn]}>
                <Text style={s.modeIcon}>{mode.icon}</Text>
              </View>
              <Text style={[s.modeLabel, mode.on && s.modeLabelOn]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>여행 제목</Text>
        <TextInput
          style={s.titleInput}
          placeholder="예: 오사카 먹방 여행"
          placeholderTextColor={colors.placeholder}
          value={title}
          onChangeText={setTitle}
          editable={plannerId === null}
          maxLength={40}
        />

        {together ? (
          <>
            <Text style={s.label}>인원</Text>
            <View style={s.stepperRow}>
              <Text style={s.stepperLabel}>나를 포함한 인원</Text>
              <TouchableOpacity
                style={[
                  s.stepperBtn,
                  headcount <= members.length && s.stepperBtnOff,
                ]}
                activeOpacity={0.7}
                disabled={headcount <= members.length}
                onPress={() => setHeadcount(count => count - 1)}
              >
                <Text style={s.stepperSign}>−</Text>
              </TouchableOpacity>
              <Text style={s.stepperValue}>{headcount}</Text>
              <TouchableOpacity
                style={[
                  s.stepperBtn,
                  headcount >= MAX_HEADCOUNT && s.stepperBtnOff,
                ]}
                activeOpacity={0.7}
                disabled={headcount >= MAX_HEADCOUNT}
                onPress={() => setHeadcount(count => count + 1)}
              >
                <Text style={s.stepperSign}>＋</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.label}>함께할 사람</Text>
            {members.length === 0 ? (
              <Text style={s.memberEmpty}>
                초대 코드를 전달하면 여기에 참여한 사람이 보여요.
              </Text>
            ) : (
              members.map((member, i) => (
                <View key={member.userId} style={s.memberRow}>
                  <MemberAvatar
                    nickname={member.nickName}
                    index={i}
                    size={36}
                  />
                  <View style={s.memberBody}>
                    <Text style={s.memberName}>{member.nickName}</Text>
                    <Text style={s.memberSub}>
                      {member.role === 'OWNER' ? '방장' : '참여 완료'}
                    </Text>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity
              style={s.inviteBtn}
              activeOpacity={0.85}
              onPress={invite}
            >
              <Text style={s.inviteText}>+ 링크로 초대하기</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={s.soloNote}>
            혼자 떠나는 여행이라 투표 없이 바로 일정을 만들어요.{'\n'}
            나중에 함께할 사람을 초대할 수도 있어요.
          </Text>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          activeOpacity={0.85}
          disabled={busy}
          onPress={next}
        >
          <Text style={s.primaryText}>{busy ? '만드는 중…' : '다음'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlanGroupView;
