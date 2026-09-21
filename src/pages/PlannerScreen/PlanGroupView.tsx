import React, { useState } from 'react';
import { touch48 } from '../../shared/ui/hitSlop';
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
import colors from '../../shared/tokens/colors';
import { PlanDraft } from '../../entities/planner/types';

const MAX_HEADCOUNT = 10;

interface Props {
  onBack?: () => void;
  onNext?: (draft: PlanDraft) => void;
}

const PlanGroupView: React.FC<Props> = ({ onBack, onNext }) => {
  const [together, setTogether] = useState(true);
  const [headcount, setHeadcount] = useState(4);
  // 서버가 title 을 @NotBlank 로 받고, 없으면 플래너 목록에서 계획을 구분할 수 없다
  const [title, setTitle] = useState('');

  const next = () => {
    if (!title.trim()) {
      Alert.alert('알림', '여행 제목을 입력해주세요.');
      return;
    }
    onNext?.({
      title: title.trim(),
      isSolo: !together,
      // 혼자 여행이면 인원은 나 한 명으로 고정된다
      headcount: together ? headcount : 1,
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
          placeholder="예: 경주 가을 나들이"
          placeholderTextColor={colors.placeholder}
          value={title}
          onChangeText={setTitle}
          maxLength={40}
        />

        {together ? (
          <>
            <Text style={s.label}>인원</Text>
            <View style={s.stepperRow}>
              <Text style={s.stepperLabel}>나를 포함한 인원</Text>
              <TouchableOpacity
                hitSlop={touch48(34)}
                style={[s.stepperBtn, headcount <= 2 && s.stepperBtnOff]}
                activeOpacity={0.7}
                disabled={headcount <= 2}
                onPress={() => setHeadcount(count => Math.max(2, count - 1))}
              >
                <Text style={s.stepperSign}>−</Text>
              </TouchableOpacity>
              <Text style={s.stepperValue}>{headcount}</Text>
              <TouchableOpacity
                hitSlop={touch48(34)}
                style={[
                  s.stepperBtn,
                  headcount >= MAX_HEADCOUNT && s.stepperBtnOff,
                ]}
                activeOpacity={0.7}
                disabled={headcount >= MAX_HEADCOUNT}
                onPress={() =>
                  setHeadcount(count => Math.min(MAX_HEADCOUNT, count + 1))
                }
              >
                <Text style={s.stepperSign}>＋</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={s.soloNote}>
            혼자 떠나는 여행이라 초대 없이 바로 일정을 만들어요.
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
