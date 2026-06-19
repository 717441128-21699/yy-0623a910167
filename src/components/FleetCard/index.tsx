import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '../Tag';
import ProgressBar from '../ProgressBar';
import { Fleet, ScriptType } from '@/types/fleet';

export interface FleetCardProps {
  fleet: Fleet;
  className?: string;
  showProgress?: boolean;
}

const typeTagMap: Record<ScriptType, string> = {
  hardcore: 'hardcore',
  emotion: 'emotion',
  fun: 'fun',
  terror: 'terror',
  mechanism: 'mechanism',
  other: 'default'
};

const typeLabelMap: Record<ScriptType, string> = {
  hardcore: '硬核推理',
  emotion: '情感沉浸',
  fun: '欢乐机制',
  terror: '恐怖惊悚',
  mechanism: '机制阵营',
  other: '其他'
};

const FleetCard: React.FC<FleetCardProps> = ({ fleet, className, showProgress = true }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/fleet-detail/index?id=${fleet.id}`
    });
  };

  const remainingSlots = fleet.totalSlots - fleet.filledSlots;

  return (
    <View className={classnames(styles.fleetCard, className)} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.titleSection}>
          <Text className={styles.scriptName}>{fleet.scriptName}</Text>
          <View className={styles.tagsRow}>
            {fleet.isExclusive && <Tag type="exclusive">独家</Tag>}
            {fleet.isFirstPlay && <Tag type="first">首发</Tag>}
            <Tag type={typeTagMap[fleet.scriptType] as any}>{typeLabelMap[fleet.scriptType]}</Tag>
          </View>
        </View>
      </View>

      <View className={styles.cardBody}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>城市</Text>
          <Text className={styles.infoValue}>{fleet.city} · {fleet.store}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>时间</Text>
          <Text className={styles.infoValue}>{fleet.date} {fleet.time}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>车费</Text>
          <Text className={classnames(styles.infoValue, styles.price)}>
            ¥{fleet.priceMin}-{fleet.priceMax}
          </Text>
        </View>
      </View>

      {showProgress && (
        <View className={styles.progressSection}>
          <ProgressBar current={fleet.filledSlots} total={fleet.totalSlots} size="small" />
        </View>
      )}

      <View className={styles.cardFooter}>
        <View className={styles.initiatorInfo}>
          <Image className={styles.avatar} src={fleet.initiator.avatar} mode="aspectFill" />
          <Text className={styles.name}>{fleet.initiator.name}</Text>
        </View>
        <View className={styles.slotsInfo}>
          {remainingSlots > 0 ? (
            <Text>还差 <Text className={styles.highlight}>{remainingSlots}</Text> 人</Text>
          ) : (
            <Text className={styles.highlight}>已满员</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default FleetCard;
