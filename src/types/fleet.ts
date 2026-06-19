export type FleetStatus = 'recruiting' | 'full' | 'completed' | 'cancelled';

export type MemberStatus = 'confirmed' | 'pending' | 'waitlist';

export type ScriptType = 'hardcore' | 'emotion' | 'fun' | 'terror' | 'mechanism' | 'other';

export type RoleGender = 'male' | 'female' | 'any';

export interface RoleSlot {
  id: string;
  name: string;
  gender: RoleGender;
  description?: string;
}

export interface RoleAssignment {
  roleId: string;
  memberId: string;
  status: MemberStatus;
}

export interface FleetMember {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  status: MemberStatus;
  gender: 'male' | 'female' | 'unknown';
  rolePreference?: string;
  preferredRoleId?: string;
  availableTime?: string;
  canCrossPlay?: boolean;
  hasReadSeries?: boolean;
  joinTime?: string;
  assignedRoleId?: string;
  lastRemindedAt?: number;
  confirmed?: boolean;
  remark?: string;
  reviewNote?: string;
  reviewAction?: 'approved' | 'rejected' | undefined;
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
  totalPlayers: number;
  neededPlayers: number;
  scriptType: ScriptType;
  typeLabel?: string;
  difficulty?: string;
  tags: string[];
  description: string;
  initiator: {
    id: string;
    name: string;
    avatar: string;
  };
  initiatorId: string;
  members: FleetMember[];
  roleSlots: RoleSlot[];
  roleAssignments: RoleAssignment[];
  status: FleetStatus;
  isExclusive?: boolean;
  isFirstPlay?: boolean;
  createdAt: string;
  remark?: string;
  reminderSent?: boolean;
}

export interface PublishForm {
  city: string;
  store: string;
  scriptName: string;
  date: string;
  time: string;
  priceMin: number;
  priceMax: number;
  neededPlayers: number;
  totalPlayers: number;
  scriptType: ScriptType;
  tags: string[];
  description: string;
  remark?: string;
  isExclusive?: boolean;
  isFirstPlay?: boolean;
  roleSlots: RoleSlot[];
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
