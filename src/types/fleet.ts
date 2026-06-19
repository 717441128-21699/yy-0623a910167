export type FleetStatus = 'recruiting' | 'full' | 'completed' | 'cancelled';

export type MemberStatus = 'confirmed' | 'pending' | 'waitlist';

export type ScriptType = 'hardcore' | 'emotion' | 'fun' | 'terror' | 'mechanism' | 'other';

export interface FleetMember {
  id: string;
  name: string;
  avatar: string;
  status: MemberStatus;
  gender: 'male' | 'female' | 'unknown';
  rolePreference?: string;
  availableTime?: string;
  canCrossPlay?: boolean;
  hasReadSeries?: boolean;
  joinTime?: string;
}

export interface Fleet {
  id: string;
  title: string;
  scriptName: string;
  city: string;
  store: string;
  date: string;
  time: string;
  priceMin: number;
  priceMax: number;
  totalSlots: number;
  filledSlots: number;
  scriptType: ScriptType;
  tags: string[];
  description: string;
  initiator: {
    id: string;
    name: string;
    avatar: string;
  };
  members: FleetMember[];
  status: FleetStatus;
  isExclusive?: boolean;
  isFirstPlay?: boolean;
  createdAt: string;
  remark?: string;
}

export interface PublishForm {
  city: string;
  store: string;
  scriptName: string;
  date: string;
  time: string;
  priceMin: number;
  priceMax: number;
  totalSlots: number;
  scriptType: ScriptType;
  tags: string[];
  description: string;
  remark?: string;
  isExclusive?: boolean;
  isFirstPlay?: boolean;
}

export interface SignupForm {
  name: string;
  gender: 'male' | 'female';
  availableTime: string;
  rolePreference: string;
  canCrossPlay: boolean;
  hasReadSeries: boolean;
  remark?: string;
}
