import type { Fleet, FleetMember, RoleSlot } from '@/types/fleet';

export function getConfirmedCount(fleet: Fleet): number {
  return fleet.members.filter(m => m.status === 'confirmed').length;
}

export function getEmptyRoles(fleet: Fleet): RoleSlot[] {
  return fleet.roleSlots.filter(
    r => !fleet.roleAssignments.some(a => a.roleId === r.id && a.status === 'confirmed')
  );
}

export function getGapByGender(emptyRoles: RoleSlot[]): { male: number; female: number; any: number } {
  const result = { male: 0, female: 0, any: 0 };
  for (const role of emptyRoles) {
    if (role.gender === 'male') {
      result.male++;
    } else if (role.gender === 'female') {
      result.female++;
    } else {
      result.any++;
    }
  }
  return result;
}

export function getNeededPlayers(fleet: Fleet): number {
  return Math.max(0, fleet.totalPlayers - getConfirmedCount(fleet));
}

export function getMemberForRole(fleet: Fleet, roleId: string): FleetMember | null {
  const assignment = fleet.roleAssignments.find(a => a.roleId === roleId && a.memberId);
  if (!assignment) return null;
  return fleet.members.find(m => m.id === assignment.memberId) ?? null;
}
