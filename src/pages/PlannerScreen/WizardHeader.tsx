import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wizardHeaderStyles as s } from './WizardHeader.styles';

interface Props {
  title: string;
  /** 1부터 센다 */
  step: number;
  total?: number;
  onBack?: () => void;
}

/** 여행 만들기 마법사(C2 · C3)의 공통 상단 */
const WizardHeader: React.FC<Props> = ({ title, step, total = 4, onBack }) => (
  <SafeAreaView edges={['top']} style={s.header}>
    <TouchableOpacity onPress={onBack} hitSlop={12}>
      <Text style={s.back}>‹</Text>
    </TouchableOpacity>
    <Text style={s.title}>{title}</Text>
    <Text style={s.step}>
      {step} / {total} 단계
    </Text>
    <View style={s.track}>
      <View style={[s.fill, { width: `${(step / total) * 100}%` }]} />
    </View>
  </SafeAreaView>
);

export default WizardHeader;
