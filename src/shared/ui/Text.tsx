import React from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
} from 'react-native';

export const MAX_FONT_SCALE = 1.35;

export const Text = React.forwardRef<RNText, TextProps>((props, ref) => (
  <RNText ref={ref} maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />
));

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (props, ref) => (
    <RNTextInput ref={ref} maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />
  ),
);
