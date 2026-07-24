import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { missionDetailStyles as s } from './MissionDetailView.styles';
import { Mission } from '../../entities/mission/api';
import { toImageUrl } from '../../shared/api/image';

interface Props {
  mission: Mission;
  onBack?: () => void;
  onVerify?: () => void;
}

const MissionDetailView: React.FC<Props> = ({ mission, onBack, onVerify }) => (
  <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
    <ScreenHeader title="미션 상세" onBack={onBack} />
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.map}>
        {mission.imgUrl ? (
          <Image
            source={{ uri: toImageUrl(mission.imgUrl) }}
            style={{ width: '100%', height: '100%', borderRadius: 16 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={s.pin}>📍</Text>
        )}
      </View>
      <Text style={s.title}>{mission.missionTitle}</Text>
      <Text style={s.desc}>{mission.missionDescription}</Text>

      {mission.completed ? (
        <View style={s.verifyBox}>
          <Text style={s.hint}>이미 완료한 미션이에요. 수고했어요! 🎉</Text>
        </View>
      ) : (
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
      )}
    </ScrollView>
    {!mission.completed && (
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
    )}
  </SafeAreaView>
);

export default MissionDetailView;
