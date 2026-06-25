import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../component/ScreenHeader';
import { missionDetailStyles as s } from './MissionDetailView.styles';

interface Props {
  onBack?: () => void;
  onVerify?: () => void;
}

const MissionDetailView: React.FC<Props> = ({ onBack, onVerify }) => (
  <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
    <ScreenHeader title="미션 상세" onBack={onBack} />
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.map}>
        <Text style={s.pin}>📍</Text>
      </View>
      <Text style={s.title}>라멘 먹기 🍜</Text>
      <Text style={s.desc}>
        주변에 라멘집이 있어요!{'\n'}라멘 가게 찾아가 한번 라멘 먹기에 도전해
        보세요!
      </Text>
      <View style={s.verifyBox}>
        <View style={s.camCircle}>
          <Text style={s.camIcon}>📷</Text>
        </View>
        <TouchableOpacity
          style={s.verifyBtn}
          activeOpacity={0.85}
          onPress={onVerify}
        >
          <Text style={s.verifyBtnText}>인증하기</Text>
        </TouchableOpacity>
        <Text style={s.hint}>미션 장소에서 사진을 찍어 인증해 주세요.</Text>
      </View>
    </ScrollView>
    <View style={s.footer}>
      <TouchableOpacity
        style={[s.fBtn, s.primary]}
        activeOpacity={0.85}
        onPress={onVerify}
      >
        <Text style={s.primaryText}>완료</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.fBtn, s.ghost]}
        activeOpacity={0.85}
        onPress={onBack}
      >
        <Text style={s.ghostText}>취소</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default MissionDetailView;
