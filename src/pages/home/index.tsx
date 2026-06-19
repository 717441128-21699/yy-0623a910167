import React, { useState, useCallback } from 'react';
import { View, Text, Input, ScrollView, Picker } from '@tarojs/components';
import Taro, { usePullDownRefresh, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import FleetCard from '@/components/FleetCard';
import EmptyState from '@/components/EmptyState';
import { cities, scriptTypeOptions } from '@/data/mockFleets';
import { useFleetStore } from '@/store/fleetStore';
import classnames from 'classnames';

const HomePage: React.FC = () => {
  const fleets = useFleetStore((s) => s.fleets);

  const [currentCity, setCurrentCity] = useState('全部城市');
  const [currentType, setCurrentType] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleRefresh = useCallback(() => {
    console.log('[Home] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  }, []);

  usePullDownRefresh(handleRefresh);

  useDidShow(() => {
    console.log('[Home] 页面显示，当前车队数:', fleets.length);
  });

  const filteredFleets = fleets.filter((fleet) => {
    if (currentCity !== '全部城市' && fleet.city !== currentCity) return false;
    if (currentType !== 'all' && fleet.scriptType !== currentType) return false;
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        fleet.scriptName.toLowerCase().includes(keyword) ||
        fleet.store.toLowerCase().includes(keyword) ||
        fleet.title.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  const handleCityChange = (e: any) => {
    const index = e.detail.value;
    setCurrentCity(cities[index]);
  };

  const handleTypeClick = (type: string) => {
    setCurrentType(type);
  };

  return (
    <View className={styles.homePage}>
      <View className={styles.header}>
        <Picker mode="selector" range={cities} onChange={handleCityChange} className={styles.cityPicker}>
          <View className={styles.cityRow}>
            <View className={styles.cityBtn}>
              <Text className={styles.cityName}>{currentCity}</Text>
              <Text className={styles.arrow}>▼</Text>
            </View>
          </View>
        </Picker>

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索剧本名、店家"
            placeholderClass="search-placeholder"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.filterSection}>
        <ScrollView scrollX className={styles.filterScroll}>
          {scriptTypeOptions.map((type) => (
            <View
              key={type.value}
              className={classnames(styles.filterTag, currentType === type.value && styles.active)}
              onClick={() => handleTypeClick(type.value)}
            >
              <Text>{type.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView scrollY className={styles.listSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>招募中车队</Text>
          <Text className={styles.sectionCount}>共 {filteredFleets.length} 个</Text>
        </View>

        {filteredFleets.length > 0 ? (
          filteredFleets.map((fleet) => <FleetCard key={fleet.id} fleet={fleet} />)
        ) : (
          <EmptyState
            icon="🎭"
            title="暂无符合条件的车队"
            description="换个筛选条件试试，或者自己发布一个车队吧"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default HomePage;
