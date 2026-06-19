import { Fleet } from '@/types/fleet';

export const defaultRoleTemplates: Record<string, { name: string; gender: 'male' | 'female' | 'any' }[]> = {
  hardcore: [
    { name: '侦探', gender: 'any' },
    { name: '警察', gender: 'male' },
    { name: '医生', gender: 'any' },
    { name: '教师', gender: 'female' },
    { name: '商人', gender: 'male' },
    { name: '学生', gender: 'any' }
  ],
  emotion: [
    { name: '男主A', gender: 'male' },
    { name: '女主A', gender: 'female' },
    { name: '男主B', gender: 'male' },
    { name: '女主B', gender: 'female' },
    { name: '男主C', gender: 'male' },
    { name: '女主C', gender: 'female' }
  ],
  fun: [
    { name: '老板', gender: 'any' },
    { name: '员工A', gender: 'male' },
    { name: '员工B', gender: 'female' },
    { name: '员工C', gender: 'any' },
    { name: '员工D', gender: 'male' },
    { name: '员工E', gender: 'female' }
  ],
  terror: [
    { name: '班长', gender: 'any' },
    { name: '校花', gender: 'female' },
    { name: '校草', gender: 'male' },
    { name: '转学生', gender: 'any' },
    { name: '老师', gender: 'female' },
    { name: '保安', gender: 'male' },
    { name: '清洁阿姨', gender: 'female' }
  ],
  mechanism: [
    { name: '主公', gender: 'male' },
    { name: '军师', gender: 'any' },
    { name: '武将A', gender: 'male' },
    { name: '武将B', gender: 'male' },
    { name: '文臣', gender: 'any' },
    { name: '公主', gender: 'female' },
    { name: '刺客', gender: 'any' }
  ],
  other: [
    { name: '角色1', gender: 'any' },
    { name: '角色2', gender: 'any' },
    { name: '角色3', gender: 'any' },
    { name: '角色4', gender: 'any' },
    { name: '角色5', gender: 'any' },
    { name: '角色6', gender: 'any' }
  ]
};

export const mockFleets: Fleet[] = [
  {
    id: '1',
    title: '【独家首发】《雾鸦馆》硬核推理',
    scriptName: '雾鸦馆',
    city: '上海',
    store: '谜局剧场·徐汇店',
    date: '2025-06-25',
    time: '14:00',
    priceMin: 228,
    priceMax: 268,
    totalPlayers: 6,
    neededPlayers: 2,
    scriptType: 'hardcore',
    typeLabel: '硬核推理',
    difficulty: '烧脑地狱',
    tags: ['硬核推理', '密室', '独家本'],
    description: '本格推理神作，三重密室挑战你的智商极限。需要硬核玩家，新手勿扰。',
    initiator: {
      id: 'u1',
      name: '推理狂人',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    initiatorId: 'u1',
    members: [
      { id: 'm1-1', userId: 'u1', name: '推理狂人', avatar: 'https://picsum.photos/id/64/200/200', status: 'confirmed', gender: 'male', rolePreference: '张官生', joinTime: '1750377000000', confirmed: true, assignedRoleId: 'r1-1' },
      { id: 'm1-2', userId: 'u2', name: '小樱花', avatar: 'https://picsum.photos/id/91/200/200', status: 'confirmed', gender: 'female', rolePreference: '周小小', availableTime: '14:00准时到', joinTime: '1750378800000', confirmed: true, assignedRoleId: 'r1-2', canCrossPlay: false, hasReadSeries: false },
      { id: 'm1-3', userId: 'u3', name: '剧本杀老炮', avatar: 'https://picsum.photos/id/177/200/200', status: 'pending', gender: 'male', rolePreference: '白望海', availableTime: '13:50到', joinTime: '1750384200000', confirmed: false, canCrossPlay: true, hasReadSeries: true },
      { id: 'm1-4', userId: 'u4', name: '柯南迷', avatar: 'https://picsum.photos/id/338/200/200', status: 'waitlist', gender: 'female', rolePreference: '齐小凤', availableTime: '14:10前到', joinTime: '1750386000000', confirmed: false, canCrossPlay: false, hasReadSeries: false }
    ],
    roleSlots: [
      { id: 'r1-1', name: '张官生', gender: 'male', description: '30岁，斯文儒雅的大学教授' },
      { id: 'r1-2', name: '周小小', gender: 'female', description: '25岁，活泼开朗的插画师' },
      { id: 'r1-3', name: '白望海', gender: 'male', description: '40岁，事业有成的企业家' },
      { id: 'r1-4', name: '齐小凤', gender: 'female', description: '28岁，冷静理性的律师' },
      { id: 'r1-5', name: '陈思源', gender: 'male', description: '35岁，神秘的自由职业者' },
      { id: 'r1-6', name: '林梦婷', gender: 'female', description: '22岁，刚毕业的大学生' }
    ],
    roleAssignments: [
      { roleId: 'r1-1', memberId: 'u1', status: 'confirmed' },
      { roleId: 'r1-2', memberId: 'u2', status: 'confirmed' }
    ],
    status: 'recruiting',
    isExclusive: true,
    isFirstPlay: true,
    createdAt: '2025-06-20 10:30'
  },
  {
    id: '2',
    title: '【城限】《告别诗》情感哭哭本',
    scriptName: '告别诗',
    city: '北京',
    store: '剧满楼·国贸店',
    date: '2025-06-28',
    time: '19:30',
    priceMin: 188,
    priceMax: 188,
    totalPlayers: 6,
    neededPlayers: 3,
    scriptType: 'emotion',
    typeLabel: '情感沉浸',
    difficulty: '纸巾杀手',
    tags: ['情感沉浸', '校园', '城限本'],
    description: '青春校园情感本，需要能代入的玩家。男生缺口2位，女生缺口1位。',
    initiator: {
      id: 'u5',
      name: '爱哭的小鱼',
      avatar: 'https://picsum.photos/id/237/200/200'
    },
    initiatorId: 'u5',
    members: [
      { id: 'm2-1', userId: 'u5', name: '爱哭的小鱼', avatar: 'https://picsum.photos/id/237/200/200', status: 'confirmed', gender: 'female', rolePreference: '苏橙', joinTime: '1750394400000', confirmed: true, assignedRoleId: 'r2-1' },
      { id: 'm2-2', userId: 'u6', name: '云舒', avatar: 'https://picsum.photos/id/659/200/200', status: 'confirmed', gender: 'female', rolePreference: '楚云歌', availableTime: '19:20到', joinTime: '1750395600000', confirmed: true, assignedRoleId: 'r2-2', canCrossPlay: false, hasReadSeries: false },
      { id: 'm2-3', userId: 'u7', name: '星辰', avatar: 'https://picsum.photos/id/718/200/200', status: 'confirmed', gender: 'male', rolePreference: '陆泽远', availableTime: '19:30准时', joinTime: '1750396800000', confirmed: true, assignedRoleId: 'r2-3', canCrossPlay: false, hasReadSeries: true }
    ],
    roleSlots: [
      { id: 'r2-1', name: '苏橙', gender: 'female', description: '校花，性格开朗' },
      { id: 'r2-2', name: '楚云歌', gender: 'female', description: '文艺委员，温柔内向' },
      { id: 'r2-3', name: '陆泽远', gender: 'male', description: '学霸，阳光帅气' },
      { id: 'r2-4', name: '顾言', gender: 'male', description: '转学生，沉默寡言' },
      { id: 'r2-5', name: '林星落', gender: 'female', description: '班长，认真负责' },
      { id: 'r2-6', name: '余心乐', gender: 'male', description: '体育生，热情仗义' }
    ],
    roleAssignments: [
      { roleId: 'r2-1', memberId: 'u5', status: 'confirmed' },
      { roleId: 'r2-2', memberId: 'u6', status: 'confirmed' },
      { roleId: 'r2-3', memberId: 'u7', status: 'confirmed' }
    ],
    status: 'recruiting',
    isExclusive: false,
    isFirstPlay: false,
    createdAt: '2025-06-19 15:20'
  },
  {
    id: '3',
    title: '【欢乐机制】《搞钱》团建首选',
    scriptName: '搞钱',
    city: '深圳',
    store: '欢乐剧本杀·福田店',
    date: '2025-06-26',
    time: '15:00',
    priceMin: 158,
    priceMax: 198,
    totalPlayers: 10,
    neededPlayers: 3,
    scriptType: 'fun',
    typeLabel: '欢乐机制',
    difficulty: '新手友好',
    tags: ['欢乐机制', '阵营', '团建推荐'],
    description: '超级欢乐的机制阵营本，适合团建。差3人即可发车！',
    initiator: {
      id: 'u8',
      name: '搞钱大王',
      avatar: 'https://picsum.photos/id/783/200/200'
    },
    initiatorId: 'u8',
    members: [
      { id: 'm3-1', userId: 'u8', name: '搞钱大王', avatar: 'https://picsum.photos/id/783/200/200', status: 'confirmed', gender: 'male', rolePreference: '齐梅', joinTime: '1750286100000', confirmed: true, assignedRoleId: 'r3-1' },
      { id: 'm3-2', userId: 'u9', name: '小太阳', avatar: 'https://picsum.photos/id/1025/200/200', status: 'confirmed', gender: 'female', rolePreference: '白如镜', availableTime: '14:50到', joinTime: '1750287000000', confirmed: false, assignedRoleId: 'r3-2', canCrossPlay: true, hasReadSeries: false },
      { id: 'm3-3', userId: 'u10', name: '乐翻天', avatar: 'https://picsum.photos/id/1027/200/200', status: 'confirmed', gender: 'male', rolePreference: '董建国', availableTime: '15:00准时', joinTime: '1750288800000', confirmed: false, assignedRoleId: 'r3-3', canCrossPlay: false, hasReadSeries: false },
      { id: 'm3-4', userId: 'u11', name: '奶茶控', avatar: 'https://picsum.photos/id/1035/200/200', status: 'confirmed', gender: 'female', rolePreference: '李民俊', availableTime: '14:55到', joinTime: '1750290000000', confirmed: true, assignedRoleId: 'r3-4', canCrossPlay: false, hasReadSeries: true },
      { id: 'm3-5', userId: 'u12', name: '笑笑', avatar: 'https://picsum.photos/id/1038/200/200', status: 'pending', gender: 'female', rolePreference: '林笑', availableTime: '可能晚10分钟', joinTime: '1750292400000', confirmed: false, canCrossPlay: false, hasReadSeries: false },
      { id: 'm3-6', userId: 'u13', name: '阿杰', avatar: 'https://picsum.photos/id/1036/200/200', status: 'waitlist', gender: 'male', joinTime: '1750294200000', confirmed: false },
      { id: 'm3-7', userId: 'u14', name: '小凡', avatar: 'https://picsum.photos/id/1039/200/200', status: 'waitlist', gender: 'male', joinTime: '1750296000000', confirmed: false }
    ],
    roleSlots: [
      { id: 'r3-1', name: '齐梅', gender: 'female', description: '40岁，贵妇人' },
      { id: 'r3-2', name: '白如镜', gender: 'any', description: '35岁，金牌律师' },
      { id: 'r3-3', name: '董建国', gender: 'male', description: '55岁，退休干部' },
      { id: 'r3-4', name: '李民俊', gender: 'male', description: '28岁，流量明星' },
      { id: 'r3-5', name: '林笑', gender: 'female', description: '26岁，医疗代表' },
      { id: 'r3-6', name: '贾仁君', gender: 'male', description: '30岁，程序员' },
      { id: 'r3-7', name: '赵行远', gender: 'male', description: '45岁，包工头' },
      { id: 'r3-8', name: '郑义', gender: 'male', description: '50岁，黑道大哥' },
      { id: 'r3-9', name: '沈仪', gender: 'female', description: '24岁，青春少女' },
      { id: 'r3-10', name: '关洁', gender: 'female', description: '28岁，职场丽人' }
    ],
    roleAssignments: [
      { roleId: 'r3-1', memberId: 'u8', status: 'confirmed' },
      { roleId: 'r3-2', memberId: 'u9', status: 'confirmed' },
      { roleId: 'r3-3', memberId: 'u10', status: 'confirmed' },
      { roleId: 'r3-4', memberId: 'u11', status: 'confirmed' }
    ],
    status: 'recruiting',
    isExclusive: false,
    isFirstPlay: false,
    createdAt: '2025-06-18 09:15'
  },
  {
    id: '4',
    title: '【城限首发】《无间囚笼》硬核本格',
    scriptName: '无间囚笼',
    city: '广州',
    store: '推理社·天河店',
    date: '2025-07-01',
    time: '13:00',
    priceMin: 258,
    priceMax: 298,
    totalPlayers: 6,
    neededPlayers: 4,
    scriptType: 'hardcore',
    typeLabel: '硬核推理',
    difficulty: '硬核资深',
    tags: ['硬核推理', '城限首发', '本格', '刑侦'],
    description: '城限首发本，硬核刑侦推理。需要资深硬核玩家，时长7-8小时。',
    initiator: {
      id: 'u15',
      name: '推理机器',
      avatar: 'https://picsum.photos/id/1038/200/200'
    },
    initiatorId: 'u15',
    members: [
      { id: 'm4-1', userId: 'u15', name: '推理机器', avatar: 'https://picsum.photos/id/1038/200/200', status: 'confirmed', gender: 'male', joinTime: '1750551600000', confirmed: true, assignedRoleId: 'r4-1' },
      { id: 'm4-2', userId: 'u16', name: '真相只有一个', avatar: 'https://picsum.photos/id/1044/200/200', status: 'confirmed', gender: 'female', availableTime: '12:50到', joinTime: '1750552800000', confirmed: false, assignedRoleId: 'r4-2', canCrossPlay: true, hasReadSeries: false }
    ],
    roleSlots: [
      { id: 'r4-1', name: '刑警队长', gender: 'male' },
      { id: 'r4-2', name: '法医', gender: 'female' },
      { id: 'r4-3', name: '心理专家', gender: 'any' },
      { id: 'r4-4', name: '痕迹专家', gender: 'male' },
      { id: 'r4-5', name: '嫌疑人A', gender: 'any' },
      { id: 'r4-6', name: '嫌疑人B', gender: 'any' }
    ],
    roleAssignments: [
      { roleId: 'r4-1', memberId: 'u15', status: 'confirmed' },
      { roleId: 'r4-2', memberId: 'u16', status: 'confirmed' }
    ],
    status: 'recruiting',
    isExclusive: false,
    isFirstPlay: true,
    createdAt: '2025-06-21 11:00'
  },
  {
    id: '5',
    title: '【独家】《七月的少年》情感沉浸',
    scriptName: '七月的少年',
    city: '成都',
    store: '此间剧场·春熙路店',
    date: '2025-06-30',
    time: '14:30',
    priceMin: 268,
    priceMax: 308,
    totalPlayers: 6,
    neededPlayers: 1,
    scriptType: 'emotion',
    typeLabel: '情感沉浸',
    difficulty: '哭哭本',
    tags: ['情感沉浸', '独家本', '治愈'],
    description: '超治愈的情感独家本，差1位女生，不接受反串。',
    initiator: {
      id: 'u17',
      name: '温暖阳光',
      avatar: 'https://picsum.photos/id/225/200/200'
    },
    initiatorId: 'u17',
    members: [
      { id: 'm5-1', userId: 'u17', name: '温暖阳光', avatar: 'https://picsum.photos/id/225/200/200', status: 'confirmed', gender: 'male', joinTime: '1750476300000', confirmed: true, assignedRoleId: 'r5-1' },
      { id: 'm5-2', userId: 'u18', name: '月野兔', avatar: 'https://picsum.photos/id/230/200/200', status: 'confirmed', gender: 'female', availableTime: '14:20到', joinTime: '1750477200000', confirmed: true, assignedRoleId: 'r5-2', canCrossPlay: false, hasReadSeries: true },
      { id: 'm5-3', userId: 'u19', name: '清风徐来', avatar: 'https://picsum.photos/id/250/200/200', status: 'confirmed', gender: 'male', availableTime: '14:30准时', joinTime: '1750478400000', confirmed: false, assignedRoleId: 'r5-3', canCrossPlay: false, hasReadSeries: false },
      { id: 'm5-4', userId: 'u20', name: '小确幸', avatar: 'https://picsum.photos/id/582/200/200', status: 'confirmed', gender: 'female', availableTime: '14:25到', joinTime: '1750479600000', confirmed: true, assignedRoleId: 'r5-4', canCrossPlay: false, hasReadSeries: false },
      { id: 'm5-5', userId: 'u21', name: '星河', avatar: 'https://picsum.photos/id/598/200/200', status: 'pending', gender: 'female', availableTime: '可能晚到5分钟', joinTime: '1750480800000', confirmed: false, canCrossPlay: false, hasReadSeries: false }
    ],
    roleSlots: [
      { id: 'r5-1', name: '少年A', gender: 'male' },
      { id: 'r5-2', name: '少女A', gender: 'female' },
      { id: 'r5-3', name: '少年B', gender: 'male' },
      { id: 'r5-4', name: '少女B', gender: 'female' },
      { id: 'r5-5', name: '少年C', gender: 'male' },
      { id: 'r5-6', name: '少女C', gender: 'female' }
    ],
    roleAssignments: [
      { roleId: 'r5-1', memberId: 'u17', status: 'confirmed' },
      { roleId: 'r5-2', memberId: 'u18', status: 'confirmed' },
      { roleId: 'r5-3', memberId: 'u19', status: 'confirmed' },
      { roleId: 'r5-4', memberId: 'u20', status: 'confirmed' }
    ],
    status: 'recruiting',
    isExclusive: true,
    isFirstPlay: false,
    createdAt: '2025-06-20 16:45'
  }
];

export const cities = ['全部城市', '上海', '北京', '深圳', '广州', '成都', '重庆', '杭州', '南京', '武汉', '西安'];

export const scriptTypeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'hardcore', label: '硬核推理' },
  { value: 'emotion', label: '情感沉浸' },
  { value: 'fun', label: '欢乐机制' },
  { value: 'terror', label: '恐怖惊悚' },
  { value: 'mechanism', label: '机制阵营' }
];

export const tagOptions = [
  '硬核推理', '情感沉浸', '欢乐机制', '恐怖惊悚', '机制阵营',
  '独家本', '城限本', '首发本', '本格', '变格', '密室',
  '校园', '古风', '刑侦', '治愈', '阵营', '新手友好'
];
