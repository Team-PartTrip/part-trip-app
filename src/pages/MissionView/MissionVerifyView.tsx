import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../shared/tokens/colors';
import { missionVerifyStyles as s } from './MissionVerifyView.styles';
import CameraCapture from '../../shared/ui/CameraCapture';
import { completeMission } from '../../entities/mission/api';

type Phase = 'camera' | 'verifying' | 'done' | 'error';
interface Props {
  missionId: number;
  onBack?: () => void;
  onDone?: () => void;
  onHome?: () => void;
}

const MissionVerifyView: React.FC<Props> = ({
  missionId,
  onBack,
  onDone,
  onHome,
}) => {
  const [phase, setPhase] = useState<Phase>('camera');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCapture = async () => {
    setPhase('verifying');
    try {
      await completeMission(missionId);
      setPhase('done');
    } catch (e: any) {
      setErrorMessage(e?.message ?? '미션 인증에 실패했습니다.');
      setPhase('error');
    }
  };

  if (phase === 'camera') {
    return (
      <CameraCapture
        title="미션 인증"
        onClose={onBack}
        onCapture={handleCapture}
      />
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
            미션 인증을 확인하는 중이야.{'\n'}잠시만 기다려 줘!
          </Text>
        </View>
        <Text style={s.cat}>🐱</Text>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      </SafeAreaView>
    );
  }

  if (phase === 'error') {
    return (
      <SafeAreaView style={s.center}>
        <Text style={s.cat}>🐱</Text>
        <Text style={s.doneTitle}>인증 실패</Text>
        <Text style={s.doneDesc}>{errorMessage}</Text>
        <View style={s.doneBtns}>
          <TouchableOpacity
            style={[s.dBtn, s.dPrimary]}
            activeOpacity={0.85}
            onPress={() => setPhase('camera')}
          >
            <Text style={s.dPrimaryText}>다시 촬영하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.dBtn, s.dGhost]}
            activeOpacity={0.85}
            onPress={onBack}
          >
            <Text style={s.dGhostText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
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
