import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '../Tag';
import ProgressBar from '../ProgressBar';
import { Fleet, ScriptType, RoleSlot, FleetMember } from '@/types/fleet';

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

const getConfirmedCount = (fleet: Fleet): number => {
  return fleet.members.filter((m) => m.status === 'confirmed').length;
};

const getEmptyRoles = (fleet: Fleet): RoleSlot[] => {
  const assignedRoleIds = new Set(fleet.roleAssignments.filter((a) => a.status === 'confirmed').map((a) => a.roleId));
  return fleet.roleSlots.filter((r) => !assignedRoleIds.has(r.id));
};

const getGapByGender = (emptyRoles: RoleSlot[]) => {
  const male = emptyRoles.filter((r) => r.gender === 'male').length;
  const female = emptyRoles.filter((r) => r.gender === 'female').length;
  const any = emptyRoles.filter((r) => r.gender === 'any').length;
  return { male, female, any };
};

const FleetCard: React.FC<FleetCardProps> = ({ fleet, className, showProgress = true }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/fleet-detail/index?id=${fleet.id}`
    });
  };

  const confirmedCount = getConfirmedCount(fleet);
  const emptyRoles = getEmptyRoles(fleet);
  const gaps = getGapByGender(emptyRoles);

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
          <ProgressBar current={confirmedCount} total={fleet.totalPlayers} size="small" />
        </View>
      )}

      {fleet.roleSlots.length > 0 && emptyRoles.length > 0 && (
        <View className={styles.roleHint}>
          <View className={styles.genderGapRow}>
            {gaps.male > 0 && (
              <View className={classnames(styles.genderGapItem, styles.male)}>
                <Text>♂ 缺{gaps.male}男角</Text>
              </View>
            )}
            {gaps.female > 0 && (
              <View className={classnames(styles.genderGapItem, styles.female)}>
                <Text>♀ 缺{gaps.female}女角</Text>
              </View>
            )}
            {gaps.any > 0 && (
              <View className={classnames(styles.genderGapItem, styles.any)}>
                <Text>○ 缺{gaps.any}不限</Text>
              </View>
            )}
          </View>
          <View className={styles.roleNameRow}>
            <Text className={styles.roleHintLabel}>缺：</Text>
            {emptyRoles.slice(0, 3).map((role) => (
              <Text key={role.id} className={styles.roleHintItem}>
                {role.name}{role.gender !== 'any' ? (role.gender === 'male' ? '♂' : '♀') : ''}
              </Text>
            ))}
            {emptyRoles.length > 3 && (
              <Text className={styles.roleHintMore}>+{emptyRoles.length - 3}</Text>
            )}
          </View>
        </View>
      )}

      <View className={styles.cardFooter}>
        <View className={styles.initiatorInfo}>
          <Image className={styles.avatar} src={fleet.initiator.avatar} mode="aspectFill" />
          <Text className={styles.name}>{fleet.initiator.name}</Text>
        </View>
        <View className={styles.slotsInfo}>
          {fleet.neededPlayers > 0 ? (
            <Text>还差 <Text className={styles.highlight}>{fleet.neededPlayers}</Text> 人</Text>
          ) : (
            <Text className={styles.highlight}>已满员</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default FleetCard;
