import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

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
        placeholderTextColor="#aab4be"
        keyboardType="number-pad"
        value={formatPhone(digits)}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#dce6f0',
    borderRadius: 12,
    backgroundColor: '#f8fafd',
    paddingHorizontal: 14,
    height: 52,
  },
  dialArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontSize: 14,
    color: '#3a4a5a',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: '#dce6f0',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a2a3a',
    padding: 0,
  },
});

export default PhoneInput;