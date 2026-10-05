export const LEVEL_CONFIG = [
  { level: 1, title: '🌱 싹트기', minExp: 0, maxExp: 499 },
  { level: 2, title: '🌿 싹틔우기', minExp: 500, maxExp: 999 },
  { level: 3, title: '🪴 모종 단계', minExp: 1000, maxExp: 1799 },
  { level: 4, title: '🌳 푸른 나무', minExp: 1800, maxExp: 2799 },
  { level: 5, title: '🌸 꽃봉오리', minExp: 2800, maxExp: 3999 },
  { level: 6, title: '🌺 만개한 꽃', minExp: 4000, maxExp: 5499 },
  { level: 7, title: '🌲 울창한 숲', minExp: 5500, maxExp: 7199 },
  { level: 8, title: '🍎 열매 나무', minExp: 7200, maxExp: 9199 },
  { level: 9, title: '🛡️ 학급 수호자', minExp: 9200, maxExp: 11499 },
  { level: 10, title: '👑 별빛 마스터', minExp: 11500, maxExp: 999999 }
];

export function getLevelInfo(exp = 0) {
  let currentLevel = LEVEL_CONFIG[0];
  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_CONFIG[i].minExp) {
      currentLevel = LEVEL_CONFIG[i];
      break;
    }
  }

  const nextLevel = LEVEL_CONFIG.find(l => l.level === currentLevel.level + 1) || currentLevel;
  const expInLevel = exp - currentLevel.minExp;
  const levelExpRange = (nextLevel.minExp - currentLevel.minExp) || 1;
  const progressPercent = currentLevel.level === 10 ? 100 : Math.min(100, Math.floor((expInLevel / levelExpRange) * 100));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentExp: exp,
    minExp: currentLevel.minExp,
    nextExp: nextLevel.minExp,
    progressPercent
  };
}

export const TEACHER_ACCOUNT = {
  username: 'teacher',
  password: '1234',
  name: '담임선생님'
};

export const INITIAL_ROLES = [
  { id: 'r1', name: '칠판 & 분필 관리자', description: '매 수업 후 칠판을 깨끗하게 지우고 지우개를 터는 역할', dailyReward: 50 },
  { id: 'r2', name: '우유 & 급식 도우미', description: '아침 우유 상자를 수거하고 점심시간 줄 세우기를 돕는 역할', dailyReward: 60 },
  { id: 'r3', name: '환기 & 에너지 파수꾼', description: '쉬는 시간 교실 창문 환기 및 전등·컴퓨터 전원을 관리하는 역할', dailyReward: 50 },
  { id: 'r4', name: '유인물 & 과제 전달자', description: '선생님 학습지를 나누어 주고 과제를 수거하여 전달하는 역할', dailyReward: 50 },
  { id: 'r5', name: '정보 & 컴퓨터 도우미', description: '수업용 TV 및 모둠 태블릿 PC 정리를 담당하는 역할', dailyReward: 50 },
  { id: 'r6', name: '식물 & 반려 화분 도우미', description: '학급 화분 및 공기정화 식물에 주기적으로 물을 주는 역할', dailyReward: 40 },
  { id: 'r7', name: '체육 & 이동 수업 도우미', description: '체육 도구 수거 및 이동 수업 시 교실 문을 잠그는 역할', dailyReward: 50 },
  { id: 'r8', name: '칭찬 우체부 & 청결 담당', description: '학급 칭찬 저금통 관리 및 신발장 주변 청결을 돕는 역할', dailyReward: 40 }
];

// 25명 학생 생성 - 이름 제거하고 번호만 사용 (star1 ~ star25)
export const INITIAL_STUDENTS = Array.from({ length: 25 }, (_, idx) => {
  const num = idx + 1;
  const roleIndex = idx % INITIAL_ROLES.length;
  return {
    id: num,
    name: `${num}번 학생`,
    username: `star${num}`,
    password: '1234',
    balance: 800 + (num * 30),
    exp: 500 + (num * 70),
    roleId: INITIAL_ROLES[roleIndex].id,
    completedTasks: []
  };
});

export const INITIAL_MISSIONS = [
  { id: 'm1', title: '📖 아침 독서 10분 몰입하기', rewardBalance: 50, rewardExp: 50 },
  { id: 'm2', title: '🧹 사물함 & 책상 주변 정돈하기', rewardBalance: 40, rewardExp: 40 },
  { id: 'm3', title: '🤝 친구에게 따뜻한 칭찬 한 마디 전하기', rewardBalance: 60, rewardExp: 60 },
  { id: 'm4', title: '📝 다음 시간 수업 준비물 미리 챙기기', rewardBalance: 50, rewardExp: 50 }
];

export const INITIAL_STORE_ITEMS = [
  { id: 's1', title: '🪑 원하는 자리 1일 지정권', category: 'coupon', price: 800, stock: 5, description: '하루 동안 내가 선택한 원하는 자리에 앉을 수 있는 스페셜 쿠폰' },
  { id: 's2', title: '🧹 청소 1회 자유 면제권', category: 'coupon', price: 1000, stock: 3, description: '주간 청소 당번에서 1회 면제받는 꿀 쿠폰' },
  { id: 's3', title: '📑 유인물 제일 먼저 제출권', category: 'coupon', price: 300, stock: 10, description: '학습지나 과제를 1등으로 제출하고 칭찬도 받는 쿠폰' },
  { id: 's4', title: '🙋‍♂️ 선생님 힌트 스페셜 찬스', category: 'coupon', price: 500, stock: 5, description: '어려운 퀴즈나 미션 해결 시 선생님의 결정적 힌트를 획득' },
  { id: 's5', title: '🍿 금요일 학급 영화 간식 쿠폰', category: 'coupon', price: 1200, stock: 15, description: '금요일 학급 영화 시청 시 맛있는 젤리/간식을 선택' },
  { id: 's6', title: '🎁 학급 문구 서프라이즈 선물', category: 'item', price: 600, stock: 8, description: '귀여운 볼펜, 캐릭터 메모지 등 학급 문구용품 세트' }
];

export const LOCAL_STORAGE_KEY = 'dream_class_app_data_v2';

export function getDefaultAppData() {
  return {
    students: INITIAL_STUDENTS,
    roles: INITIAL_ROLES,
    missions: INITIAL_MISSIONS,
    storeItems: INITIAL_STORE_ITEMS,
    purchases: [
      { id: 'p1', studentId: 1, itemId: 's1', itemTitle: '🪑 원하는 자리 1일 지정권', price: 800, purchasedAt: '2026-10-05', status: 'active' },
      { id: 'p2', studentId: 3, itemId: 's3', itemTitle: '📑 유인물 제일 먼저 제출권', price: 300, purchasedAt: '2026-10-05', status: 'used_pending' }
    ],
    logs: [
      { id: 'l1', studentId: 1, studentName: '1번 학생', amount: 100, expAmount: 100, reason: '1인 1역 완벽 수행 칭찬 보상', timestamp: '2026-10-05 09:30' },
      { id: 'l2', studentId: 3, studentName: '3번 학생', amount: 200, expAmount: 200, reason: '학급 수학 퀴즈왕 우승', timestamp: '2026-10-05 11:15' }
    ]
  };
}

export function loadAppData() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.students && parsed.students.length > 0) {
        // Ensure student names are "X번 학생"
        parsed.students = parsed.students.map((s) => ({
          ...s,
          name: `${s.id}번 학생`,
          username: s.username || `star${s.id}`,
          password: s.password || '1234'
        }));
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load local storage data:', e);
  }
  const defaultData = getDefaultAppData();
  saveAppData(defaultData);
  return defaultData;
}

export function saveAppData(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to local storage:', e);
  }
}
