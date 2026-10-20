import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../shared/ui/Text';
import colors from '../../shared/tokens/colors';
import { getRestroom } from './api';

const RestroomNote: React.FC<{ tourPlaceId: number }> = ({ tourPlaceId }) => {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getRestroom(tourPlaceId)
      .then(t => alive && setText(t))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [tourPlaceId]);
  if (!text) {
    return null;
  }
  return <Text style={styles.note}>화장실 · {text}</Text>;
};

const styles = StyleSheet.create({
  note: { marginTop: 4, fontSize: 14, color: colors.primary },
});

export default RestroomNote;
