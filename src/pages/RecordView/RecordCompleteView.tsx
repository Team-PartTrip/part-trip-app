import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordCompleteStyles as s } from './RecordCompleteView.styles';

interface Props {
  onConfirm?: () => void;
  onHome?: () => void;
}

const RecordCompleteView: React.FC<Props> = ({ onConfirm, onHome }) => (
  <SafeAreaView style={s.safe}>
    <Text style={s.cat}>🐱</Text>
    <Text style={s.title}>수정 완료!</Text>
    <Text style={s.desc}>여행 기록이 성공적으로 저장되었습니다!</Text>
    <View style={s.btns}>
      <TouchableOpacity
        style={[s.btn, s.primary]}
        activeOpacity={0.85}
        onPress={onConfirm}
      >
        <Text style={s.primaryText}>기록 확인하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.btn, s.ghost]}
        activeOpacity={0.85}
        onPress={onHome}
      >
        <Text style={s.ghostText}>홈으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default RecordCompleteView;
