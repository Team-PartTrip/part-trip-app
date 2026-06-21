import React from 'react';
import { View, Text } from 'react-native';
import { recordStyles as styles } from './RecordView.styles';

// 임시 화면 — 추후 구현 예정
const RecordView: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.icon}>🗂</Text>
        <Text style={styles.title}>기록</Text>
        <Text style={styles.desc}>준비 중입니다.</Text>
      </View>
    </View>
  );
};

export default RecordView;
