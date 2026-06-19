import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import { mockFleets } from '@/data/mockFleets';
import { Fleet, FleetMember, ScriptType } from '@/types/fleet';

const typeLabelMap: Record<ScriptType, string> = {
  hardcore: '硬核推理',
  emotion: '情感沉浸',
  fun: '欢乐机制',
  terror: '恐怖惊悚',
  mechanism: '机制阵营',
  other: '其他'
};

const FleetDetailPage: React.FC = () => {
  const router = useRouter();
  const fleetId = router.params.id;
  const [fleet, setFleet] = useState<Fleet | null>(null);

  useEffect(() => {
    const found = mockFleets.find(f => f.id === fleetId);
    if (found) {
      setFleet(found);
    }
    console.log('[FleetDetail] 加载车队详情:', fleetId);
  }, [fleetId]);

  if (!fleet) {
    return (
      <View className={styles.fleetDetailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const confirmedMembers = fleet.members.filter(m => m.status === 'confirmed');
  const pendingMembers = fleet.members.filter(m => m.status === 'pending');
  const waitlistMembers = fleet.members.filter(m => m.status === 'waitlist');
  const progressPercent = (fleet.filledSlots / fleet.totalSlots) * 100;
  const isFull = fleet.filledSlots >= fleet.totalSlots;

  const handleSignup = () => {
    if (isFull) {
      Taro.showToast({
        title: '车队已满，可候补',
        icon: 'none'
      });
    }
    Taro.navigateTo({
      url: `/pages/signup/index?id=${fleet.id}`
    });
  };

  const handleManageMembers = () => {
    Taro.navigateTo({
      url: `/pages/members/index?id=${fleet.id}`
    });
  };

  const handleContact = () => {
    Taro.showToast({
      title: '联系发起人功能开发中',
      icon: 'none'
    });
  };

  const displayMembers = fleet.members.slice(0, 5);

  return (
    <View className={styles.fleetDetailPage}>
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerCard}>
          <Text className={styles.scriptName}>{fleet.scriptName}</Text>
          <View className={styles.tagsRow}>
            {fleet.isExclusive && (
              <View className={classnames(styles.tag, styles.exclusiveTag)}>
                <Text>独家本</Text>
              </View>
            )}
            {fleet.isFirstPlay && (
              <View className={classnames(styles.tag, styles.exclusiveTag)}>
                <Text>首发</Text>
              </View>
            )}
            <View className={styles.tag}>
              <Text>{typeLabelMap[fleet.scriptType]}</Text>
            </View>
          </View>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📍</Text>
              <Text className={styles.infoText}>{fleet.city} · {fleet.store}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>🕐</Text>
              <Text className={styles.infoText}>{fleet.date} {fleet.time}</Text>
            </View>
          </View>
        </View>

        <View className={classnames(styles.section, styles.progressSection)}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressTitle}>成团进度</Text>
            <Text className={styles.progressNum}>
              {fleet.filledSlots}<Text className={styles.total}>/{fleet.totalSlots}人</Text>
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </View>
          <View className={styles.statusBreakdown}>
            <View className={styles.statusItem}>
              <View className={classnames(styles.statusDot, styles.confirmed)} />
              <Text className={styles.statusText}>
                已上车<Text className={styles.statusCount}>{confirmedMembers.length}</Text>
              </Text>
            </View>
            <View className={styles.statusItem}>
              <View className={classnames(styles.statusDot, styles.pending)} />
              <Text className={styles.statusText}>
                待确认<Text className={styles.statusCount}>{pendingMembers.length}</Text>
              </Text>
            </View>
            <View className={styles.statusItem}>
              <View className={classnames(styles.statusDot, styles.waitlist)} />
              <Text className={styles.statusText}>
                候补<Text className={styles.statusCount}>{waitlistMembers.length}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View className={classnames(styles.section, styles.infoSection)}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📋</Text>
            基本信息
          </Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>发起人</Text>
            <View style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Image
                src={fleet.initiator.avatar}
                style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
                mode="aspectFill"
              />
              <Text style={{ fontSize: 28, color: '#1D2129' }}>{fleet.initiator.name}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>车费</Text>
            <Text className={styles.infoValue}>
              <Text className={styles.price}>¥{fleet.priceMin}-{fleet.priceMax}</Text>
              <Text style={{ marginLeft: 8, color: '#86909C' }}>/人</Text>
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>剧本标签</Text>
            <View style={{ flex: 1, flexWrap: 'wrap', display: 'flex', gap: 8 }}>
              {fleet.tags.map(tag => (
                <Text
                  key={tag}
                  style={{
                    fontSize: 22,
                    padding: '4px 12px',
                    borderRadius: 4,
                    backgroundColor: '#F2F3F5',
                    color: '#4E5969'
                  }}
                >
                  {tag}
                </Text>
              ))}
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>发布时间</Text>
            <Text className={styles.infoValue}>{fleet.createdAt}</Text>
          </View>
        </View>

        <View className={classnames(styles.section, styles.membersSection)}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>👥</Text>
            车队成员
          </Text>
          <View className={styles.membersList}>
            {displayMembers.map(member => (
              <View key={member.id} className={styles.memberItem}>
                <Image
                  className={styles.memberAvatar}
                  src={member.avatar}
                  mode="aspectFill"
                />
                <View className={styles.memberInfo}>
                  <Text className={styles.memberName}>{member.name}</Text>
                  <Text className={styles.memberDesc}>
                    {member.rolePreference ? `意向角色：${member.rolePreference}` : '角色意向：未选择'}
                  </Text>
                </View>
                <StatusBadge status={member.status} className={styles.memberBadge} />
              </View>
            ))}
            {fleet.members.length > 5 && (
              <View className={styles.moreBtn} onClick={handleManageMembers}>
                <Text>查看全部 {fleet.members.length} 位成员 ›</Text>
              </View>
            )}
          </View>
        </View>

        <View className={classnames(styles.section, styles.descSection)}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            车队描述
          </Text>
          <Text className={styles.descText}>{fleet.description}</Text>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View className={styles.secondaryBtn} onClick={handleContact}>
          <Text>联系发起人</Text>
        </View>
        <View
          className={classnames(styles.primaryBtn, isFull && styles.disabled)}
          onClick={handleSignup}
        >
          <Text>{isFull ? '已满员，可候补' : '立即报名'}</Text>
        </View>
      </View>
    </View>
  );
};

export default FleetDetailPage;
