import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C2 · C3 공통 상단 — 뒤로가기 + 큰 제목 + "N / 4 단계" + 진행 막대
export const wizardHeaderStyles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  title: { marginTop: 8, fontSize: 24, fontWeight: '700', color: colors.text },
  step: { marginTop: 8, fontSize: 12, color: colors.textSecondary },
  track: {
    marginTop: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.primary },
});
