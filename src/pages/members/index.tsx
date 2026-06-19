import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import { useFleetStore } from '@/store/fleetStore';
import { Fleet, FleetMember, RoleSlot } from '@/types/fleet';
import { getConfirmedCount, getEmptyRoles, getGapByGender, getNeededPlayers } from '@/utils/fleetUtils';

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

type PickerMode = 'approve' | 'promote' | null;

const MembersPage: React.FC = () => {
  const router = useRouter();
  const fleetId = router.params.id;
  const getFleetById = useFleetStore((s) => s.getFleetById);
  const confirmMember = useFleetStore((s) => s.confirmMember);
  const updateMemberStatus = useFleetStore((s) => s.updateMemberStatus);
  const removeMember = useFleetStore((s) => s.removeMember);
  const remindMember = useFleetStore((s) => s.remindMember);
  const remindAllPending = useFleetStore((s) => s.remindAllPending);
  const promoteFromWaitlist = useFleetStore((s) => s.promoteFromWaitlist);

  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [activeTab, setActiveTab] = useState<'checklist' | 'roles' | 'pending' | 'all'>('checklist');
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [pickerMemberId, setPickerMemberId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteMemberId, setNoteMemberId] = useState<string | null>(null);
  const [noteRoleId, setNoteRoleId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const loadFleet = () => {
    const found = getFleetById(fleetId || '');
    if (found) {
      setFleet({ ...found });
    }
  };

  useEffect(() => {
    loadFleet();
  }, [fleetId, getFleetById]);

  useDidShow(() => {
    loadFleet();
  });

  const emptyRoleSlots = useMemo(() => (fleet ? getEmptyRoles(fleet) : []), [fleet]);
  const gapCounts = useMemo(() => getGapByGender(emptyRoleSlots), [emptyRoleSlots]);
  const realNeeded = useMemo(() => (fleet ? getNeededPlayers(fleet) : 0), [fleet]);
  const realConfirmed = useMemo(() => (fleet ? getConfirmedCount(fleet) : 0), [fleet]);

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

  const unassignedRoles = fleet.roleSlots.filter((r) => {
    const a = fleet.roleAssignments.find((aa) => aa.roleId === r.id && aa.status === 'confirmed');
    return !a;
  });

  const checklistGroups = [
    {
      key: 'unconfirmedDriving',
      title: '已上车未确认到场',
      icon: '🚗',
      color: 'error' as const,
      members: unconfirmedForDriving,
      hint: '点击右侧提醒按钮发送确认提醒'
    },
    {
      key: 'pendingReview',
      title: '待审核报名',
      icon: '📋',
      color: 'pending' as const,
      members: pendingMembers,
      hint: '点击通过或拒绝处理报名申请'
    },
    {
      key: 'waitlist',
      title: '候补成员',
      icon: '⏳',
      color: 'waitlist' as const,
      members: waitlistMembers,
      hint: '有空位时可选择候补成员补位'
    },
    {
      key: 'unassignedRoles',
      title: '角色位未分配',
      icon: '🎭',
      color: 'info' as const,
      members: [],
      roles: unassignedRoles,
      hint: '审核报名时选择对应角色即可分配'
    }
  ];

  const openApproveFlow = (memberId: string) => {
    if (!fleetId) return;
    if (emptyRoleSlots.length === 0) {
      setNoteMemberId(memberId);
      setNoteRoleId(null);
      setReviewNote('');
      setShowNoteModal(true);
      return;
    }
    const member = fleet.members.find((m) => m.id === memberId);
    let defaultRoleId: string | null = null;
    if (member?.preferredRoleId) {
      const ok = emptyRoleSlots.some((r) => r.id === member.preferredRoleId);
      if (ok) defaultRoleId = member.preferredRoleId;
    }
    setPickerMode('approve');
    setPickerMemberId(memberId);
    setSelectedRoleId(defaultRoleId);
  };

  const handlePickerConfirm = () => {
    if (!fleetId || !pickerMemberId) return;
    if (pickerMode === 'approve') {
      setNoteMemberId(pickerMemberId);
      setNoteRoleId(selectedRoleId);
      setReviewNote('');
      setPickerMode(null);
      setPickerMemberId(null);
      setShowNoteModal(true);
    } else if (pickerMode === 'promote') {
      promoteFromWaitlist(fleetId, pickerMemberId, selectedRoleId || undefined);
      Taro.showToast({ title: '补位成功', icon: 'success' });
      setPickerMode(null);
      setPickerMemberId(null);
      setSelectedRoleId(null);
      setTimeout(loadFleet, 200);
    }
  };

  const handlePickerClose = () => {
    setPickerMode(null);
    setPickerMemberId(null);
    setSelectedRoleId(null);
  };

  const handleNoteConfirm = () => {
    if (!fleetId || !noteMemberId) return;
    confirmMember(fleetId, noteMemberId, noteRoleId || undefined, reviewNote.trim() || undefined);
    Taro.showToast({ title: '已通过', icon: 'success' });
    setShowNoteModal(false);
    setNoteMemberId(null);
    setNoteRoleId(null);
    setReviewNote('');
    setTimeout(loadFleet, 200);
  };

  const handleNoteCancel = () => {
    setShowNoteModal(false);
    setNoteMemberId(null);
    setNoteRoleId(null);
    setReviewNote('');
  };

  const openPromoteFlow = (memberId: string) => {
    if (!fleetId) return;
    if (emptyRoleSlots.length === 0) {
      promoteFromWaitlist(fleetId, memberId);
      Taro.showToast({ title: '补位成功', icon: 'success' });
      setTimeout(loadFleet, 200);
      return;
    }
    const member = fleet.members.find((m) => m.id === memberId);
    let defaultRoleId: string | null = null;
    if (member?.preferredRoleId) {
      const ok = emptyRoleSlots.some((r) => r.id === member.preferredRoleId);
      if (ok) defaultRoleId = member.preferredRoleId;
    }
    setPickerMode('promote');
    setPickerMemberId(memberId);
    setSelectedRoleId(defaultRoleId);
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

  const handleRemove = (memberId: string) => {
    if (!fleetId) return;
    Taro.showModal({
      title: '确认移除',
      content: '确认移除该成员后，可从候补名单中选择补位',
      success: (res) => {
        if (res.confirm) {
          removeMember(fleetId, memberId);
          Taro.showToast({ title: '已移除', icon: 'none' });
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
      (m) => m.status === 'pending' && m.preferredRoleId === role.id
    );
  };

  const getWaitlistForRole = (role: RoleSlot): FleetMember[] => {
    return fleet.members.filter(
      (m) => m.status === 'waitlist' && m.preferredRoleId === role.id
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
    showRemind: boolean = false,
    extraActions?: React.ReactNode
  ) => {
    const isRecentlyReminded =
      member.lastRemindedAt && Date.now() - member.lastRemindedAt < 60000;
    const isInitiator = member.userId === fleet.initiatorId;

    return (
      <View key={member.id} className={styles.memberItem}>
        <View className={styles.memberAvatar} />
        <View className={styles.memberInfo}>
          <Text className={styles.memberName}>
            {member.name}
            {isInitiator && <Text className={styles.miniTag}>发起人</Text>}
          </Text>
          <View className={styles.memberTags}>
            {member.gender && member.gender !== 'unknown' && (
              <Text className={styles.miniTag}>
                {member.gender === 'male' ? '♂ 男' : '♀ 女'}
              </Text>
            )}
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
            {member.reviewNote && (member.availableTime || member.rolePreference) && ' · '}
            {member.reviewNote && `备注:${member.reviewNote}`}
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
                onClick={() => openApproveFlow(member.id)}
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
          {member.status === 'waitlist' && (
            <View
              className={classnames(styles.actionBtn, styles.promoteBtn)}
              onClick={() => openPromoteFlow(member.id)}
            >
              <Text>补位</Text>
            </View>
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
              <View
                className={classnames(styles.actionBtn, styles.removeBtn)}
                onClick={() => handleRemove(member.id)}
              >
                <Text>移除</Text>
              </View>
              <StatusBadge status={member.status} />
            </>
          )}
          {extraActions}
          {isInitiator && <StatusBadge status="confirmed" />}
        </View>
      </View>
    );
  };

  const hasGap = gapCounts.male > 0 || gapCounts.female > 0 || gapCounts.any > 0;
  const pickerTitle = pickerMode === 'approve' ? '分配角色' : '选择补位角色';

  return (
    <View className={styles.membersPage}>
      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum}>{realConfirmed}</Text>
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
        <View className={styles.divider} />
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum}>{realNeeded}</Text>
          <Text className={styles.summaryLabel}>还差</Text>
        </View>
      </View>

      {hasGap && (
        <View className={styles.gapBar}>
          {gapCounts.male > 0 && (
            <View className={classnames(styles.gapItem, styles.male)}>
              <Text>♂ 缺{gapCounts.male}男角</Text>
            </View>
          )}
          {gapCounts.female > 0 && (
            <View className={classnames(styles.gapItem, styles.female)}>
              <Text>♀ 缺{gapCounts.female}女角</Text>
            </View>
          )}
          {gapCounts.any > 0 && (
            <View className={classnames(styles.gapItem, styles.any)}>
              <Text>○ 缺{gapCounts.any}不限</Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'checklist' && styles.active)}
          onClick={() => setActiveTab('checklist')}
        >
          <Text>发车前清单</Text>
        </View>
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
          <Text>待审核</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'all' && styles.active)}
          onClick={() => setActiveTab('all')}
        >
          <Text>全部</Text>
        </View>
      </View>

      {activeTab === 'checklist' && (
        <View className={styles.checklistWrap}>
          {checklistGroups.map((group) => {
            const count =
              group.key === 'unassignedRoles'
                ? (group.roles || []).length
                : group.members.length;
            if (count === 0) return null;
            return (
              <View key={group.key} className={styles.checklistSection}>
                <View className={styles.checklistHeader}>
                  <Text className={styles.checklistIcon}>{group.icon}</Text>
                  <Text className={classnames(styles.checklistTitle, group.color)}>
                    {group.title}
                  </Text>
                  <Text className={styles.checklistCount}>{count}</Text>
                </View>
                <Text className={styles.checklistHint}>{group.hint}</Text>

                {group.key === 'unconfirmedDriving' && (
                  <View className={styles.checklistRemindAll} onClick={handleRemindAll}>
                    <Text>一键提醒全部</Text>
                  </View>
                )}

                <View className={styles.checklistBody}>
                  {group.key === 'unassignedRoles'
                    ? (group.roles || []).map((role) => (
                        <View key={role.id} className={styles.checklistRoleItem}>
                          <Text className={styles.checklistRoleName}>{role.name}</Text>
                          <Text className={classnames(styles.checklistRoleGender, getGenderClass(role.gender))}>
                            {getGenderLabel(role.gender)}
                          </Text>
                        </View>
                      ))
                    : group.members.map((m) => renderMemberItem(m, true))}
                </View>
              </View>
            );
          })}

          {checklistGroups.every(
            (g) =>
              (g.key === 'unassignedRoles' ? (g.roles || []).length : g.members.length) === 0
          ) && (
            <View className={styles.allClearCard}>
              <Text className={styles.allClearIcon}>🎉</Text>
              <Text className={styles.allClearTitle}>发车准备就绪</Text>
              <Text className={styles.allClearDesc}>所有成员已确认到场，角色全部就位</Text>
            </View>
          )}
        </View>
      )}

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
                      {status === 'pending' &&
                        `待确认（${pendings.length + (assigned?.status === 'pending' ? 1 : 0)}人）`}
                      {status === 'empty' && '虚位以待'}
                    </Text>
                  </View>
                  <View className={styles.memberList}>
                    {assigned && renderMemberItem(assigned, true)}
                    {pendings
                      .filter((p) => !assigned || p.id !== assigned.id)
                      .map((p) => renderMemberItem(p, false))}
                    {waitlist.map((w) => renderMemberItem(w, false))}
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
                    {unassignedPending.map((p) => renderMemberItem(p, false))}
                    {unassignedWaitlist.map((w) => renderMemberItem(w, false))}
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
              {pendingMembers.map((m) => renderMemberItem(m, false))}
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
            {fleet.members.map((m) => renderMemberItem(m, true))}
          </View>
        </View>
      )}

      {pickerMode && (
        <View className={styles.rolePickerMask} onClick={handlePickerClose}>
          <View className={styles.rolePickerContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.rolePickerHeader}>
              <Text className={styles.rolePickerTitle}>{pickerTitle}</Text>
              <View className={styles.rolePickerClose} onClick={handlePickerClose}>
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
              onClick={() => selectedRoleId && handlePickerConfirm()}
            >
              <Text>{pickerMode === 'approve' ? '下一步：写审核备注' : '确认补位'}</Text>
            </View>
          </View>
        </View>
      )}

      {showNoteModal && (
        <View className={styles.rolePickerMask} onClick={handleNoteCancel}>
          <View className={styles.rolePickerContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.rolePickerHeader}>
              <Text className={styles.rolePickerTitle}>审核备注（选填）</Text>
              <View className={styles.rolePickerClose} onClick={handleNoteCancel}>
                <Text>✕</Text>
              </View>
            </View>
            <View className={styles.noteBody}>
              <Text className={styles.noteHint}>
                可给报名人写一句审核备注，比如注意事项、集合地点等，报名人能在我的车队和详情页看到
              </Text>
              <Textarea
                className={styles.noteInput}
                placeholder="例如：请13:50提前到店读本，车费218元现场付"
                value={reviewNote}
                onInput={(e) => setReviewNote(e.detail.value)}
                maxlength={120}
              />
            </View>
            <View className={styles.rolePickerConfirm} onClick={handleNoteConfirm}>
              <Text>确认通过</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MembersPage;
