import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planGroupStyles as s } from './PlanGroupView.styles';
import WizardHeader from './WizardHeader';
import MemberAvatar from './MemberAvatar';
import colors from '../../shared/tokens/colors';
import { sampleDraftMembers } from '../../entities/planner/sampleData';
import { GroupMember, PlanDraft } from '../../entities/planner/types';

const MAX_HEADCOUNT = 10;

/** 초대 상태별 보조 문구와 색 */
function inviteMeta(member: GroupMember): { text: string; color: string } {
  switch (member.invite) {
    case 'ME':
      return { text: '나', color: colors.primary };
    case 'ACCEPTED':
      return { text: '수락함', color: colors.success };
    default:
      return { text: '초대 대기', color: colors.textTertiary };
  }
}

interface Props {
  onBack?: () => void;
  onNext?: (draft: PlanDraft) => void;
}

const PlanGroupView: React.FC<Props> = ({ onBack, onNext }) => {
  const [together, setTogether] = useState(true);
  const [headcount, setHeadcount] = useState(4);
  const [members, setMembers] = useState<GroupMember[]>(sampleDraftMembers);

  // 혼자 여행이면 인원은 나 한 명으로 고정된다
  const finalHeadcount = together ? headcount : 1;
  const finalMembers = together ? members : members.slice(0, 1);

  const removeMember = (groupMemberId: number) =>
    setMembers(prev =>
      prev.filter(member => member.groupMemberId !== groupMemberId),
    );

  const invite = () =>
    // 초대 링크는 서버가 invite_code 를 내려줘야 만들 수 있다 (TravelGroupEntity)
    Alert.alert(
      '링크로 초대하기',
      '그룹 생성 API가 연결되면 초대 링크를 만들어 공유할 수 있어요.',
    );

  const next = () =>
    onNext?.({
      headcount: finalHeadcount,
      members: finalMembers,
      countryName: '',
      cityName: '',
      startDate: '',
      endDate: '',
    });

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
            {members.map((member, i) => {
              const meta = inviteMeta(member);
              return (
                <View key={member.groupMemberId} style={s.memberRow}>
                  <MemberAvatar
                    nickname={member.nickname}
                    index={i}
                    size={36}
                  />
                  <View style={s.memberBody}>
                    <Text style={s.memberName}>{member.nickname}</Text>
                    <Text style={[s.memberSub, { color: meta.color }]}>
                      {meta.text}
                    </Text>
                  </View>
                  {member.invite !== 'ME' && (
                    <TouchableOpacity
                      hitSlop={12}
                      onPress={() => removeMember(member.groupMemberId)}
                    >
                      <Text style={s.memberRemove}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

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
          onPress={next}
        >
          <Text style={s.primaryText}>다음</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlanGroupView;
