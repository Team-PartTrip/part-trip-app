import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/constants/colors';
import { missionVerifyStyles as s } from './MissionVerifyView.styles';

type Phase = 'camera' | 'verifying' | 'done';
interface Props {
  onBack?: () => void;
  onDone?: () => void;
  onHome?: () => void;
}

const MissionVerifyView: React.FC<Props> = ({ onBack, onDone, onHome }) => {
  const [phase, setPhase] = useState<Phase>('camera');
  useEffect(() => {
    if (phase === 'verifying') {
      const t = setTimeout(() => setPhase('done'), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === 'camera') {
    return (
      <View style={s.cam}>
        <SafeAreaView edges={['top']}>
          <View style={s.camHeader}>
            <TouchableOpacity
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={s.camBack}>‹</Text>
            </TouchableOpacity>
            <Text style={s.camTitle}>미션 인증</Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
        <View style={s.grid}>
          <View style={[s.v, { left: '33.33%' }]} />
          <View style={[s.v, { left: '66.66%' }]} />
          <View style={[s.h, { top: '33.33%' }]} />
          <View style={[s.h, { top: '66.66%' }]} />
        </View>
        <SafeAreaView edges={['bottom']} style={s.camBottom}>
          <View style={s.thumb} />
          <TouchableOpacity
            style={s.shutter}
            activeOpacity={0.8}
            onPress={() => setPhase('verifying')}
          >
            <View style={s.shutterIn} />
          </TouchableOpacity>
          <Text style={s.flip}>↻</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (phase === 'verifying') {
    return (
      <SafeAreaView style={s.center}>
        <Text style={s.logo}>
          <Text style={s.lp}>Part</Text>
          <Text style={s.lt}>Trip</Text>
        </Text>
        <View style={s.bubble}>
          <Text style={s.bubbleText}>
            AI가 미션 인증을 확인하는 중이야.{'\n'}잠시만 기다려 줘!
          </Text>
        </View>
        <Text style={s.cat}>🐱</Text>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.center}>
      <Text style={s.cat}>🐱</Text>
      <Text style={s.doneTitle}>인증 완료!</Text>
      <Text style={s.doneDesc}>미션 인증을 성공적으로 완료하였습니다!</Text>
      <View style={s.doneBtns}>
        <TouchableOpacity
          style={[s.dBtn, s.dPrimary]}
          activeOpacity={0.85}
          onPress={onDone}
        >
          <Text style={s.dPrimaryText}>미션 완료 목록 확인하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.dBtn, s.dGhost]}
          activeOpacity={0.85}
          onPress={onHome}
        >
          <Text style={s.dGhostText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MissionVerifyView;
