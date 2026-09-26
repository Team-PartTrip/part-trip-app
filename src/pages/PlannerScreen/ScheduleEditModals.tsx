import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { planStatusStyles as s } from './PlanStatusView.styles';
import colors from '../../shared/tokens/colors';
import {
  getScheduleCandidates,
  SchedulePlace,
} from '../../entities/planner/api';
import CategoryIcon from '../../entities/planner/CategoryIcon';
import { StarIcon } from '../../shared/ui/icons';

// 글자를 칠 때마다 서버를 부르지 않도록 기다리는 시간
const SEARCH_DELAY_MS = 300;
// 메뉴 창이 닫히는 애니메이션 시간
const MODAL_GAP_MS = 350;

export interface MenuAction {
  label: string;
  danger?: boolean;
  onPress: () => void;
}

/**
 * ≡ 를 눌렀을 때 뜨는 메뉴. 드래그가 어려운 사용자도 옮기고 바꿀 수 있게 한다.
 * Alert 는 안드로이드에서 버튼이 3개까지라 직접 그린다.
 */
export const SlotMenu: React.FC<{
  title: string | null;
  actions: MenuAction[];
  onClose: () => void;
}> = ({ title, actions, onClose }) => (
  <Modal
    visible={title !== null}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={s.sheetBackdrop}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={s.sheet}>
        <Text style={s.sheetTitle}>{title}</Text>
        {actions.map(action => (
          <TouchableOpacity
            key={action.label}
            style={s.sheetItem}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              // iOS 는 창이 닫히는 도중 다른 창(장소 고르기)을 띄우면 안 뜬다
              setTimeout(action.onPress, MODAL_GAP_MS);
            }}
          >
            <Text style={[s.sheetItemText, action.danger && s.sheetItemDanger]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={s.sheetItem}
          accessibilityRole="button"
          onPress={onClose}
        >
          <Text style={s.sheetCancel}>취소</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

/** 빈 칸의 + 를 눌렀을 때. 그날 지역의 장소를 찾아 고른다 */
export const PlacePicker: React.FC<{
  plannerId: number;
  /** 고를 날짜. null 이면 닫혀 있다 */
  date: string | null;
  title: string;
  onPick: (place: SchedulePlace) => void;
  onClose: () => void;
}> = ({ plannerId, date, title, onPick, onClose }) => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<SchedulePlace[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!date) {
      return;
    }
    let alive = true;
    setFailed(false);
    const timer = setTimeout(
      () => {
        getScheduleCandidates(plannerId, date, query.trim())
          .then(list => alive && setPlaces(list))
          .catch(() => alive && setFailed(true));
      },
      query ? SEARCH_DELAY_MS : 0,
    );
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [plannerId, date, query]);

  // 닫으면 다음에 열 때 지난 검색어가 남지 않게 한다
  const close = () => {
    setQuery('');
    setPlaces(null);
    onClose();
  };

  return (
    <Modal visible={date !== null} animationType="slide" onRequestClose={close}>
      <View style={s.pickerSafe}>
        <View style={s.pickerHeader}>
          <Text style={s.pickerTitle}>{title}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={close}>
            <Text style={s.pickerClose}>닫기</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={s.pickerInput}
          placeholder="장소 이름으로 찾기"
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="장소 찾기"
        />
        {failed ? (
          <Text style={s.pickerEmpty}>장소를 불러오지 못했어요</Text>
        ) : places === null ? (
          <ActivityIndicator style={s.loading} color={colors.primary} />
        ) : (
          <FlatList
            data={places}
            keyExtractor={item => `${item.tourPlaceId}`}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={s.pickerEmpty}>고를 수 있는 장소가 없어요</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.pickerRow}
                accessibilityRole="button"
                onPress={() => {
                  onPick(item);
                  close();
                }}
              >
                <View style={s.thumb}>
                  <CategoryIcon
                    category={item.category}
                    color={colors.primary}
                  />
                </View>
                <View style={s.rowBody}>
                  <Text style={s.rowTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={s.ratingRow}>
                    {!!item.categoryLabel && (
                      <Text style={s.rowSub}>{item.categoryLabel}</Text>
                    )}
                    {!!item.rating && (
                      <>
                        <StarIcon size={12} color={colors.textSecondary} />
                        <Text style={s.rowSub}>{item.rating}</Text>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
};
