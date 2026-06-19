import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  size?: 'normal' | 'small';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label = '成团进度',
  size = 'normal',
  className
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <View className={classnames(styles.progressBar, size === 'small' && styles.small, className)}>
      <View className={styles.progressInfo}>
        <Text className={styles.progressLabel}>{label}</Text>
        <Text className={styles.progressCount}>{current}/{total}人</Text>
      </View>
      <View className={styles.progressTrack}>
        <View className={styles.progressFill} style={{ width: `${percentage}%` }} />
      </View>
    </View>
  );
};

export default ProgressBar;
