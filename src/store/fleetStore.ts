import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Fleet, FleetMember, RoleSlot, MemberStatus, SignupForm, PublishForm } from '@/types/fleet';
import { getConfirmedCount } from '@/utils/fleetUtils';

interface FleetState {
  fleets: Fleet[];
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;

  addFleet: (form: PublishForm) => Fleet;
  addMember: (fleetId: string, form: SignupForm) => void;
  updateMemberStatus: (fleetId: string, memberId: string, status: MemberStatus) => void;
  removeMember: (fleetId: string, memberId: string) => void;
  confirmMember: (fleetId: string, memberId: string, roleId?: string, reviewNote?: string) => void;
  promoteFromWaitlist: (fleetId: string, memberId: string, roleId?: string) => void;
  remindMember: (fleetId: string, memberId: string) => void;
  remindAllPending: (fleetId: string) => void;
  confirmSelfDriving: (fleetId: string, userId: string) => void;
  getFleetById: (id: string) => Fleet | undefined;
  getMyInitiatedFleets: () => Fleet[];
  getMyJoinedFleets: () => Fleet[];
  getPendingConfirmations: () => { fleet: Fleet; member: FleetMember }[];
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const defaultInitiator = {
  id: 'u_me',
  name: '我',
  avatar: 'https://picsum.photos/id/64/200/200'
};

const typeLabelMap: Record<string, string> = {
  hardcore: '硬核推理',
  emotion: '情感沉浸',
  fun: '欢乐机制',
  terror: '恐怖惊悚',
  mechanism: '机制阵营',
  other: '其他'
};

export const useFleetStore = create<FleetState>()(
  persist(
    (set, get) => ({
      fleets: [],
      currentUserId: 'u_me',
      currentUserName: '我',
      currentUserAvatar: 'https://picsum.photos/id/64/200/200',

      addFleet: (form: PublishForm): Fleet => {
        const nowTs = Date.now();

        const initiatorMember: FleetMember = {
          id: defaultInitiator.id,
          userId: defaultInitiator.id,
          name: defaultInitiator.name,
          avatar: defaultInitiator.avatar,
          status: 'confirmed',
          gender: 'unknown',
          joinTime: String(nowTs),
          confirmed: true
        };

        const roleAssignments = form.roleSlots.length > 0 && form.roleSlots[0].id
          ? [{ roleId: form.roleSlots[0].id, memberId: initiatorMember.id, status: 'confirmed' as MemberStatus }]
          : [];

        const newFleet: Fleet = {
          id: generateId(),
          title: form.scriptName,
          scriptName: form.scriptName,
          city: form.city,
          store: form.store,
          date: form.date,
          time: form.time,
          priceMin: form.priceMin,
          priceMax: form.priceMax,
          totalPlayers: form.totalPlayers,
          neededPlayers: form.neededPlayers,
          scriptType: form.scriptType,
          typeLabel: typeLabelMap[form.scriptType],
          tags: form.tags,
          description: form.description,
          initiator: { ...defaultInitiator },
          initiatorId: defaultInitiator.id,
          members: [initiatorMember],
          roleSlots: form.roleSlots,
          roleAssignments,
          status: 'recruiting',
          isExclusive: form.isExclusive,
          isFirstPlay: form.isFirstPlay,
          createdAt: String(nowTs),
          remark: form.remark
        };

        set((state) => ({
          fleets: [newFleet, ...state.fleets]
        }));

        console.log('[Store] 新增车队:', newFleet.id, newFleet.scriptName);
        return newFleet;
      },

      addMember: (fleetId: string, form: SignupForm) => {
        const nowTs = Date.now();
        const uid = get().currentUserId;

        const fleet = get().fleets.find((f) => f.id === fleetId);
        let preferredRoleId: string | undefined;
        if (fleet && form.rolePreference) {
          const matched = fleet.roleSlots.find(
            (r) => r.name === form.rolePreference
          );
          if (matched) {
            preferredRoleId = matched.id;
          }
        }

        const newMember: FleetMember = {
          id: 'm_' + generateId(),
          userId: uid,
          name: form.name,
          avatar: form.gender === 'female'
            ? 'https://picsum.photos/id/91/200/200'
            : 'https://picsum.photos/id/177/200/200',
          status: 'pending',
          gender: form.gender,
          rolePreference: form.rolePreference || undefined,
          preferredRoleId,
          availableTime: form.availableTime,
          canCrossPlay: form.canCrossPlay,
          hasReadSeries: form.hasReadSeries,
          remark: form.remark || undefined,
          joinTime: String(nowTs),
          confirmed: false
        };

        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;
            return {
              ...fleet,
              members: [...fleet.members, newMember]
            };
          })
        }));

        console.log('[Store] 新增成员:', fleetId, newMember.name, newMember.status);
      },

      updateMemberStatus: (fleetId: string, memberId: string, status: MemberStatus) => {
        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;
            const updatedMembers = fleet.members.map((m) =>
              m.id === memberId
                ? {
                    ...m,
                    status,
                    confirmed: status === 'confirmed' ? true : m.confirmed
                  }
                : m
            );

            let updatedAssignments = fleet.roleAssignments;
            if (status === 'confirmed') {
              const member = fleet.members.find((m) => m.id === memberId);
              if (member && member.assignedRoleId) {
                updatedAssignments = fleet.roleAssignments.map((a) =>
                  a.memberId === memberId ? { ...a, status: 'confirmed' } : a
                );
                if (!updatedAssignments.find((a) => a.memberId === memberId)) {
                  updatedAssignments = [
                    ...updatedAssignments,
                    { roleId: member.assignedRoleId, memberId, status: 'confirmed' }
                  ];
                }
              }
            }

            return {
              ...fleet,
              members: updatedMembers,
              roleAssignments: updatedAssignments
            };
          })
        }));
        console.log('[Store] 更新成员状态:', fleetId, memberId, status);
      },

      removeMember: (fleetId: string, memberId: string) => {
        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;
            const updatedMembers = fleet.members.filter((m) => m.id !== memberId);
            const updatedAssignments = fleet.roleAssignments.filter((a) => a.memberId !== memberId);
            const updatedFleet = { ...fleet, members: updatedMembers, roleAssignments: updatedAssignments };
            const confirmedCount = getConfirmedCount(updatedFleet);
            const isFull = confirmedCount >= fleet.totalPlayers;
            return {
              ...updatedFleet,
              neededPlayers: Math.max(0, fleet.totalPlayers - confirmedCount),
              status: isFull ? 'full' : fleet.status
            };
          })
        }));
        console.log('[Store] 移除成员:', fleetId, memberId);
      },

      confirmMember: (fleetId: string, memberId: string, roleId?: string, reviewNote?: string) => {
        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;

            const updatedMembers = fleet.members.map((m) =>
              m.id === memberId
                ? {
                    ...m,
                    status: 'confirmed' as MemberStatus,
                    confirmed: false,
                    assignedRoleId: roleId || m.preferredRoleId || m.assignedRoleId,
                    ...(reviewNote ? { reviewNote, reviewAction: 'approved' as const } : {})
                  }
                : m
            );

            let updatedAssignments = fleet.roleAssignments.filter((a) => a.memberId !== memberId);
            const targetRoleId = roleId || updatedMembers.find((m) => m.id === memberId)?.assignedRoleId;
            if (targetRoleId) {
              updatedAssignments = [
                ...updatedAssignments,
                { roleId: targetRoleId, memberId, status: 'confirmed' as MemberStatus }
              ];
            }

            const updatedFleet = { ...fleet, members: updatedMembers, roleAssignments: updatedAssignments };
            const confirmedCount = getConfirmedCount(updatedFleet);
            const isFull = confirmedCount >= fleet.totalPlayers;

            return {
              ...updatedFleet,
              neededPlayers: isFull ? 0 : Math.max(0, fleet.totalPlayers - confirmedCount),
              status: isFull ? 'full' : fleet.status
            };
          })
        }));
        console.log('[Store] 确认成员上车:', fleetId, memberId, roleId);
      },

      promoteFromWaitlist: (fleetId: string, memberId: string, roleId?: string) => {
        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;

            const updatedMembers = fleet.members.map((m) =>
              m.id === memberId
                ? {
                    ...m,
                    status: 'confirmed' as MemberStatus,
                    confirmed: false,
                    assignedRoleId: roleId || m.assignedRoleId
                  }
                : m
            );

            let updatedAssignments = fleet.roleAssignments;
            if (roleId) {
              updatedAssignments = fleet.roleAssignments.filter((a) => a.memberId !== memberId);
              const existingIdx = updatedAssignments.findIndex((a) => a.memberId === memberId);
              if (existingIdx >= 0) {
                updatedAssignments[existingIdx] = { ...updatedAssignments[existingIdx], roleId, status: 'confirmed' as MemberStatus };
              } else {
                updatedAssignments = [
                  ...updatedAssignments,
                  { roleId, memberId, status: 'confirmed' as MemberStatus }
                ];
              }
            }

            const updatedFleet = { ...fleet, members: updatedMembers, roleAssignments: updatedAssignments };
            const confirmedCount = getConfirmedCount(updatedFleet);
            const isFull = confirmedCount >= fleet.totalPlayers;

            return {
              ...updatedFleet,
              neededPlayers: Math.max(0, fleet.totalPlayers - confirmedCount),
              status: isFull ? 'full' : fleet.status
            };
          })
        }));
        console.log('[Store] 候补转正:', fleetId, memberId, roleId);
      },

      remindMember: (fleetId: string, memberId: string) => {
        const nowTs = Date.now();

        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;
            return {
              ...fleet,
              members: fleet.members.map((m) =>
                m.id === memberId ? { ...m, lastRemindedAt: nowTs } : m
              )
            };
          })
        }));
        console.log('[Store] 提醒成员确认:', fleetId, memberId);
      },

      remindAllPending: (fleetId: string) => {
        const nowTs = Date.now();

        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;
            return {
              ...fleet,
              reminderSent: true,
              members: fleet.members.map((m) =>
                m.status === 'confirmed' && !m.confirmed && m.userId !== fleet.initiatorId
                  ? { ...m, lastRemindedAt: nowTs }
                  : m
              )
            };
          })
        }));
        console.log('[Store] 一键提醒所有未确认开车的成员:', fleetId);
      },

      confirmSelfDriving: (fleetId: string, userId: string) => {
        set((state) => ({
          fleets: state.fleets.map((fleet) => {
            if (fleet.id !== fleetId) return fleet;
            return {
              ...fleet,
              members: fleet.members.map((m) =>
                m.userId === userId ? { ...m, confirmed: true } : m
              )
            };
          })
        }));
        console.log('[Store] 成员自行确认到场:', fleetId, userId);
      },

      getFleetById: (id: string) => {
        return get().fleets.find((f) => f.id === id);
      },

      getMyInitiatedFleets: () => {
        return get().fleets.filter((f) => f.initiatorId === get().currentUserId);
      },

      getMyJoinedFleets: () => {
        const uid = get().currentUserId;
        return get().fleets.filter((f) =>
          f.members.some((m) => m.userId === uid) && f.initiatorId !== uid
        );
      },

      getPendingConfirmations: () => {
        const uid = get().currentUserId;
        const result: { fleet: Fleet; member: FleetMember }[] = [];
        get().fleets.forEach((fleet) => {
          const me = fleet.members.find((m) => m.userId === uid);
          if (me && me.status === 'confirmed' && !me.confirmed && fleet.initiatorId !== uid) {
            result.push({ fleet, member: me });
          }
        });
        return result;
      }
    }),
    {
      name: 'fleet-storage',
      partialize: (state) => ({ fleets: state.fleets })
    }
  )
);
