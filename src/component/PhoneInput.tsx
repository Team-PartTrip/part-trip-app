import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import colors from '../assets/constants/colors';
import { phoneInputStyles as styles } from './PhoneInput.styles';

const FLAG = '🇰🇷';
const DIAL = '+82';

function formatPhone(digits: string): string {
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 7),
    digits.slice(7, 11),
  ].filter(Boolean);
  return parts.join(' - ');
}

interface PhoneInputProps {
  onChange?: (phoneNumber: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onChange }) => {
  const [digits, setDigits] = useState('');

  // 입력받은 텍스트에서 숫자만 추출 (포맷 문자 제거)
  const handleChangeText = (text: string) => {
    const onlyDigits = text.replace(/\D/g, '').slice(0, 11);
    setDigits(onlyDigits);
    onChange?.(onlyDigits);
  };

  return (
    <View style={styles.container}>
      {/* 국기 + 고정 국번 */}
      <View style={styles.dialArea}>
        <Text style={styles.flag}>{FLAG}</Text>
        <Text style={styles.code}>{DIAL}</Text>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 전화번호 입력 — value를 포맷된 문자열로 고정 */}
      <TextInput
        style={styles.input}
        placeholder="전화번호를 입력하세요."
        placeholderTextColor={colors.placeholder}
        keyboardType="number-pad"
        value={formatPhone(digits)}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default PhoneInput;