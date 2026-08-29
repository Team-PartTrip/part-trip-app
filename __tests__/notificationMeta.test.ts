import { bucketOf } from '../src/pages/NotificationView/notificationMeta';

// 코드래빗이 잡은 것: 24시간을 재면 어제 밤 알림이 '오늘'로 들어간다.
// 달력 기준으로 나뉘는지만 본다.
describe('bucketOf', () => {
  const at = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();

  beforeAll(() => {
    // 자정 직후·직전을 테스트하려면 시각을 고정해야 한다. 낮 12시로 둔다.
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 29, 12, 0, 0));
  });
  afterAll(() => jest.useRealTimers());

  it('오늘 새벽 알림은 오늘이다', () => {
    expect(bucketOf(at(-11 * 3600_000))).toBe('오늘');
  });

  it('어제 밤 11시 알림은 오늘이 아니다', () => {
    // 13시간 전 = 어제 23시. 24시간 기준이면 여기서 틀렸다.
    expect(bucketOf(at(-13 * 3600_000))).toBe('이번 주');
  });

  it('일주일 넘은 알림은 이전이다', () => {
    expect(bucketOf(at(-8 * 86_400_000))).toBe('이전');
  });

  it('날짜가 아니면 이전으로 둔다', () => {
    expect(bucketOf('nope')).toBe('이전');
  });
});
