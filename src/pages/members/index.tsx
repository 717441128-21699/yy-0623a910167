import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import { useFleetStore } from '@/store/fleetStore';
import { Fleet, FleetMember, RoleSlot } from '@/types/fleet';

const getGenderLabel = (gender?: string) => {
  if (gender === 'male') return '♂ 男';
  if (gender === 'female') return '♀ 女';
  return '不限';
};

const getGenderClass = (gender?: string) => {
  if (gender === 'male') return 'male';
  if (gender === 'female') return 'female';
  return 'any';
};

const MembersPage: React.FC = () => {
  const router = useRouter();
  const fleetId = router.params.id;
  const getFleetById = useFleetStore((s) => s.getFleetById);
  const confirmMember = useFleetStore((s) => s.confirmMember);
  const updateMemberStatus = useFleetStore((s) => s.updateMemberStatus);
  const removeMember = useFleetStore((s) => s.removeMember);
  const remindMember = useFleetStore((s) => s.remindMember);
  const remindAllPending = useFleetStore((s) => s.remindAllPending);

  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [activeTab, setActiveTab] = useState<'roles' | 'pending' | 'all'>('roles');
  const [approvingMemberId, setApprovingMemberId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const loadFleet = () => {
    const found = getFleetById(fleetId || '');
    if (found) {
      setFleet({ ...found });
      console.log('[Members] 加载车队:', found.id, '成员数:', found.members.length);
    }
  };

  useEffect(() => {
    loadFleet();
  }, [fleetId, getFleetById]);

  useDidShow(() => {
    loadFleet();
  });

  const emptyRoleSlots = useMemo(() => {
    if (!fleet) return [];
    return fleet.roleSlots.filter((role) => {
      const assignment = fleet.roleAssignments.find(
        (a) => a.roleId === role.id && a.status === 'confirmed'
      );
      return !assignment;
    });
  }, [fleet]);

  const gapCounts = useMemo(() => {
    let male = 0;
    let female = 0;
    let any = 0;
    emptyRoleSlots.forEach((role) => {
      if (role.gender === 'male') male++;
      else if (role.gender === 'female') female++;
      else any++;
    });
    return { male, female, any };
  }, [emptyRoleSlots]);

  if (!fleet) {
    return (
      <View className={styles.membersPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const confirmedMembers = fleet.members.filter((m) => m.status === 'confirmed');
  const pendingMembers = fleet.members.filter((m) => m.status === 'pending');
  const waitlistMembers = fleet.members.filter((m) => m.status === 'waitlist');

  const unconfirmedForDriving = confirmedMembers.filter(
    (m) => !m.confirmed && m.userId !== fleet.initiatorId
  );

  const handleConfirmClick = (memberId: string) => {
    if (!fleetId) return;
    if (emptyRoleSlots.length === 0) {
      confirmMember(fleetId, memberId);
      Taro.showToast({ title: '已通过', icon: 'success' });
      setTimeout(loadFleet, 200);
      return;
    }
    const member = fleet.members.find((m) => m.id === memberId);
    let defaultRoleId: string | null = null;
    if (member?.preferredRoleId) {
      const isPreferredEmpty = emptyRoleSlots.some((r) => r.id === member.preferredRoleId);
      if (isPreferredEmpty) {
        defaultRoleId = member.preferredRoleId;
      }
    }
    setApprovingMemberId(memberId);
    setSelectedRoleId(defaultRoleId);
  };

  const handleRolePickerConfirm = () => {
    if (!fleetId || !approvingMemberId) return;
    confirmMember(fleetId, approvingMemberId, selectedRoleId || undefined);
    Taro.showToast({ title: '已通过', icon: 'success' });
    setApprovingMemberId(null);
    setSelectedRoleId(null);
    setTimeout(loadFleet, 200);
  };

  const handleRolePickerClose = () => {
    setApprovingMemberId(null);
    setSelectedRoleId(null);
  };

  const handleReject = (memberId: string) => {
    if (!fleetId) return;
    Taro.showModal({
      title: '确认拒绝',
      content: '确定要拒绝该成员的报名吗？',
      success: (res) => {
        if (res.confirm) {
          removeMember(fleetId, memberId);
          Taro.showToast({ title: '已拒绝', icon: 'none' });
          setTimeout(loadFleet, 200);
        }
      }
    });
  };

  const handleRemind = (memberId: string) => {
    if (!fleetId) return;
    remindMember(fleetId, memberId);
    Taro.showToast({ title: '已发送提醒', icon: 'success' });
    setTimeout(loadFleet, 200);
  };

  const handleRemindAll = () => {
    if (!fleetId || unconfirmedForDriving.length === 0) return;
    remindAllPending(fleetId);
    Taro.showToast({ title: `已提醒${unconfirmedForDriving.length}人`, icon: 'success' });
    setTimeout(loadFleet, 200);
  };

  const getAssignedMember = (role: RoleSlot): FleetMember | null => {
    const assignment = fleet.roleAssignments.find((a) => a.roleId === role.id);
    if (!assignment || !assignment.memberId) return null;
    return fleet.members.find((m) => m.id === assignment.memberId) || null;
  };

  const getPendingForRole = (role: RoleSlot): FleetMember[] => {
    return fleet.members.filter(
      (m) =>
        m.status === 'pending' &&
        m.preferredRoleId === role.id
    );
  };

  const getWaitlistForRole = (role: RoleSlot): FleetMember[] => {
    return fleet.members.filter(
      (m) =>
        m.status === 'waitlist' &&
        m.preferredRoleId === role.id
    );
  };

  const getRoleStatus = (role: RoleSlot): 'filled' | 'pending' | 'empty' => {
    const member = getAssignedMember(role);
    if (member?.status === 'confirmed') return 'filled';
    const pendings = getPendingForRole(role);
    if (pendings.length > 0 || member?.status === 'pending') return 'pending';
    return 'empty';
  };

  const renderMemberItem = (
    member: FleetMember,
    compact: boolean = false,
    showRemind: boolean = false
  ) => {
    const isRecentlyReminded =
      member.lastRemindedAt && Date.now() - member.lastRemindedAt < 60000;
    const isInitiator = member.userId === fleet.initiatorId;

    return (
      <View key={member.id} className={compact ? styles.memberItem : styles.memberItem}>
        <View className={compact ? styles.memberAvatar : styles.memberAvatar} />
        <View className={styles.memberInfo}>
          <Text className={styles.memberName}>
            {member.name}
            {isInitiator && <Text className={styles.miniTag}>发起人</Text>}
          </Text>
          <View className={styles.memberTags}>
            <Text className={styles.miniTag}>
              {member.gender === 'male' ? '♂ 男' : member.gender === 'female' ? '♀ 女' : ''}
            </Text>
            {member.canCrossPlay && <Text className={styles.miniTag}>可反串</Text>}
            {member.hasReadSeries && <Text className={styles.miniTag}>已读同系列</Text>}
            {member.assignedRoleId && (() => {
              const role = fleet.roleSlots.find((r) => r.id === member.assignedRoleId);
              return role ? <Text className={styles.miniTag}>{role.name}</Text> : null;
            })()}
            {member.confirmed && <Text className={styles.miniTag}>✓ 已确认开车</Text>}
          </View>
          <Text className={styles.memberMeta}>
            {member.availableTime && `可到:${member.availableTime}`}
            {member.rolePreference && member.availableTime && ' · '}
            {member.rolePreference && `意向:${member.rolePreference}`}
            {member.remark && (member.availableTime || member.rolePreference) && ' · '}
            {member.remark}
          </Text>
          {isRecentlyReminded && (
            <Text className={styles.remindedTag}>
              已提醒（{Math.ceil((Date.now() - (member.lastRemindedAt || 0)) / 1000)}秒前）
            </Text>
          )}
        </View>
        <View className={styles.memberActions}>
          {member.status === 'pending' && (
            <>
              <View
                className={classnames(styles.actionBtn, styles.confirmBtn)}
                onClick={() => handleConfirmClick(member.id)}
              >
                <Text>通过</Text>
              </View>
              <View
                className={classnames(styles.actionBtn, styles.rejectBtn)}
                onClick={() => handleReject(member.id)}
              >
                <Text>拒绝</Text>
              </View>
            </>
          )}
          {member.status === 'confirmed' && !isInitiator && (
            <>
              {!member.confirmed && showRemind && (
                <View
                  className={classnames(
                    styles.actionBtn,
                    styles.remindBtn,
                    isRecentlyReminded && styles.disabled
                  )}
                  onClick={() => !isRecentlyReminded && handleRemind(member.id)}
                >
                  <Text>{isRecentlyReminded ? '已提醒' : '提醒'}</Text>
                </View>
              )}
              <StatusBadge status={member.status} />
            </>
          )}
          {member.status === 'waitlist' && (
            <StatusBadge status={member.status} />
          )}
          {isInitiator && <StatusBadge status="confirmed" />}
        </View>
      </View>
    );
  };

  const hasGap = gapCounts.male > 0 || gapCounts.female > 0 || gapCounts.any > 0;

  return (
    <View className={styles.membersPage}>
      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum}>{confirmedMembers.length}</Text>
          <Text className={styles.summaryLabel}>已上车</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryNum, 'pending')}>{pendingMembers.length}</Text>
          <Text className={styles.summaryLabel}>待审核</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryNum, 'unconfirmed')}>
            {unconfirmedForDriving.length}
          </Text>
          <Text className={styles.summaryLabel}>待确认开车</Text>
        </View>
      </View>

      {hasGap && (
        <View className={styles.gapBar}>
          {gapCounts.male > 0 && (
            <View className={classnames(styles.gapItem, styles.male)}>
              <Text>♂ 缺{gapCounts.male}个男角</Text>
            </View>
          )}
          {gapCounts.female > 0 && (
            <View className={classnames(styles.gapItem, styles.female)}>
              <Text>♀ 缺{gapCounts.female}个女角</Text>
            </View>
          )}
          {gapCounts.any > 0 && (
            <View className={classnames(styles.gapItem, styles.any)}>
              <Text>○ 缺{gapCounts.any}个不限</Text>
            </View>
          )}
        </View>
      )}

      {unconfirmedForDriving.length > 0 && (
        <View className={styles.unconfirmedSection}>
          <View className={styles.unconfirmedHeader}>
            <Text className={styles.unconfirmedTitle}>
              <Text className={styles.warnIcon}>⚠️</Text>
              {unconfirmedForDriving.length}人未确认能否到场
            </Text>
            <View
              className={classnames(styles.remindAllBtn)}
              onClick={handleRemindAll}
            >
              <Text>一键提醒全部</Text>
            </View>
          </View>
          <View className={styles.unconfirmedList}>
            {unconfirmedForDriving.map((member) => {
              const isRecentlyReminded =
                member.lastRemindedAt && Date.now() - member.lastRemindedAt < 60000;
              return (
                <View key={member.id} className={styles.unconfirmedItem}>
                  <View className={styles.unconfirmedAvatar} />
                  <View className={styles.unconfirmedInfo}>
                    <Text className={styles.unconfirmedName}>{member.name}</Text>
                    <Text className={styles.unconfirmedRole}>
                      {member.assignedRoleId && (() => {
                        const role = fleet.roleSlots.find((r) => r.id === member.assignedRoleId);
                        return role ? role.name : '';
                      })()}
                      {member.availableTime && ` · 可到:${member.availableTime}`}
                    </Text>
                    {isRecentlyReminded && (
                      <Text className={styles.remindedTag}>
                        已提醒（{Math.ceil((Date.now() - (member.lastRemindedAt || 0)) / 1000)}秒前）
                      </Text>
                    )}
                  </View>
                  <View
                    className={classnames(
                      styles.remindBtn,
                      isRecentlyReminded && styles.disabled
                    )}
                    onClick={() => !isRecentlyReminded && handleRemind(member.id)}
                  >
                    <Text>{isRecentlyReminded ? '已提醒' : '提醒'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'roles' && styles.active)}
          onClick={() => setActiveTab('roles')}
        >
          <Text>按角色位</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'pending' && styles.active)}
          onClick={() => setActiveTab('pending')}
        >
          <Text>待审核 ({pendingMembers.length})</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'all' && styles.active)}
          onClick={() => setActiveTab('all')}
        >
          <Text>全部成员</Text>
        </View>
      </View>

      {activeTab === 'roles' && fleet.roleSlots.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            角色位分组
            <Text className={styles.titleCount}>共{fleet.roleSlots.length}位</Text>
          </Text>
          <View className={styles.rolesSection}>
            {fleet.roleSlots.map((role) => {
              const assigned = getAssignedMember(role);
              const pendings = getPendingForRole(role);
              const waitlist = getWaitlistForRole(role);
              const status = getRoleStatus(role);

              return (
                <View key={role.id} className={styles.roleGroup}>
                  <View className={styles.roleHeader}>
                    <Text className={styles.roleName}>{role.name}</Text>
                    <Text className={classnames(styles.roleGender, getGenderClass(role.gender))}>
                      {getGenderLabel(role.gender)}
                    </Text>
                    <Text className={classnames(styles.roleStatus, status)}>
                      {status === 'filled' && '✓ 已就位'}
                      {status === 'pending' && `待确认（${pendings.length + (assigned?.status === 'pending' ? 1 : 0)}人）`}
                      {status === 'empty' && '虚位以待'}
                    </Text>
                  </View>
                  <View className={styles.memberList}>
                    {assigned && renderMemberItem(assigned, true, true)}
                    {pendings
                      .filter((p) => !assigned || p.id !== assigned.id)
                      .map((p) => renderMemberItem(p, true, false))}
                    {waitlist.map((w) => renderMemberItem(w, true, false))}
                    {!assigned && pendings.length === 0 && waitlist.length === 0 && (
                      <View className={styles.emptyMember}>暂无报名人选</View>
                    )}
                  </View>
                </View>
              );
            })}

            {(() => {
              const unassignedPending = fleet.members.filter(
                (m) => m.status === 'pending' && !m.preferredRoleId
              );
              const unassignedWaitlist = fleet.members.filter(
                (m) => m.status === 'waitlist' && !m.preferredRoleId
              );
              if (unassignedPending.length === 0 && unassignedWaitlist.length === 0) return null;
              return (
                <View className={styles.roleGroup}>
                  <View className={styles.roleHeader}>
                    <Text className={styles.roleName}>未选角色</Text>
                    <Text className={classnames(styles.roleStatus, 'pending')}>
                      {unassignedPending.length + unassignedWaitlist.length}人
                    </Text>
                  </View>
                  <View className={styles.memberList}>
                    {unassignedPending.map((p) => renderMemberItem(p, true, false))}
                    {unassignedWaitlist.map((w) => renderMemberItem(w, true, false))}
                  </View>
                </View>
              );
            })()}
          </View>
        </View>
      )}

      {activeTab === 'pending' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            待审核报名
            <Text className={styles.titleCount}>{pendingMembers.length}人</Text>
          </Text>
          {pendingMembers.length > 0 ? (
            <View className={styles.flatSection}>
              {pendingMembers.map((m) => renderMemberItem(m, false, false))}
            </View>
          ) : (
            <View className={styles.emptyMember}>暂无待审核成员</View>
          )}
        </View>
      )}

      {activeTab === 'all' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            全部成员
            <Text className={styles.titleCount}>{fleet.members.length}人</Text>
          </Text>
          <View className={styles.flatSection}>
            {fleet.members.map((m) => renderMemberItem(m, false, true))}
          </View>
        </View>
      )}

      {approvingMemberId && (
        <View className={styles.rolePickerMask} onClick={handleRolePickerClose}>
          <View className={styles.rolePickerContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.rolePickerHeader}>
              <Text className={styles.rolePickerTitle}>分配角色</Text>
              <View className={styles.rolePickerClose} onClick={handleRolePickerClose}>
                <Text>✕</Text>
              </View>
            </View>
            <View className={styles.rolePickerList}>
              {emptyRoleSlots.map((role) => (
                <View
                  key={role.id}
                  className={classnames(
                    styles.rolePickerItem,
                    selectedRoleId === role.id && styles.selected
                  )}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <View className={styles.rolePickerItemInfo}>
                    <Text className={styles.rolePickerItemName}>{role.name}</Text>
                    <Text className={classnames(styles.rolePickerItemGender, getGenderClass(role.gender))}>
                      {getGenderLabel(role.gender)}
                    </Text>
                  </View>
                  {selectedRoleId === role.id && (
                    <Text className={styles.rolePickerItemCheck}>✓</Text>
                  )}
                </View>
              ))}
            </View>
            <View
              className={classnames(styles.rolePickerConfirm, !selectedRoleId && styles.disabled)}
              onClick={() => selectedRoleId && handleRolePickerConfirm()}
            >
              <Text>确认分配</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MembersPage;
