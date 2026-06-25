import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../component/ScreenHeader';
import { postDetailStyles as s } from './PostDetailView.styles';

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  replies?: Comment[];
}

const POST = {
  author: '계획적인 탐험가',
  time: '15분 전',
  title: '부모님과 함께하는 교토 3박 4일 숙소 고민',
  body: '드디어 다음 달에 부모님을 모시고 교토 3박 4일 여행을 떠나게 되었습니다! 부모님께서 걷는 걸 조금 힘들어하셔서 최대한 교통이 편하고 깨끗한 숙소를 찾고 있어요. 가와라마치 쪽이 번화가라 좋을 것 같기도 하고, 교토역 근처가 이동하기 제일 편할 것 같아서 고민이 많네요. 혹시 부모님 모시고 가기 좋은 호텔이나 료칸 추천해 주실 수 있을까요?',
  likes: 128,
};

const INITIAL: Comment[] = [
  {
    id: 'c1',
    author: '교토마스터',
    time: '방금',
    text: '부모님 모시고 가신다면 무조건 교통이 편한 곳 추천드려요. 교토역 근처가 이동하기 편합니다.',
    replies: [
      {
        id: 'c1r1',
        author: '도쿄방랑자',
        time: '1분 전',
        text: '@교토마스터 맞아요. 가와라마치는 밤에 좀 시끄러울 수 있어요.',
      },
    ],
  },
  {
    id: 'c2',
    author: '료칸매니아',
    time: '5분 전',
    text: '부모님이 걷는 걸 힘들어하신다면 택시 이동도 고려해보세요. 교토는 버스가 잘 되어 있어요.',
    replies: [
      {
        id: 'c2r1',
        author: '여행꿈나무',
        time: '3분 전',
        text: '좋은 정보 감사합니다! 저도 다음 달에 가는데 고마웠어요.',
      },
    ],
  },
];

const CommentItem: React.FC<{ c: Comment; reply?: boolean }> = ({
  c,
  reply,
}) => (
  <View style={[s.comment, reply && s.reply]}>
    <View style={s.cHead}>
      <View style={s.cAvatar}>
        <Text style={s.cAvatarIcon}>🧑</Text>
      </View>
      <Text style={s.cAuthor}>{c.author}</Text>
      <Text style={s.cTime}>{c.time}</Text>
    </View>
    <Text style={s.cText}>{c.text}</Text>
    {c.replies?.map(r => (
      <CommentItem key={r.id} c={r} reply />
    ))}
  </View>
);

const PostDetailView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [comments, setComments] = useState(INITIAL);
  const [text, setText] = useState('');
  const submit = () => {
    if (!text.trim()) return;
    setComments(prev => [
      ...prev,
      { id: `n${Date.now()}`, author: '나', time: '방금', text: text.trim() },
    ]);
    setText('');
  };
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="자유게시판" onBack={onBack} />
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
              <Text style={s.author}>{POST.author}</Text>
              <Text style={s.time}>{POST.time}</Text>
            </View>
          </View>
          <Text style={s.title}>{POST.title}</Text>
          <Text style={s.body}>{POST.body}</Text>
          <View style={s.metaRow}>
            <Text style={s.meta}>♥ {POST.likes}</Text>
            <Text style={s.meta}>💬 {comments.length}</Text>
          </View>
          <Text style={s.commentsTitle}>댓글 {comments.length}</Text>
          {comments.map(c => (
            <CommentItem key={c.id} c={c} />
          ))}
        </ScrollView>
        <SafeAreaView edges={['bottom']}>
          <View style={s.inputBar}>
            <TextInput
              style={s.input}
              placeholder="댓글을 입력하세요..."
              placeholderTextColor="#aab4be"
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity
              style={s.submitBtn}
              activeOpacity={0.85}
              onPress={submit}
            >
              <Text style={s.submitText}>등록</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailView;
