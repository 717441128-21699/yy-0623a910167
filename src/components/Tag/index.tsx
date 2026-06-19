import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface TagProps {
  type?: 'default' | 'primary' | 'hardcore' | 'emotion' | 'fun' | 'terror' | 'mechanism' | 'exclusive' | 'first';
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ type = 'default', children, className }) => {
  return (
    <View className={classnames(styles.tag, styles[type], className)}>
      <Text>{children}</Text>
    </View>
  );
};

export default Tag;
