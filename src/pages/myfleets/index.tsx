import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import FleetCard from '@/components/FleetCard';
import EmptyState from '@/components/EmptyState';
import { mockFleets } from '@/data/mockFleets';
import { Fleet } from '@/types/fleet';

const MyFleetsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'initiated' | 'joined'>('initiated');

  const initiatedFleets: Fleet[] = mockFleets.slice(0, 2);
  const joinedFleets: Fleet[] = mockFleets.slice(2, 5);

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
        {currentList.length > 0 ? (
          currentList.map(fleet => (
            <FleetCard key={fleet.id} fleet={fleet} />
          ))
        ) : (
          <EmptyState
            icon={activeTab === 'initiated' ? '📝' : '🎭'}
            title={activeTab === 'initiated' ? '还没有发起过车队' : '还没有参与过车队'}
            description={activeTab === 'initiated' ? '快去发起你的第一个车队吧' : '去首页看看有什么感兴趣的车队'}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default MyFleetsPage;
