import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFleetStore } from '@/store/fleetStore';

const MinePage: React.FC = () => {
  const router = useRouter();
  const getMyInitiatedFleets = useFleetStore((s) => s.getMyInitiatedFleets);
  const getMyJoinedFleets = useFleetStore((s) => s.getMyJoinedFleets);
  const getPendingConfirmations = useFleetStore((s) => s.getPendingConfirmations);
  const currentUserId = useFleetStore((s) => s.currentUserId);
  const confirmSelfDriving = useFleetStore((s) => s.confirmSelfDriving);

  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useDidShow(() => {
    refresh();
  });

  const initiatedCount = getMyInitiatedFleets().length;
  const joinedFleets = getMyJoinedFleets();
  const joinedCount = joinedFleets.length;
  const pendingConfirmations = getPendingConfirmations();

  const confirmedJoined = joinedFleets.filter(
    (f) => f.members.find((m) => m.userId === currentUserId)?.status === 'confirmed'
  ).length;

  const handleConfirmDriving = (fleetId: string) => {
    confirmSelfDriving(fleetId, currentUserId);
    Taro.showToast({ title: '已确认到场', icon: 'success' });
    refresh();
  };

  return (
    <View className={styles.minePage}>
      <View className={styles.headerCard}>
        <View className={styles.userRow}>
          <View className={styles.avatar} />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>剧本杀老玩家</Text>
            <Text className={styles.userId}>ID: {currentUserId.slice(0, 8)}</Text>
          </View>
          <View className={styles.editBtn}>
            <Text>编辑</Text>
          </View>
        </View>
      </View>

      <View className={styles.reminderBanner}>
        <View className={styles.bannerHeader}>
          <Text className={styles.bannerIcon}>🔔</Text>
          <Text className={styles.bannerTitle}>开车确认提醒</Text>
          {pendingConfirmations.length > 0 && (
            <View className={styles.badge}>{pendingConfirmations.length}</View>
          )}
        </View>
        {pendingConfirmations.length > 0 ? (
          <View className={styles.reminderList}>
            {pendingConfirmations.slice(0, 3).map(({ fleet, member }) => (
              <View key={fleet.id} className={styles.reminderItem}>
                <View className={styles.reminderInfo}>
                  <Text className={styles.reminderScript}>{fleet.scriptName}</Text>
                  <Text className={styles.reminderMeta}>
                    {fleet.date} {fleet.time} · {fleet.store}
                    {member.assignedRoleId && (() => {
                      const role = fleet.roleSlots.find((r) => r.id === member.assignedRoleId);
                      return role ? ` · ${role.name}` : '';
                    })()}
                  </Text>
                </View>
                <View
                  className={classnames(styles.confirmBtn, member.confirmed && styles.disabled)}
                  onClick={() => !member.confirmed && handleConfirmDriving(fleet.id)}
                >
                  <Text>{member.confirmed ? '已确认' : '确认到场'}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyBanner}>暂无待确认的车队</View>
        )}
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{initiatedCount}</Text>
          <Text className={styles.statLabel}>发起的车队</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.statItem}>
          <Text className={classnames(styles.statNum, 'accent')}>{confirmedJoined}</Text>
          <Text className={styles.statLabel}>已上车</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{pendingConfirmations.length}</Text>
          <Text className={styles.statLabel}>待确认</Text>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>我的车队</Text>
        <View
          className={styles.menuItem}
          onClick={() => Taro.switchTab({ url: '/pages/myfleets/index' })}
        >
          <Text className={styles.menuIcon}>🎭</Text>
          <Text className={styles.menuText}>我的车队</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>其他</Text>
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>⭐</Text>
          <Text className={styles.menuText}>我的收藏</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>⚙️</Text>
          <Text className={styles.menuText}>设置</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>💬</Text>
          <Text className={styles.menuText}>意见反馈</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>

      <View
        className={styles.logoutBtn}
        onClick={() => {
          Taro.showModal({
            title: '提示',
            content: '确认退出登录？',
            success: (res) => {
              if (res.confirm) {
                Taro.showToast({ title: '已退出', icon: 'none' });
              }
            }
          });
        }}
      >
        <Text>退出登录</Text>
      </View>
    </View>
  );
};

export default MinePage;
