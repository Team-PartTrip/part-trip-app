import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { recordStyles as s } from './RecordView.styles';

interface RecordItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  date: string;
}

// ── 더미 데이터 (추후 GET /api/records 연동) ──
const TRIP = { title: '2026 여름의 싱가포르', flag: '🇸🇬', traveling: true };

const INITIAL: RecordItem[] = [
  {
    id: 'r1',
    title: '싱가포르의 라이트쇼',
    desc: '멋있는 싱가포르의 라이트쇼를 보았다.',
    time: '오후 19:40',
    date: '2024.05.12',
  },
  {
    id: 'r2',
    title: '싱가포르의 푸른 바닷가',
    desc: '보트 등 다양한 수상레저를 즐겼다.',
    time: '오후 19:40',
    date: '2024.05.12',
  },
  {
    id: 'r3',
    title: '플라이어 탑승 후기',
    desc: '엄청 높았고, 야경이 훌륭했다.',
    time: '오후 19:40',
    date: '2024.05.12',
  },
  {
    id: 'r4',
    title: '유니버셜 스튜디오 체험기',
    desc: '유니버셜에는 생각보다 다양한 테마가 있어서 색달랐다.',
    time: '오후 19:40',
    date: '2024.05.12',
  },
];

interface RecordViewProps {
  onOpenMap?: () => void;
  onOpenRecord?: (id: string) => void;
  onWrite?: () => void;
}

const RecordView: React.FC<RecordViewProps> = ({
  onOpenMap,
  onOpenRecord,
  onWrite,
}) => {
  const [records, setRecords] = useState(INITIAL);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (pendingDelete) {
      setRecords(prev => prev.filter(r => r.id !== pendingDelete));
    }
    setPendingDelete(null);
  };

  return (
    <View style={s.safeArea}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 트립 헤더 + 지도 토글 */}
        <View style={s.tripHeader}>
          <Text style={s.tripTitle}>
            {TRIP.title} {TRIP.flag}
          </Text>
          <TouchableOpacity
            style={s.toggleBtn}
            onPress={onOpenMap}
            activeOpacity={0.8}
          >
            <Text style={s.toggleIcon}>🗺️</Text>
          </TouchableOpacity>
        </View>

        {/* 기록 작성 — 여행 중일 때만 가능 */}
        <TouchableOpacity
          style={[s.writeBtn, !TRIP.traveling && s.writeBtnDisabled]}
          activeOpacity={0.85}
          disabled={!TRIP.traveling}
          onPress={onWrite}
        >
          <Text style={s.writeBtnText}>＋ 기록 작성</Text>
        </TouchableOpacity>
        {!TRIP.traveling && (
          <Text style={s.writeNote}>여행 중에만 기록을 작성할 수 있어요.</Text>
        )}

        {/* 기록 목록 */}
        {records.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>기록이 없습니다.</Text>
          </View>
        ) : (
          records.map(r => (
            <TouchableOpacity
              key={r.id}
              style={s.card}
              activeOpacity={0.9}
              onPress={() => onOpenRecord?.(r.id)}
            >
              <View style={s.cardImage} />
              <View style={s.cardBody}>
                <View style={s.cardTopRow}>
                  <Text style={s.cardTitle}>{r.title}</Text>
                  <TouchableOpacity
                    style={s.menuBtn}
                    onPress={() => setPendingDelete(r.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={s.menuIcon}>⋮</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.cardDesc} numberOfLines={2}>
                  {r.desc}
                </Text>
                <Text style={s.cardMeta}>
                  {r.time} · {r.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        visible={pendingDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingDelete(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalText}>기록을 정말 삭제하시겠습니까?</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity
                style={[s.modalBtn, s.modalYes]}
                activeOpacity={0.85}
                onPress={confirmDelete}
              >
                <Text style={s.modalYesText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBtn, s.modalNo]}
                activeOpacity={0.85}
                onPress={() => setPendingDelete(null)}
              >
                <Text style={s.modalNoText}>아니오</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RecordView;
