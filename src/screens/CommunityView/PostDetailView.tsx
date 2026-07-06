import React, { useCallback, useEffect, useState } from 'react';
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
  Image,
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
  getBoardComments,
  createBoardComment,
  getReviewComments,
  createReviewComment,
  getTripComments,
  createTripComment,
  updateComment,
  deleteComment,
  deleteBoard,
  deleteReview,
  toggleLike,
  ReviewDto,
  BoardDto,
  CommentDto,
} from '../../api/community';
import { TripDto, deleteTrip } from '../../api/trip';
import { toImageUrl } from '../../api/image';
import { getCurrentUserId } from '../../api/tokenStorage';

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

const ImageRow: React.FC<{ images: string[] }> = ({ images }) => {
  if (images.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 12 }}
    >
      {images.map((url, i) => (
        <Image
          key={i}
          source={{ uri: toImageUrl(url) }}
          style={{
            width: 140,
            height: 140,
            borderRadius: 12,
            marginRight: 8,
            backgroundColor: '#eee',
          }}
        />
      ))}
    </ScrollView>
  );
};

interface CommentItemProps {
  c: CommentDto;
  reply?: boolean;
  isMine: boolean;
  isPostOwner: boolean;
  isEditing: boolean;
  editingText: string;
  onEditingTextChange: (text: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                   c,
                                                   reply,
                                                   isMine,
                                                   isPostOwner,
                                                   isEditing,
                                                   editingText,
                                                   onEditingTextChange,
                                                   onStartEdit,
                                                   onCancelEdit,
                                                   onSaveEdit,
                                                   onDelete,
                                                   onReply,
                                                 }) => (
  <View style={[s.comment, reply && s.reply]}>
    <View style={s.cHead}>
      <View style={s.cAvatar}>
        <Text style={s.cAvatarIcon}>🧑</Text>
      </View>
      <Text style={s.cAuthor}>{c.nickName}</Text>
      <Text style={s.cTime}>{formatDate(c.createDate)}</Text>
    </View>
    {isEditing ? (
      <View style={{ marginLeft: 32 }}>
        <TextInput
          style={s.input}
          value={editingText}
          onChangeText={onEditingTextChange}
          multiline
        />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
          <TouchableOpacity onPress={onSaveEdit}>
            <Text style={s.meta}>저장</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancelEdit}>
            <Text style={s.meta}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <>
        <Text style={s.cText}>{c.content}</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginLeft: 32 }}>
          {!reply && (
            <TouchableOpacity onPress={onReply}>
              <Text style={s.cTime}>답글</Text>
            </TouchableOpacity>
          )}
          {isMine && (
            <TouchableOpacity onPress={onStartEdit}>
              <Text style={s.cTime}>수정</Text>
            </TouchableOpacity>
          )}
          {(isMine || isPostOwner) && (
            <TouchableOpacity onPress={onDelete}>
              <Text style={s.cTime}>삭제</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    )}
  </View>
);

interface CommentSectionProps {
  comments: CommentDto[];
  currentUserId: string | null;
  isPostOwner: boolean;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  replyTarget: number | null;
  onSetReplyTarget: (id: number | null) => void;
  editingCommentId: number | null;
  editingText: string;
  onEditingTextChange: (text: string) => void;
  onStartEdit: (id: number, content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: number) => void;
  onSubmit: () => void;
  posting: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({
                                                         comments,
                                                         currentUserId,
                                                         isPostOwner,
                                                         commentText,
                                                         onCommentTextChange,
                                                         replyTarget,
                                                         onSetReplyTarget,
                                                         editingCommentId,
                                                         editingText,
                                                         onEditingTextChange,
                                                         onStartEdit,
                                                         onCancelEdit,
                                                         onSaveEdit,
                                                         onDelete,
                                                         onSubmit,
                                                         posting,
                                                       }) => {
  const topLevel = comments.filter(c => !c.parentCommentId);

  return (
    <>
      <Text style={s.commentsTitle}>댓글 {comments.length}</Text>
      {topLevel.map(top => {
        const replies = comments.filter(
          c => c.parentCommentId === top.commentId,
        );
        return (
          <View key={top.commentId}>
            <CommentItem
              c={top}
              isMine={currentUserId === top.userId}
              isPostOwner={isPostOwner}
              isEditing={editingCommentId === top.commentId}
              editingText={editingText}
              onEditingTextChange={onEditingTextChange}
              onStartEdit={() => onStartEdit(top.commentId, top.content)}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onDelete={() => onDelete(top.commentId)}
              onReply={() => onSetReplyTarget(top.commentId)}
            />
            {replies.map(r => (
              <CommentItem
                key={r.commentId}
                c={r}
                reply
                isMine={currentUserId === r.userId}
                isPostOwner={isPostOwner}
                isEditing={editingCommentId === r.commentId}
                editingText={editingText}
                onEditingTextChange={onEditingTextChange}
                onStartEdit={() => onStartEdit(r.commentId, r.content)}
                onCancelEdit={onCancelEdit}
                onSaveEdit={onSaveEdit}
                onDelete={() => onDelete(r.commentId)}
                onReply={() => {}}
              />
            ))}
          </View>
        );
      })}
      {replyTarget != null && (
        <View style={{ paddingTop: 6 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={s.cTime}>답글 작성 중</Text>
            <TouchableOpacity onPress={() => onSetReplyTarget(null)}>
              <Text style={s.cTime}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={[s.inputBar, { marginTop: 8, borderTopWidth: 0 }]}>
        <TextInput
          style={s.input}
          placeholder={
            replyTarget != null
              ? '답글을 입력하세요...'
              : '댓글을 입력하세요...'
          }
          placeholderTextColor="#aab4be"
          value={commentText}
          onChangeText={onCommentTextChange}
        />
        <TouchableOpacity
          style={s.submitBtn}
          activeOpacity={0.85}
          onPress={onSubmit}
          disabled={posting}
        >
          {posting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.submitText}>등록</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

interface Props {
  id?: string;
  type?: PostType;
  onBack?: () => void;
  onEdit?: (type: PostType, id: string) => void;
}

const PostDetailView: React.FC<Props> = ({
                                           id,
                                           type = 'free',
                                           onBack,
                                           onEdit,
                                         }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [board, setBoard] = useState<BoardDto | null>(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardComments, setBoardComments] = useState<CommentDto[]>([]);

  const [review, setReview] = useState<ReviewDto | null>(null);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewComments, setReviewComments] = useState<CommentDto[]>([]);

  const [trip, setTrip] = useState<TripDto | null>(null);
  const [tripLoading, setTripLoading] = useState(true);
  const [tripComments, setTripComments] = useState<CommentDto[]>([]);
  const [importing, setImporting] = useState(false);
  const [deletingTrip, setDeletingTrip] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(
    null,
  );
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    getCurrentUserId().then(setCurrentUserId);
  }, []);

  const loadBoard = useCallback(async () => {
    if (!id) return;
    try {
      setBoardLoading(true);
      const [b, c] = await Promise.all([
        getBoard(Number(id)),
        getBoardComments(Number(id)),
      ]);
      setBoard(b);
      setBoardComments(c);
    } catch {
      setBoard(null);
    } finally {
      setBoardLoading(false);
    }
  }, [id]);

  const loadReview = useCallback(async () => {
    if (!id) return;
    try {
      setReviewLoading(true);
      const [r, c] = await Promise.all([
        getReview(Number(id)),
        getReviewComments(Number(id)),
      ]);
      setReview(r);
      setReviewComments(c);
    } catch {
      setReview(null);
    } finally {
      setReviewLoading(false);
    }
  }, [id]);

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      setTripLoading(true);
      const [t, c] = await Promise.all([
        getSharedTripDetail(Number(id)),
        getTripComments(Number(id)),
      ]);
      setTrip(t);
      setTripComments(c);
    } catch {
      setTrip(null);
    } finally {
      setTripLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setCommentText('');
      setReplyTarget(null);
      setEditingCommentId(null);
      if (type === 'free') {
        loadBoard();
      }
      if (type === 'review') {
        loadReview();
      }
      if (type === 'route') {
        loadTrip();
      }
    }, [type, loadBoard, loadReview, loadTrip]),
  );

  const submitBoardComment = async () => {
    if (!commentText.trim() || !id) return;
    try {
      setPosting(true);
      await createBoardComment(Number(id), {
        content: commentText.trim(),
        parentCommentId: replyTarget ?? undefined,
      });
      setCommentText('');
      setReplyTarget(null);
      setBoardComments(await getBoardComments(Number(id)));
    } catch (e: any) {
      Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setPosting(false);
    }
  };

  const submitReviewComment = async () => {
    if (!commentText.trim() || !id) return;
    try {
      setPosting(true);
      await createReviewComment(Number(id), {
        content: commentText.trim(),
        parentCommentId: replyTarget ?? undefined,
      });
      setCommentText('');
      setReplyTarget(null);
      setReviewComments(await getReviewComments(Number(id)));
    } catch (e: any) {
      Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setPosting(false);
    }
  };

  const submitTripComment = async () => {
    if (!commentText.trim() || !id) return;
    try {
      setPosting(true);
      await createTripComment(Number(id), {
        content: commentText.trim(),
        parentCommentId: replyTarget ?? undefined,
      });
      setCommentText('');
      setReplyTarget(null);
      setTripComments(await getTripComments(Number(id)));
    } catch (e: any) {
      Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = (
    commentId: number,
    kind: 'free' | 'review' | 'route',
  ) => {
    Alert.alert('댓글 삭제', '이 댓글을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(commentId);
            if (!id) return;
            if (kind === 'free')
              setBoardComments(await getBoardComments(Number(id)));
            else if (kind === 'review')
              setReviewComments(await getReviewComments(Number(id)));
            else setTripComments(await getTripComments(Number(id)));
          } catch (e: any) {
            Alert.alert(
              '삭제 실패',
              e?.message ?? '잠시 후 다시 시도해주세요.',
            );
          }
        },
      },
    ]);
  };

  const handleSaveCommentEdit = async (kind: 'free' | 'review' | 'route') => {
    if (editingCommentId == null || !editingText.trim() || !id) return;
    try {
      await updateComment(editingCommentId, { content: editingText.trim() });
      setEditingCommentId(null);
      setEditingText('');
      if (kind === 'free') setBoardComments(await getBoardComments(Number(id)));
      else if (kind === 'review')
        setReviewComments(await getReviewComments(Number(id)));
      else setTripComments(await getTripComments(Number(id)));
    } catch (e: any) {
      Alert.alert('수정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
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

  const handleDeleteTrip = () => {
    if (!trip) return;
    Alert.alert('일정 삭제', '삭제하면 되돌릴 수 없어요. 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeletingTrip(true);
            await deleteTrip(trip.tripId);
            onBack?.();
          } catch (e: any) {
            Alert.alert(
              '삭제 실패',
              e?.message ?? '잠시 후 다시 시도해주세요.',
            );
          } finally {
            setDeletingTrip(false);
          }
        },
      },
    ]);
  };

  const handleLikeReview = async () => {
    if (!review) return;
    const prev = review;
    setReview({
      ...review,
      liked: !review.liked,
      likeCount: review.likeCount + (review.liked ? -1 : 1),
    });
    try {
      const result = await toggleLike('REVIEW', review.reviewId);
      setReview(r => (r ? { ...r, ...result } : r));
    } catch {
      setReview(prev);
    }
  };

  const handleLikeTrip = async () => {
    if (!trip) return;
    const prev = trip;
    setTrip({
      ...trip,
      liked: !trip.liked,
      likeCount: trip.likeCount + (trip.liked ? -1 : 1),
    });
    try {
      const result = await toggleLike('TRIP', trip.tripId);
      setTrip(t => (t ? { ...t, ...result } : t));
    } catch {
      setTrip(prev);
    }
  };

  const handleLikeBoard = async () => {
    if (!board) return;
    const prev = board;
    setBoard({
      ...board,
      liked: !board.liked,
      likeCount: board.likeCount + (board.liked ? -1 : 1),
    });
    try {
      const result = await toggleLike('BOARD', board.boardId);
      setBoard(b => (b ? { ...b, ...result } : b));
    } catch {
      setBoard(prev);
    }
  };

  const handleDeletePost = (kind: 'review' | 'free', postId: number) => {
    Alert.alert('삭제', '삭제하면 되돌릴 수 없어요. 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            if (kind === 'review') await deleteReview(postId);
            else await deleteBoard(postId);
            onBack?.();
          } catch (e: any) {
            Alert.alert(
              '삭제 실패',
              e?.message ?? '잠시 후 다시 시도해주세요.',
            );
          }
        },
      },
    ]);
  };

  if (type === 'review') {
    const isMine = !!review && currentUserId === review.userId;
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
              <ImageRow images={review.images} />
              <View style={s.metaRow}>
                <TouchableOpacity onPress={handleLikeReview}>
                  <Text style={s.meta}>
                    {review.liked ? '❤️' : '🤍'} {review.likeCount}
                  </Text>
                </TouchableOpacity>
                <Text style={s.meta}>💬 {reviewComments.length}</Text>
                {isMine && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        onEdit?.('review', String(review.reviewId))
                      }
                    >
                      <Text style={s.meta}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleDeletePost('review', review.reviewId)
                      }
                    >
                      <Text style={s.meta}>삭제</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <CommentSection
                comments={reviewComments}
                currentUserId={currentUserId}
                isPostOwner={isMine}
                commentText={commentText}
                onCommentTextChange={setCommentText}
                replyTarget={replyTarget}
                onSetReplyTarget={setReplyTarget}
                editingCommentId={editingCommentId}
                editingText={editingText}
                onEditingTextChange={setEditingText}
                onStartEdit={(cid, content) => {
                  setEditingCommentId(cid);
                  setEditingText(content);
                }}
                onCancelEdit={() => setEditingCommentId(null)}
                onSaveEdit={() => handleSaveCommentEdit('review')}
                onDelete={cid => handleDeleteComment(cid, 'review')}
                onSubmit={submitReviewComment}
                posting={posting}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    );
  }

  if (type === 'route') {
    const isMine = !!trip && currentUserId === trip.userId;
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
                    <Text style={s.author}>{trip.nickName}</Text>
                    <Text style={s.time}>{formatDate(trip.createDate)}</Text>
                  </View>
                </View>
                <Text style={s.title}>
                  📍 {trip.cityName || trip.countryName}
                </Text>
                <Text style={s.title}>{trip.title}</Text>
                {!!trip.content && <Text style={s.body}>{trip.content}</Text>}
                <ImageRow images={trip.images} />
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
                <View style={s.metaRow}>
                  <TouchableOpacity onPress={handleLikeTrip}>
                    <Text style={s.meta}>
                      {trip.liked ? '❤️' : '🤍'} {trip.likeCount}
                    </Text>
                  </TouchableOpacity>
                  <Text style={s.meta}>💬 {tripComments.length}</Text>
                  {isMine && (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          onEdit?.('route', String(trip.tripId))
                        }
                      >
                        <Text style={s.meta}>수정</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleDeleteTrip}
                        disabled={deletingTrip}
                      >
                        <Text style={s.meta}>삭제</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <CommentSection
                  comments={tripComments}
                  currentUserId={currentUserId}
                  isPostOwner={isMine}
                  commentText={commentText}
                  onCommentTextChange={setCommentText}
                  replyTarget={replyTarget}
                  onSetReplyTarget={setReplyTarget}
                  editingCommentId={editingCommentId}
                  editingText={editingText}
                  onEditingTextChange={setEditingText}
                  onStartEdit={(cid, content) => {
                    setEditingCommentId(cid);
                    setEditingText(content);
                  }}
                  onCancelEdit={() => setEditingCommentId(null)}
                  onSaveEdit={() => handleSaveCommentEdit('route')}
                  onDelete={cid => handleDeleteComment(cid, 'route')}
                  onSubmit={submitTripComment}
                  posting={posting}
                />
              </ScrollView>
            </KeyboardAvoidingView>
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
  const isMineBoard = !!board && currentUserId === board.userId;
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
            <ImageRow images={board.images} />
            <View style={s.metaRow}>
              <TouchableOpacity onPress={handleLikeBoard}>
                <Text style={s.meta}>
                  {board.liked ? '❤️' : '🤍'} {board.likeCount}
                </Text>
              </TouchableOpacity>
              <Text style={s.meta}>💬 {boardComments.length}</Text>
              {isMineBoard && (
                <>
                  <TouchableOpacity
                    onPress={() => onEdit?.('free', String(board.boardId))}
                  >
                    <Text style={s.meta}>수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeletePost('free', board.boardId)}
                  >
                    <Text style={s.meta}>삭제</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <CommentSection
              comments={boardComments}
              currentUserId={currentUserId}
              isPostOwner={isMineBoard}
              commentText={commentText}
              onCommentTextChange={setCommentText}
              replyTarget={replyTarget}
              onSetReplyTarget={setReplyTarget}
              editingCommentId={editingCommentId}
              editingText={editingText}
              onEditingTextChange={setEditingText}
              onStartEdit={(cid, content) => {
                setEditingCommentId(cid);
                setEditingText(content);
              }}
              onCancelEdit={() => setEditingCommentId(null)}
              onSaveEdit={() => handleSaveCommentEdit('free')}
              onDelete={cid => handleDeleteComment(cid, 'free')}
              onSubmit={submitBoardComment}
              posting={posting}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default PostDetailView;