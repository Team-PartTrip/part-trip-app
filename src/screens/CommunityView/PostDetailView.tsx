import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../../component/ScreenHeader';
import { postDetailStyles as s } from './PostDetailView.styles';
import {
  getReview,
  getSharedTripDetail,
  importTrip,
  getBoard,
  getComments,
  createComment,
  ReviewDto,
  BoardDto,
  CommentDto,
} from '../../api/community';
import { TripDto } from '../../api/trip';

type PostType = 'free' | 'review' | 'route';

const stars = (n: number) => '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(d.getDate()).padStart(2, '0')}`;
};

const CommentItem: React.FC<{ c: CommentDto }> = ({ c }) => (
  <View style={s.comment}>
    <View style={s.cHead}>
      <View style={s.cAvatar}>
        <Text style={s.cAvatarIcon}>🧑</Text>
      </View>
      <Text style={s.cAuthor}>{c.nickName}</Text>
      <Text style={s.cTime}>{formatDate(c.createDate)}</Text>
    </View>
    <Text style={s.cText}>{c.content}</Text>
  </View>
);

interface Props {
  id?: string;
  type?: PostType;
  onBack?: () => void;
}

const PostDetailView: React.FC<Props> = ({ id, type = 'free', onBack }) => {
  const [board, setBoard] = useState<BoardDto | null>(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const [review, setReview] = useState<ReviewDto | null>(null);
  const [reviewLoading, setReviewLoading] = useState(true);

  const [trip, setTrip] = useState<TripDto | null>(null);
  const [tripLoading, setTripLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const loadBoard = useCallback(async () => {
    if (!id) return;
    try {
      setBoardLoading(true);
      const [b, c] = await Promise.all([
        getBoard(Number(id)),
        getComments(Number(id)),
      ]);
      setBoard(b);
      setComments(c);
    } catch {
      setBoard(null);
    } finally {
      setBoardLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (type === 'free') {
        loadBoard();
      }
      if (type === 'review' && id) {
        setReviewLoading(true);
        getReview(Number(id))
          .then(setReview)
          .catch(() => setReview(null))
          .finally(() => setReviewLoading(false));
      }
      if (type === 'route' && id) {
        setTripLoading(true);
        getSharedTripDetail(Number(id))
          .then(setTrip)
          .catch(() => setTrip(null))
          .finally(() => setTripLoading(false));
      }
    }, [type, id, loadBoard]),
  );

  const submitComment = async () => {
    if (!commentText.trim() || !id) return;
    try {
      setPosting(true);
      await createComment(Number(id), { content: commentText.trim() });
      setCommentText('');
      const c = await getComments(Number(id));
      setComments(c);
    } catch (e: any) {
      Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setPosting(false);
    }
  };

  const handleImport = async () => {
    if (!trip) return;
    try {
      setImporting(true);
      await importTrip(trip.tripId);
      Alert.alert('완료', '내 일정에 저장했어요.');
    } catch (e: any) {
      Alert.alert('실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setImporting(false);
    }
  };

  if (type === 'review') {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScreenHeader title="여행 후기" onBack={onBack} />
        {reviewLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : !review ? (
          <View style={s.content}>
            <Text style={s.body}>존재하지 않는 리뷰입니다.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={s.content}>
            <View style={s.authorRow}>
              <View style={s.avatar}>
                <Text style={s.avatarIcon}>🧑</Text>
              </View>
              <View>
                <Text style={s.author}>{review.nickName}</Text>
                <Text style={s.time}>{formatDate(review.createDate)}</Text>
              </View>
            </View>
            <Text style={s.title}>
              📍 {review.cityName || review.countryName}
            </Text>
            <Text style={s.title}>{stars(review.rating)}</Text>
            <Text style={s.title}>{review.title}</Text>
            <Text style={s.body}>{review.content}</Text>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  if (type === 'route') {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScreenHeader title="경로/일정 공유" onBack={onBack} />
        {tripLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : !trip ? (
          <View style={s.content}>
            <Text style={s.body}>존재하지 않는 일정입니다.</Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={s.content}>
              <View style={s.authorRow}>
                <View style={s.avatar}>
                  <Text style={s.avatarIcon}>🧑</Text>
                </View>
                <View>
                  <Text style={s.author}>{trip.nickName}</Text>
                  <Text style={s.time}>{formatDate(trip.createDate)}</Text>
                </View>
              </View>
              <Text style={s.title}>
                📍 {trip.cityName || trip.countryName}
              </Text>
              <Text style={s.title}>{trip.title}</Text>
              {!!trip.content && <Text style={s.body}>{trip.content}</Text>}
              {Array.from(new Set(trip.places.map(p => p.dayNumber))).map(
                day => (
                  <View key={day}>
                    <Text style={s.commentsTitle}>Day {day}</Text>
                    {trip.places
                      .filter(p => p.dayNumber === day)
                      .map(p => (
                        <Text key={p.tripPlaceId} style={s.cText}>
                          · {p.placeName}
                          {p.placeSub ? ` (${p.placeSub})` : ''}
                        </Text>
                      ))}
                  </View>
                ),
              )}
            </ScrollView>
            <SafeAreaView edges={['bottom']}>
              <View style={s.inputBar}>
                <TouchableOpacity
                  style={s.submitBtn}
                  activeOpacity={0.85}
                  onPress={handleImport}
                  disabled={importing}
                >
                  {importing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={s.submitText}>내 일정으로 가져오기</Text>
                  )}
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    );
  }

  // 자유게시판
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="자유게시판" onBack={onBack} />
      {boardLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : !board ? (
        <View style={s.content}>
          <Text style={s.body}>존재하지 않는 게시글입니다.</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.authorRow}>
              <View style={s.avatar}>
                <Text style={s.avatarIcon}>🧑</Text>
              </View>
              <View>
                <Text style={s.author}>{board.nickName}</Text>
                <Text style={s.time}>{formatDate(board.createDate)}</Text>
              </View>
            </View>
            <Text style={s.title}>{board.title}</Text>
            <Text style={s.body}>{board.content}</Text>
            <View style={s.metaRow}>
              <Text style={s.meta}>♥ {board.likeCount}</Text>
              <Text style={s.meta}>💬 {comments.length}</Text>
            </View>
            <Text style={s.commentsTitle}>댓글 {comments.length}</Text>
            {comments.map(c => (
              <CommentItem key={c.commentId} c={c} />
            ))}
          </ScrollView>
          <SafeAreaView edges={['bottom']}>
            <View style={s.inputBar}>
              <TextInput
                style={s.input}
                placeholder="댓글을 입력하세요..."
                placeholderTextColor="#aab4be"
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={s.submitBtn}
                activeOpacity={0.85}
                onPress={submitComment}
                disabled={posting}
              >
                {posting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.submitText}>등록</Text>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default PostDetailView;
