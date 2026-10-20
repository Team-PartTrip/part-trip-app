import React, { useEffect, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import CategoryIcon from './CategoryIcon';
import type { PlaceCategory } from './types';
import { toImageUrl } from '../../shared/api/image';
import colors from '../../shared/tokens/colors';

const PlaceThumb: React.FC<{
  imageUrl?: string | null;
  category: PlaceCategory | null;
  style: StyleProp<ViewStyle>;
}> = ({ imageUrl, category, style }) => {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [imageUrl]);
  return (
    <View style={[style, s.clip]}>
      {imageUrl && !broken ? (
        <Image
          source={{ uri: toImageUrl(imageUrl) }}
          style={s.photo}
          resizeMode="cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <CategoryIcon category={category} color={colors.primary} />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  clip: { overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
});

export default PlaceThumb;
