import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { screenHeaderStyles as s } from './ScreenHeader.styles';
import { ChevronLeftIcon } from './icons';
import colors from '../tokens/colors';

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
      <View style={s.back}>
        <ChevronLeftIcon size={24} color={colors.textPrimary} />
      </View>
    </TouchableOpacity>
    <Text style={s.title} numberOfLines={1}>
      {title}
    </Text>
    <View style={s.side}>{right}</View>
  </View>
);

export default ScreenHeader;
