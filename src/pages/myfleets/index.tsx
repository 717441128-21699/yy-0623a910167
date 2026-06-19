import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import FleetCard from '@/components/FleetCard';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { useFleetStore } from '@/store/fleetStore';
import { Fleet, FleetMember } from '@/types/fleet';

const statusTextMap: Record<FleetMember['status'], string> = {
  confirmed: '已上车',
  pending: '待确认',
  waitlist: '候补'
};

const JoinedFleetCard: React.FC<{ fleet: Fleet; myMember: FleetMember; onConfirmDriving: (fleetId: string) => void }> = ({ fleet, myMember, onConfirmDriving }) => {
  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/fleet-detail/index?id=${fleet.id}` });
  };

  const assignedRole = fleet.roleSlots.find((r) => r.id === myMember.assignedRoleId);

  return (
    <View className={styles.joinedCard}>
      {myMember.status === 'confirmed' && !myMember.confirmed && (
        <View className={styles.confirmReminder}>
          <Text className={styles.confirmReminderText}>待确认到场 — 请尽快确认是否能按时到场</Text>
          <View
            className={styles.confirmReminderBtn}
            onClick={(e) => { e.stopPropagation(); onConfirmDriving(fleet.id); }}
          >
            <Text>确认到场</Text>
          </View>
        </View>
      )}

      <View className={styles.joinedCardHeader}>
        <View className={styles.joinedTitleRow}>
          <Text className={styles.joinedScriptName}>{fleet.scriptName}</Text>
          <StatusBadge status={myMember.status} />
        </View>
        <View className={styles.joinedSubInfo}>
          <Text className={styles.joinedSubText}>{fleet.city} · {fleet.store}</Text>
          <Text className={styles.joinedSubText}>{fleet.date} {fleet.time}</Text>
        </View>
      </View>

      <View className={styles.joinedCardBody} onClick={handleClick}>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>我的状态</Text>
          <Text
            className={classnames(
              styles.detailValue,
              myMember.status === 'confirmed' && styles.statusConfirmed,
              myMember.status === 'pending' && styles.statusPending,
              myMember.status === 'waitlist' && styles.statusWaitlist
            )}
          >
            {statusTextMap[myMember.status]}
          </Text>
        </View>

        {myMember.availableTime && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>可到时间</Text>
            <Text className={styles.detailValue}>{myMember.availableTime}</Text>
          </View>
        )}

        {myMember.canCrossPlay !== undefined && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>是否反串</Text>
            <Text className={classnames(styles.detailValue, myMember.canCrossPlay ? styles.tagYes : styles.tagNo)}>
              {myMember.canCrossPlay ? '可以' : '不可以'}
            </Text>
          </View>
        )}

        {myMember.hasReadSeries !== undefined && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>已读同系列</Text>
            <Text className={classnames(styles.detailValue, myMember.hasReadSeries ? styles.tagYes : styles.tagNo)}>
              {myMember.hasReadSeries ? '是' : '否'}
            </Text>
          </View>
        )}

        {myMember.rolePreference && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>角色意向</Text>
            <Text className={styles.detailValue}>{myMember.rolePreference}</Text>
          </View>
        )}

        {assignedRole && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>分配角色</Text>
            <Text className={classnames(styles.detailValue, styles.assignedRole)}>{assignedRole.name}</Text>
          </View>
        )}

        {myMember.remark && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>备注</Text>
            <Text className={classnames(styles.detailValue, styles.remarkText)}>{myMember.remark}</Text>
          </View>
        )}
      </View>

      <View className={styles.joinedCardFooter}>
        <Text className={styles.footerHint}>点击查看车队详情 ›</Text>
      </View>
    </View>
  );
};

const MyFleetsPage: React.FC = () => {
  const getMyInitiatedFleets = useFleetStore((s) => s.getMyInitiatedFleets);
  const getMyJoinedFleets = useFleetStore((s) => s.getMyJoinedFleets);
  const currentUserId = useFleetStore((s) => s.currentUserId);
  const confirmSelfDriving = useFleetStore((s) => s.confirmSelfDriving);
  const allFleets = useFleetStore((s) => s.fleets);

  const [activeTab, setActiveTab] = useState<'initiated' | 'joined'>('initiated');

  useDidShow(() => {
    console.log('[MyFleets] 页面显示，总车队数:', allFleets.length);
  });

  const handleConfirmDriving = (fleetId: string) => {
    confirmSelfDriving(fleetId, currentUserId);
    Taro.showToast({ title: '已确认到场', icon: 'success' });
  };

  const initiatedFleets: Fleet[] = getMyInitiatedFleets();
  const joinedFleets: Fleet[] = getMyJoinedFleets();

  const currentList = activeTab === 'initiated' ? initiatedFleets : joinedFleets;

  return (
    <View className={styles.myFleetsPage}>
      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'initiated' && styles.active)}
          onClick={() => setActiveTab('initiated')}
        >
          <Text>我发起的</Text>
          <Text className={classnames(styles.tabCount, activeTab === 'initiated' && styles.active)}>
            {initiatedFleets.length}
          </Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'joined' && styles.active)}
          onClick={() => setActiveTab('joined')}
        >
          <Text>我参与的</Text>
          <Text className={classnames(styles.tabCount, activeTab === 'joined' && styles.active)}>
            {joinedFleets.length}
          </Text>
        </View>
      </View>

      <View className={styles.statusTab}>
        <View className={classnames(styles.statusItem, styles.active)}>
          <Text>全部</Text>
        </View>
        <View className={styles.statusItem}>
          <Text>招募中</Text>
        </View>
        <View className={styles.statusItem}>
          <Text>已成团</Text>
        </View>
        <View className={styles.statusItem}>
          <Text>已完成</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.listSection}>
        {activeTab === 'initiated' ? (
          initiatedFleets.length > 0 ? (
            initiatedFleets.map((fleet) => <FleetCard key={fleet.id} fleet={fleet} />)
          ) : (
            <EmptyState
              icon="📝"
              title="还没有发起过车队"
              description="快去发起你的第一个车队吧"
            />
          )
        ) : joinedFleets.length > 0 ? (
          joinedFleets.map((fleet) => {
            const myMember = fleet.members.find((m) => m.userId === currentUserId);
            if (!myMember) return null;
            return <JoinedFleetCard key={fleet.id} fleet={fleet} myMember={myMember} onConfirmDriving={handleConfirmDriving} />;
          })
        ) : (
          <EmptyState
            icon="🎭"
            title="还没有参与过车队"
            description="去首页看看有什么感兴趣的车队"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default MyFleetsPage;
