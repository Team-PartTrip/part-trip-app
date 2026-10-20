import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '../../shared/ui/Text';
import { toImageUrl } from '../../shared/api/image';
import colors from '../../shared/tokens/colors';

const MAX = 4;

function columns(n: number): number[][] {
  if (n <= 2) {
    return Array.from({ length: n }, (_, i) => [i]);
  }
  return n === 3
    ? [[0], [1, 2]]
    : [
        [0, 2],
        [1, 3],
      ];
}

const PhotoGrid: React.FC<{ urls: string[] }> = ({ urls }) => {
  const shown = urls.slice(0, MAX);
  const extra = urls.length - MAX;
  return (
    <View style={s.grid}>
      {columns(shown.length).map((col, c) => (
        <View key={c} style={s.col}>
          {col.map(i => (
            <View key={i} style={s.cell}>
              <Image source={{ uri: toImageUrl(shown[i]) }} style={s.photo} />
              {i === MAX - 1 && extra > 0 && (
                <View style={s.more}>
                  <Text style={s.moreText}>+{extra}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  grid: { flex: 1, flexDirection: 'row', gap: 2 },
  col: { flex: 1, gap: 2 },
  cell: { flex: 1 },
  photo: { flex: 1 },
  more: {
    ...StyleSheet.absoluteFill as object,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  moreText: { fontSize: 20, fontWeight: '700', color: colors.white },
});

export default PhotoGrid;
