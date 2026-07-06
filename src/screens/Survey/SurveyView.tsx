import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { surveyStyles as styles } from './SurveyView.styles';
import { completeSurvey } from '../../api/auth';

export interface SurveyQuestion {
  q: string;
  options: [string, string];
}

/** 회원가입 직후 진행하는 여행 취향 설문 문항 */
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    q: '내일 여행을 떠나기 전날 밤, 나의 모습은?',
    options: [
      '일정 검토하고 짐 다 챙겼는지 하나씩 체크하기',
      '필수품만 챙기고 필요하면 가서 산다는 마인드',
    ],
  },
  {
    q: '이동 수단이나 교통편에 대해 나는?',
    options: [
      '이용할 이동 수단을 미리 예매해 두기',
      '이동해야 할 때 구글 맵 켜서 이동 수단 정하기',
    ],
  },
  {
    q: '가려던 곳이 갑자기 문을 닫았다면?',
    options: [
      '준비해 둔 플랜 B로 이동하기',
      '오히려 좋아라며 근처 카페로 들어가기',
    ],
  },
  {
    q: '나에게 여행 예산(비용)이란?',
    options: [
      '항목별 하루 지출 한도를 정해 두고 맞춰쓰기',
      '일단 쓰고 싶은 곳에 쓰고, 나중에 가서 조절하기',
    ],
  },
  {
    q: '동행자가 일정에 없는 일을 제안할 때?',
    options: [
      '원래 계획이 있으니 안 된다고 이야기하기',
      '괜찮은 것 같으니 바로 따라 가기',
    ],
  },
  {
    q: '목적지 도착 후 나의 첫 행동은?',
    options: [
      '주변 풍경과 분위기를 먼저 느끼기',
      '지금 장면을 담기 위해 스마트폰을 키기',
    ],
  },
  {
    q: '교통편을 타고 다음으로 이동할 때 나는?',
    options: [
      '창밖을 바라보며 주변 경치를 구경하기',
      '이동하는 동안 사진을 정리하기',
    ],
  },
  {
    q: '유적지 투어 시 내가 더 선호하는 방식은?',
    options: [
      '궁금한 전시물을 인터넷에 찾아보기',
      '전시물 사진을 찍어서 방문한 걸 기록하기',
    ],
  },
  {
    q: '일정을 모두 마치고 숙소로 왔을 때 나는?',
    options: [
      '숙소 근처 야시장이나 로컬 펍에 나가기',
      '일기를 쓰거나 찍은 사진을 SNS에 올리기',
    ],
  },
];

interface SurveyViewProps {
  /** 설문 완료 시 호출. answers[i] = i번 문항에서 선택한 선택지 인덱스(0 또는 1) */
  onComplete?: (answers: number[]) => void;
}

const SurveyView: React.FC<SurveyViewProps> = ({ onComplete }) => {
  const total = SURVEY_QUESTIONS.length;
  const [index, setIndex] = useState(0);
  // 아직 선택 안 한 문항은 -1
  const [answers, setAnswers] = useState<number[]>(() => Array(total).fill(-1));

  const current = SURVEY_QUESTIONS[index];
  const selected = answers[index];
  const isLast = index === total - 1;

  const select = (optionIndex: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
  };

  const handleNext = async () => {
    if (selected === -1) {
      return;
    }
    if (isLast) {
      try {
        await completeSurvey();
      } catch {
        // 완료 처리 저장에 실패해도 설문 자체는 끝난 것으로 진행 (앱 사용을 막지 않음)
      }
      onComplete?.(answers);
      return;
    }
    setIndex(i => i + 1);
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(i => i - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단: 뒤로 + 진행 표시 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          disabled={index === 0}
          activeOpacity={0.6}
        >
          <Text style={[styles.backText, index === 0 && styles.backHidden]}>
            ‹
          </Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {index + 1} / {total}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {/* 진행 바 */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((index + 1) / total) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.qNumber}>Q{index + 1}</Text>
        <Text style={styles.qText}>{current.q}</Text>

        <View style={styles.options}>
          {current.options.map((opt, i) => {
            const active = selected === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.option, active && styles.optionActive]}
                activeOpacity={0.85}
                onPress={() => select(i)}
              >
                <Text
                  style={[styles.optionText, active && styles.optionTextActive]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 하단 다음/완료 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, selected === -1 && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleNext}
          disabled={selected === -1}
        >
          <Text style={styles.nextBtnText}>{isLast ? '완료' : '다음'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SurveyView;
