import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { MemberStatus } from '@/types/fleet';

export interface StatusBadgeProps {
  status: MemberStatus;
  className?: string;
}

const statusTextMap: Record<MemberStatus, string> = {
  confirmed: '已上车',
  pending: '待确认',
  waitlist: '候补'
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <View className={classnames(styles.statusBadge, styles[status], className)}>
      <Text>{statusTextMap[status]}</Text>
    </View>
  );
};

export default StatusBadge;
