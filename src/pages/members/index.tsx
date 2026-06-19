import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { mockFleets } from '@/data/mockFleets';
import { Fleet, FleetMember, MemberStatus } from '@/types/fleet';

type TabType = 'all' | 'confirmed' | 'pending' | 'waitlist';

const MembersPage: React.FC = () => {
  const router = useRouter();
  const fleetId = router.params.id;
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    const found = mockFleets.find(f => f.id === fleetId);
    if (found) {
      setFleet(found);
    }
    console.log('[Members] 加载成员管理:', fleetId);
  }, [fleetId]);

  if (!fleet) {
    return (
      <View className={styles.membersPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const confirmedMembers = fleet.members.filter(m => m.status === 'confirmed');
  const pendingMembers = fleet.members.filter(m => m.status === 'pending');
  const waitlistMembers = fleet.members.filter(m => m.status === 'waitlist');

  const getFilteredMembers = (): FleetMember[] => {
    switch (activeTab) {
      case 'confirmed':
        return confirmedMembers;
      case 'pending':
        return pendingMembers;
      case 'waitlist':
        return waitlistMembers;
      default:
        return fleet.members;
    }
  };

  const filteredMembers = getFilteredMembers();

  const handleConfirm = (memberId: string) => {
    console.log('[Members] 确认成员上车:', memberId);
    Taro.showToast({
      title: '已确认上车',
      icon: 'success'
    });
  };

  const handleRemove = (memberId: string, memberName: string) => {
    Taro.showModal({
      title: '确认移除',
      content: `确定要移除 ${memberName} 吗？`,
      confirmText: '移除',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          console.log('[Members] 移除成员:', memberId);
          Taro.showToast({
            title: '已移除',
            icon: 'success'
          });
        }
      }
    });
  };

  const handlePromote = (memberId: string) => {
    console.log('[Members] 候补转正:', memberId);
    Taro.showToast({
      title: '已通知候补玩家',
      icon: 'success'
    });
  };

  const handleRemindAll = () => {
    console.log('[Members] 一键提醒所有待确认成员');
    Taro.showModal({
      title: '发送提醒',
      content: `将向 ${pendingMembers.length} 位待确认成员发送确认提醒`,
      confirmText: '发送',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '提醒已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const renderMemberActions = (member: FleetMember) => {
    switch (member.status) {
      case 'pending':
        return (
          <View className={styles.actionButtons}>
            <View
              className={classnames(styles.actionBtn, styles.danger)}
              onClick={() => handleRemove(member.id, member.name)}
            >
              <Text>拒绝</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={() => handleConfirm(member.id)}
            >
              <Text>确认上车</Text>
            </View>
          </View>
        );
      case 'waitlist':
        return (
          <View className={styles.actionButtons}>
            <View
              className={classnames(styles.actionBtn, styles.danger)}
              onClick={() => handleRemove(member.id, member.name)}
            >
              <Text>移除</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={() => handlePromote(member.id)}
            >
              <Text>通知上车</Text>
            </View>
          </View>
        );
      case 'confirmed':
        return (
          <View className={styles.actionButtons}>
            <View
              className={classnames(styles.actionBtn, styles.secondary)}
            >
              <Text>联系Ta</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.danger)}
              onClick={() => handleRemove(member.id, member.name)}
            >
              <Text>移除</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const tabs: { value: TabType; label: string; count: number }[] = [
    { value: 'all', label: '全部', count: fleet.members.length },
    { value: 'confirmed', label: '已上车', count: confirmedMembers.length },
    { value: 'pending', label: '待确认', count: pendingMembers.length },
    { value: 'waitlist', label: '候补', count: waitlistMembers.length }
  ];

  return (
    <View className={styles.membersPage}>
      <View className={styles.summaryCard}>
        <Text className={styles.scriptName}>{fleet.scriptName}</Text>
        <Text className={styles.fleetInfo}>
          {fleet.date} {fleet.time} · {fleet.store}
        </Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{fleet.filledSlots}</Text>
            <Text className={styles.statLabel}>已上车</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{pendingMembers.length}</Text>
            <Text className={styles.statLabel}>待确认</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{waitlistMembers.length}</Text>
            <Text className={styles.statLabel}>候补</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{fleet.totalSlots - fleet.filledSlots}</Text>
            <Text className={styles.statLabel}>剩余位</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.value}
            className={classnames(styles.tabItem, activeTab === tab.value && styles.active)}
            onClick={() => setActiveTab(tab.value)}
          >
            <Text>{tab.label}</Text>
            <Text className={styles.tabCount}>{tab.count}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.memberList}>
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <View key={member.id} className={styles.memberCard}>
              <View className={styles.memberHeader}>
                <Image
                  className={styles.memberAvatar}
                  src={member.avatar}
                  mode="aspectFill"
                />
                <View className={styles.memberInfo}>
                  <Text className={styles.memberName}>{member.name}</Text>
                  <View className={styles.memberTags}>
                    <View className={styles.tag}>
                      <Text>{member.gender === 'male' ? '男' : '女'}</Text>
                    </View>
                    {member.canCrossPlay && (
                      <View className={styles.tag}>
                        <Text>可反串</Text>
                      </View>
                    )}
                    {member.hasReadSeries && (
                      <View className={styles.tag}>
                        <Text>已读同系列</Text>
                      </View>
                    )}
                  </View>
                </View>
                <StatusBadge status={member.status} className={styles.statusBadge} />
              </View>

              <View className={styles.memberDetail}>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>可到时间</Text>
                  <Text className={styles.detailValue}>{member.availableTime || '未填写'}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>意向角色</Text>
                  <Text className={styles.detailValue}>{member.rolePreference || '未选择'}</Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>加入时间</Text>
                  <Text className={styles.detailValue}>{member.joinTime || '刚刚'}</Text>
                </View>
              </View>

              {renderMemberActions(member)}
            </View>
          ))
        ) : (
          <View className={styles.emptySection}>
            <EmptyState
              icon="👥"
              title="暂无成员"
              description="快去分享车队招募玩家吧"
            />
          </View>
        )}
      </ScrollView>

      {pendingMembers.length > 0 && (
        <View className={styles.footer}>
          <View className={styles.remindBtn} onClick={handleRemindAll}>
            <Text>一键提醒确认 ({pendingMembers.length})</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MembersPage;
