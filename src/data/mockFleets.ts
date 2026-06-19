import { Fleet } from '@/types/fleet';

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
    totalSlots: 6,
    filledSlots: 4,
    scriptType: 'hardcore',
    tags: ['硬核推理', '密室', '独家本'],
    description: '本格推理神作，三重密室挑战你的智商极限。需要硬核玩家，新手勿扰。',
    initiator: {
      id: 'u1',
      name: '推理狂人',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    members: [
      { id: 'u1', name: '推理狂人', avatar: 'https://picsum.photos/id/64/200/200', status: 'confirmed', gender: 'male', rolePreference: '张官生' },
      { id: 'u2', name: '小樱花', avatar: 'https://picsum.photos/id/91/200/200', status: 'confirmed', gender: 'female', rolePreference: '周小小' },
      { id: 'u3', name: '剧本杀老炮', avatar: 'https://picsum.photos/id/177/200/200', status: 'pending', gender: 'male', rolePreference: '白望海' },
      { id: 'u4', name: '柯南迷', avatar: 'https://picsum.photos/id/338/200/200', status: 'waitlist', gender: 'female', rolePreference: '齐小凤' }
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
    totalSlots: 6,
    filledSlots: 3,
    scriptType: 'emotion',
    tags: ['情感沉浸', '校园', '城限本'],
    description: '青春校园情感本，需要能代入的玩家。男生缺口2位，女生缺口1位。',
    initiator: {
      id: 'u5',
      name: '爱哭的小鱼',
      avatar: 'https://picsum.photos/id/237/200/200'
    },
    members: [
      { id: 'u5', name: '爱哭的小鱼', avatar: 'https://picsum.photos/id/237/200/200', status: 'confirmed', gender: 'female', rolePreference: '苏橙' },
      { id: 'u6', name: '云舒', avatar: 'https://picsum.photos/id/659/200/200', status: 'confirmed', gender: 'female', rolePreference: '楚云歌' },
      { id: 'u7', name: '星辰', avatar: 'https://picsum.photos/id/718/200/200', status: 'confirmed', gender: 'male', rolePreference: '陆泽远' }
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
    totalSlots: 10,
    filledSlots: 7,
    scriptType: 'fun',
    tags: ['欢乐机制', '阵营', '团建推荐'],
    description: '超级欢乐的机制阵营本，适合团建。差3人即可发车！',
    initiator: {
      id: 'u8',
      name: '搞钱大王',
      avatar: 'https://picsum.photos/id/783/200/200'
    },
    members: [
      { id: 'u8', name: '搞钱大王', avatar: 'https://picsum.photos/id/783/200/200', status: 'confirmed', gender: 'male', rolePreference: '齐梅' },
      { id: 'u9', name: '小太阳', avatar: 'https://picsum.photos/id/1025/200/200', status: 'confirmed', gender: 'female', rolePreference: '白如镜' },
      { id: 'u10', name: '乐翻天', avatar: 'https://picsum.photos/id/1027/200/200', status: 'confirmed', gender: 'male', rolePreference: '董建国' },
      { id: 'u11', name: '奶茶控', avatar: 'https://picsum.photos/id/1035/200/200', status: 'confirmed', gender: 'female', rolePreference: '李民俊' },
      { id: 'u12', name: '笑笑', avatar: 'https://picsum.photos/id/1038/200/200', status: 'pending', gender: 'female', rolePreference: '林笑' },
      { id: 'u13', name: '阿杰', avatar: 'https://picsum.photos/id/1036/200/200', status: 'waitlist', gender: 'male' },
      { id: 'u14', name: '小凡', avatar: 'https://picsum.photos/id/1039/200/200', status: 'waitlist', gender: 'male' }
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
    totalSlots: 6,
    filledSlots: 2,
    scriptType: 'hardcore',
    tags: ['硬核推理', '城限首发', '本格', '刑侦'],
    description: '城限首发本，硬核刑侦推理。需要资深硬核玩家，时长7-8小时。',
    initiator: {
      id: 'u15',
      name: '推理机器',
      avatar: 'https://picsum.photos/id/1038/200/200'
    },
    members: [
      { id: 'u15', name: '推理机器', avatar: 'https://picsum.photos/id/1038/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u16', name: '真相只有一个', avatar: 'https://picsum.photos/id/1044/200/200', status: 'confirmed', gender: 'female' }
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
    totalSlots: 6,
    filledSlots: 5,
    scriptType: 'emotion',
    tags: ['情感沉浸', '独家本', '治愈'],
    description: '超治愈的情感独家本，差1位女生，不接受反串。',
    initiator: {
      id: 'u17',
      name: '温暖阳光',
      avatar: 'https://picsum.photos/id/225/200/200'
    },
    members: [
      { id: 'u17', name: '温暖阳光', avatar: 'https://picsum.photos/id/225/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u18', name: '月野兔', avatar: 'https://picsum.photos/id/230/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u19', name: '清风徐来', avatar: 'https://picsum.photos/id/250/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u20', name: '小确幸', avatar: 'https://picsum.photos/id/582/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u21', name: '星河', avatar: 'https://picsum.photos/id/598/200/200', status: 'pending', gender: 'female' }
    ],
    status: 'recruiting',
    isExclusive: true,
    isFirstPlay: false,
    createdAt: '2025-06-20 16:45'
  },
  {
    id: '6',
    title: '【恐怖城限】《第二十二条校规》惊悚来袭',
    scriptName: '第二十二条校规',
    city: '重庆',
    store: '惊魂夜·解放碑店',
    date: '2025-06-27',
    time: '20:00',
    priceMin: 198,
    priceMax: 228,
    totalSlots: 7,
    filledSlots: 4,
    scriptType: 'terror',
    tags: ['恐怖惊悚', '变格', '城限本'],
    description: '超恐怖校园本，胆小者慎入！需要能接受惊吓的玩家。',
    initiator: {
      id: 'u22',
      name: '胆大鬼',
      avatar: 'https://picsum.photos/id/160/200/200'
    },
    members: [
      { id: 'u22', name: '胆大鬼', avatar: 'https://picsum.photos/id/160/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u23', name: '夜猫子', avatar: 'https://picsum.photos/id/201/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u24', name: '鬼王', avatar: 'https://picsum.photos/id/119/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u25', name: '小南瓜', avatar: 'https://picsum.photos/id/1035/200/200', status: 'waitlist', gender: 'female' }
    ],
    status: 'recruiting',
    isExclusive: false,
    isFirstPlay: false,
    createdAt: '2025-06-17 20:30'
  },
  {
    id: '7',
    title: '【机制阵营】《壬辰倭乱》古风权谋',
    scriptName: '壬辰倭乱',
    city: '杭州',
    store: '古风堂·西湖店',
    date: '2025-07-05',
    time: '12:00',
    priceMin: 238,
    priceMax: 268,
    totalSlots: 7,
    filledSlots: 3,
    scriptType: 'mechanism',
    tags: ['机制阵营', '古风', '权谋', '城限'],
    description: '大型古风机制阵营本，时长8小时。喜欢权谋机制的玩家来！',
    initiator: {
      id: 'u26',
      name: '公子世无双',
      avatar: 'https://picsum.photos/id/1015/200/200'
    },
    members: [
      { id: 'u26', name: '公子世无双', avatar: 'https://picsum.photos/id/1015/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u27', name: '侠女', avatar: 'https://picsum.photos/id/1018/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u28', name: '江湖人', avatar: 'https://picsum.photos/id/1036/200/200', status: 'pending', gender: 'male' }
    ],
    status: 'recruiting',
    isExclusive: false,
    isFirstPlay: false,
    createdAt: '2025-06-22 08:50'
  },
  {
    id: '8',
    title: '【欢乐爆笑】《来电》诈骗主题',
    scriptName: '来电',
    city: '南京',
    store: '笑翻天·新街口店',
    date: '2025-06-24',
    time: '19:00',
    priceMin: 138,
    priceMax: 168,
    totalSlots: 6,
    filledSlots: 6,
    scriptType: 'fun',
    tags: ['欢乐机制', '反转', '新手友好'],
    description: '已发车，人员已满。',
    initiator: {
      id: 'u29',
      name: '开心果',
      avatar: 'https://picsum.photos/id/787/200/200'
    },
    members: [
      { id: 'u29', name: '开心果', avatar: 'https://picsum.photos/id/787/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u30', name: '大富翁', avatar: 'https://picsum.photos/id/1082/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u31', name: '小机灵', avatar: 'https://picsum.photos/id/3/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u32', name: '阿强', avatar: 'https://picsum.photos/id/1025/200/200', status: 'confirmed', gender: 'male' },
      { id: 'u33', name: '小美', avatar: 'https://picsum.photos/id/64/200/200', status: 'confirmed', gender: 'female' },
      { id: 'u34', name: '大壮', avatar: 'https://picsum.photos/id/177/200/200', status: 'confirmed', gender: 'male' }
    ],
    status: 'full',
    isExclusive: false,
    isFirstPlay: false,
    createdAt: '2025-06-15 14:00'
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
