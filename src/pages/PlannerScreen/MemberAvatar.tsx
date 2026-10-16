import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '../../shared/ui/Text';
import colors from '../../shared/tokens/colors';
import { avatarTone, initialOf } from '../../entities/planner/types';
import { toImageUrl } from '../../shared/api/image';

interface Props {
  nickname: string;
  imgUrl?: string | null;
  /** 파랑 · 주황을 번갈아 쓰기 위한 목록 안 순서 */
  index: number;
  /** 지름. 피그마에서 24 · 26 · 28 · 36 을 쓴다 */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** 멤버 한 명을 나타내는 원형 이니셜 배지 (피그마 C1 · C2 · C5 · C8 공통) */
const MemberAvatar: React.FC<Props> = ({
  nickname,
  imgUrl,
  index,
  size = 26,
  style,
}) => (
  <View
    style={[
      s.circle,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor:
          avatarTone(index) === 'primary' ? colors.primary : colors.accent,
      },
      style,
    ]}
  >
    {imgUrl ? (
      <Image source={{ uri: toImageUrl(imgUrl) }} style={s.photo} />
    ) : (
      <Text style={[s.label, size >= 36 && s.labelLarge]}>
        {initialOf(nickname)}
      </Text>
    )}
  </View>
);

const s = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  label: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },
  labelLarge: { fontSize: 13 },
});

export default MemberAvatar;
