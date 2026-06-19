import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const menuItems = [
    { icon: '🔔', title: '消息通知', badge: 3 },
    { icon: '❤️', title: '我的收藏' },
    { icon: '🏆', title: '我的评价' },
    { icon: '📋', title: '打本记录' }
  ];

  const settingItems = [
    { icon: '⚙️', title: '设置' },
    { icon: '💬', title: '意见反馈' },
    { icon: '❓', title: '帮助中心' },
    { icon: '📱', title: '关于我们' }
  ];

  const handleMenuClick = (title: string) => {
    console.log('[Mine] 点击菜单项:', title);
    Taro.showToast({
      title: `${title}功能开发中`,
      icon: 'none'
    });
  };

  return (
    <View className={styles.minePage}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image
            className={styles.avatar}
            src="https://picsum.photos/id/64/200/200"
            mode="aspectFill"
          />
          <View className={styles.userDetail}>
            <Text className={styles.userName}>推理狂人</Text>
            <Text className={styles.userDesc}>硬核推理爱好者 · 已打本 86 个</Text>
          </View>
          <View className={styles.editBtn}>
            <Text>编辑</Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>12</Text>
            <Text className={styles.statLabel}>发起车队</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>38</Text>
            <Text className={styles.statLabel}>参与车队</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>86</Text>
            <Text className={styles.statLabel}>打本总数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>15</Text>
            <Text className={styles.statLabel}>城限/独家</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionTitle}>我的服务</View>
      <View className={styles.menuSection}>
        {menuItems.map(item => (
          <View
            key={item.title}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.title)}
          >
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <Text className={styles.menuTitle}>{item.title}</Text>
            {item.badge && <Text className={styles.menuBadge}>{item.badge}</Text>}
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>

      <View className={styles.sectionTitle}>设置与帮助</View>
      <View className={styles.menuSection}>
        {settingItems.map(item => (
          <View
            key={item.title}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.title)}
          >
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <Text className={styles.menuTitle}>{item.title}</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MinePage;
