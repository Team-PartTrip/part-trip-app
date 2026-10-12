import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../shared/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordCompleteStyles as s } from './RecordCompleteView.styles';
import { CheckCircleIcon } from '../../shared/ui/icons';
import colors from '../../shared/tokens/colors';

interface Props {
  onConfirm?: () => void;
  onHome?: () => void;
}

const RecordCompleteView: React.FC<Props> = ({ onConfirm, onHome }) => (
  <SafeAreaView style={s.safe}>
    <View style={s.doneIcon}>
      <CheckCircleIcon size={88} color={colors.primary} />
    </View>
    <Text style={s.title}>저장했어요</Text>
    <Text style={s.desc}>여행 기록을 고쳤어요.</Text>
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
