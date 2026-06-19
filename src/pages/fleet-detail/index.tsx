import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
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

const FleetDetailPage: React.FC = () => {
  const router = useRouter();
  const fleetId = router.params.id;
  const getFleetById = useFleetStore((s) => s.getFleetById);
  const currentUserId = useFleetStore((s) => s.currentUserId);
  const confirmSelfDriving = useFleetStore((s) => s.confirmSelfDriving);

  const [fleet, setFleet] = useState<Fleet | null>(null);

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

  const handleSignup = () => {
    if (!fleet) return;
    Taro.navigateTo({ url: `/pages/signup/index?id=${fleet.id}` });
  };

  const handleManageMembers = () => {
    if (!fleet) return;
    Taro.navigateTo({ url: `/pages/members/index?id=${fleet.id}` });
  };

  const handleContact = () => {
    Taro.showToast({ title: '复制联系方式成功', icon: 'success' });
  };

  const handleConfirmDriving = () => {
    if (!fleetId) return;
    confirmSelfDriving(fleetId, currentUserId);
    Taro.showToast({ title: '已确认到场', icon: 'success' });
    setTimeout(loadFleet, 200);
  };

  if (!fleet) {
    return (
      <View className={styles.fleetDetailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const safeInitiator = fleet.initiator || { id: '', name: '未知', avatar: '' };
  const safeTags = Array.isArray(fleet.tags) ? fleet.tags : [];
  const safeRoleSlots = Array.isArray(fleet.roleSlots) ? fleet.roleSlots : [];
  const safeRoleAssignments = Array.isArray(fleet.roleAssignments) ? fleet.roleAssignments : [];
  const safeMembers = Array.isArray(fleet.members) ? fleet.members : [];

  const confirmedCount = getConfirmedCount(fleet);
  const pendingCount = safeMembers.filter((m) => m.status === 'pending').length;
  const waitlistCount = safeMembers.filter((m) => m.status === 'waitlist').length;
  const progress = fleet.totalPlayers > 0 ? Math.min((confirmedCount / fleet.totalPlayers) * 100, 100) : 0;

  const isInitiator = fleet.initiatorId === currentUserId;
  const myMember = safeMembers.find((m) => m.userId === currentUserId);
  const hasJoined = !!myMember;
  const canSignup = !isInitiator && !hasJoined && getNeededPlayers(fleet) > 0;

  const needConfirmDriving = hasJoined && myMember!.status === 'confirmed' && !myMember!.confirmed;

  const emptyRoles = getEmptyRoles(fleet);
  const { male: gapMale, female: gapFemale, any: gapAny } = getGapByGender(emptyRoles);

  const getMemberForRole = (role: RoleSlot): FleetMember | null => {
    const assignment = safeRoleAssignments.find((a) => a.roleId === role.id);
    if (!assignment || !assignment.memberId) return null;
    return safeMembers.find((m) => m.id === assignment.memberId) || null;
  };

  const getPendingForRole = (role: RoleSlot): FleetMember[] => {
    return safeMembers.filter(
      (m) =>
        m.status === 'pending' &&
        m.preferredRoleId === role.id
    );
  };

  return (
    <View className={styles.fleetDetailPage}>
      <View className={styles.headerCard}>
        <Text className={styles.scriptName}>{fleet.scriptName || '未命名剧本'}</Text>
        <View className={styles.tagsRow}>
          {fleet.isExclusive && <Text className={classnames(styles.tag, styles.exclusiveTag)}>限定城限</Text>}
          {fleet.typeLabel && <Text className={styles.tag}>{fleet.typeLabel}</Text>}
          {fleet.difficulty && <Text className={styles.tag}>{fleet.difficulty}</Text>}
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>📅</Text>
            <Text className={styles.infoText}>{fleet.date || '待定'} {fleet.time || ''}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>📍</Text>
            <Text className={styles.infoText}>{fleet.city || ''} {fleet.store || ''}</Text>
          </View>
        </View>
      </View>

      {needConfirmDriving && (
        <View className={styles.confirmReminder}>
          <View className={styles.confirmReminderContent}>
            <Text className={styles.confirmReminderIcon}>🔔</Text>
            <View className={styles.confirmReminderText}>
              <Text className={styles.confirmReminderTitle}>请确认能否到场</Text>
              <Text className={styles.confirmReminderDesc}>
                你已上车但未确认到场，发车前请确认
                {myMember!.assignedRoleId && (() => {
                  const role = safeRoleSlots.find((r) => r.id === myMember!.assignedRoleId);
                  return role ? `（你的角色：${role.name}）` : '';
                })()}
              </Text>
            </View>
          </View>
          <View className={styles.confirmReminderBtn} onClick={handleConfirmDriving}>
            <Text>确认到场</Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📋</Text>
          基本信息
        </Text>
        <View className={styles.infoSection}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>发起人</Text>
            <View className={styles.infoValue}>
              <View className={styles.initiatorRow}>
                <Image className={styles.initiatorAvatar} src={safeInitiator.avatar} mode="aspectFill" />
                <Text>{safeInitiator.name}</Text>
              </View>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>车费</Text>
            <Text className={styles.infoValue}>
              <Text className={styles.price}>¥{fleet.priceMin}-{fleet.priceMax}</Text>
              <Text> /人</Text>
            </Text>
          </View>
          {safeTags.length > 0 && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>剧本标签</Text>
              <View className={styles.tagList}>
                {safeTags.map((tag) => (
                  <Text key={tag} className={styles.miniTag}>{tag}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📊</Text>
          成团进度
          <Text className={styles.titleCount}>还差 {getNeededPlayers(fleet)} 人</Text>
        </Text>
        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressTitle}>已确认 / 总人数</Text>
            <Text className={styles.progressNum}>
              {confirmedCount}<Text className={styles.total}> / {fleet.totalPlayers}</Text>
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progress}%` }} />
          </View>
          <View className={styles.statusBreakdown}>
            <View className={styles.statusItem}>
              <View className={classnames(styles.statusDot, 'confirmed')} />
              <Text className={styles.statusText}>
                已上车<Text className={styles.statusCount}>{confirmedCount}</Text>
              </Text>
            </View>
            <View className={styles.statusItem}>
              <View className={classnames(styles.statusDot, 'pending')} />
              <Text className={styles.statusText}>
                待确认<Text className={styles.statusCount}>{pendingCount}</Text>
              </Text>
            </View>
            <View className={styles.statusItem}>
              <View className={classnames(styles.statusDot, 'waitlist')} />
              <Text className={styles.statusText}>
                候补<Text className={styles.statusCount}>{waitlistCount}</Text>
              </Text>
            </View>
          </View>

          {emptyRoles.length > 0 && (
            <View className={styles.genderGapBar}>
              {gapMale > 0 && (
                <View className={classnames(styles.genderGapItem, styles.male)}>
                  <Text>♂ 缺{gapMale}男角</Text>
                </View>
              )}
              {gapFemale > 0 && (
                <View className={classnames(styles.genderGapItem, styles.female)}>
                  <Text>♀ 缺{gapFemale}女角</Text>
                </View>
              )}
              {gapAny > 0 && (
                <View className={classnames(styles.genderGapItem, styles.any)}>
                  <Text>○ 缺{gapAny}不限</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {safeRoleSlots.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🎭</Text>
            角色位分布
            <Text className={styles.titleCount}>
              {safeRoleSlots.filter((r) => getMemberForRole(r)?.status === 'confirmed').length}
              /{safeRoleSlots.length} 已就位
            </Text>
          </Text>
          <View className={styles.rolesSection}>
            <View className={styles.roleGrid}>
              {safeRoleSlots.map((role) => {
                const member = getMemberForRole(role);
                const pendings = getPendingForRole(role);
                const hasConfirmed = member?.status === 'confirmed';
                const hasPending = !hasConfirmed && pendings.length > 0;

                return (
                  <View
                    key={role.id}
                    className={classnames(
                      styles.roleCard,
                      hasConfirmed && styles.hasMember,
                      hasPending && styles.pending,
                      !member && !hasPending && styles.empty
                    )}
                  >
                    <View className={styles.roleHeader}>
                      <Text className={styles.roleName}>{role.name}</Text>
                      <Text className={classnames(styles.roleGender, getGenderClass(role.gender))}>
                        {getGenderLabel(role.gender)}
                      </Text>
                    </View>

                    {hasConfirmed && member && (
                      <View className={styles.roleMember}>
                        <View className={styles.memberAvatar} />
                        <View className={styles.memberInfo}>
                          <Text className={styles.memberName}>{member.name}</Text>
                          <Text className={classnames(styles.memberStatus, 'confirmed')}>已确认</Text>
                        </View>
                      </View>
                    )}

                    {!hasConfirmed && pendings.length > 0 && (
                      <View className={styles.roleMember}>
                        <View className={styles.memberInfo}>
                          <Text className={styles.memberName}>{pendings[0].name}</Text>
                          <Text className={classnames(styles.memberStatus, 'pending')}>
                            {pendings.length > 1 ? `待确认(等${pendings.length}人)` : '待确认'}
                          </Text>
                        </View>
                      </View>
                    )}

                    {!member && pendings.length === 0 && (
                      <View className={styles.emptyRole}>
                        <Text className={styles.plusIcon}>+</Text>
                        <Text>虚位以待</Text>
                      </View>
                    )}

                    {member?.availableTime && (
                      <Text className={styles.roleMeta}>到店：{member.availableTime}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>👥</Text>
          成员列表
          <Text className={styles.titleCount}>{safeMembers.length}人</Text>
        </Text>
        <View className={styles.membersSection}>
          {safeMembers.map((member) => (
            <View key={member.id} className={styles.memberItem}>
              <View className={styles.memberAvatar} />
              <View className={styles.memberInfo}>
                <Text className={styles.memberName}>
                  {member.name}
                  {member.userId === fleet.initiatorId && <Text>（发起人）</Text>}
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
                    const role = safeRoleSlots.find((r) => r.id === member.assignedRoleId);
                    return role ? <Text className={styles.miniTag}>{role.name}</Text> : null;
                  })()}
                  {member.confirmed && member.userId !== fleet.initiatorId && (
                    <Text className={styles.miniTag}>✓ 已确认到场</Text>
                  )}
                </View>
                <Text className={styles.memberMeta}>
                  {member.availableTime && `可到:${member.availableTime}`}
                  {member.rolePreference && member.availableTime && ' · '}
                  {member.rolePreference && `意向:${member.rolePreference}`}
                  {member.reviewNote && (member.availableTime || member.rolePreference) && ' · '}
                  {member.reviewNote && `备注:${member.reviewNote}`}
                </Text>
              </View>
              <View className={styles.memberBadge}>
                <StatusBadge status={member.status} />
              </View>
            </View>
          ))}

          {isInitiator && (
            <View className={styles.moreBtn} onClick={handleManageMembers}>
              <Text>进入成员管理 ›</Text>
            </View>
          )}
        </View>
      </View>

      {fleet.description && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            车队说明
          </Text>
          <View className={styles.descSection}>
            <Text className={styles.descText}>{fleet.description}</Text>
          </View>
        </View>
      )}

      <View className={styles.footer}>
        <View className={styles.secondaryBtn} onClick={handleContact}>
          <Text>联系发起人</Text>
        </View>
        {isInitiator ? (
          <View className={styles.primaryBtn} onClick={handleManageMembers}>
            <Text>成员管理</Text>
          </View>
        ) : canSignup ? (
          <View className={styles.primaryBtn} onClick={handleSignup}>
            <Text>立即报名（还差{getNeededPlayers(fleet)}人）</Text>
          </View>
        ) : hasJoined ? (
          <View className={classnames(styles.primaryBtn, styles.disabled)}>
            <Text>已加入车队</Text>
          </View>
        ) : (
          <View className={classnames(styles.primaryBtn, styles.disabled)}>
            <Text>车队已满</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FleetDetailPage;
