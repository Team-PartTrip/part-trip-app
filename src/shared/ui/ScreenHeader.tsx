import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { screenHeaderStyles as s } from './ScreenHeader.styles';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

const ScreenHeader: React.FC<Props> = ({ title, onBack, right }) => (
  <View style={s.header}>
    <TouchableOpacity
      style={s.side}
      onPress={onBack}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={s.back}>‹</Text>
    </TouchableOpacity>
    <Text style={s.title} numberOfLines={1}>
      {title}
    </Text>
    <View style={s.side}>{right}</View>
  </View>
);

export default ScreenHeader;
