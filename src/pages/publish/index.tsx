import React, { useState } from 'react';
import { View, Text, Input, Textarea, Picker, Switch, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { cities, tagOptions } from '@/data/mockFleets';
import { ScriptType } from '@/types/fleet';

const typeOptions = [
  { value: 'hardcore', label: '硬核推理', icon: '🧠' },
  { value: 'emotion', label: '情感沉浸', icon: '💕' },
  { value: 'fun', label: '欢乐机制', icon: '🎉' },
  { value: 'terror', label: '恐怖惊悚', icon: '👻' },
  { value: 'mechanism', label: '机制阵营', icon: '⚔️' }
];

const PublishPage: React.FC = () => {
  const [city, setCity] = useState('上海');
  const [store, setStore] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [date, setDate] = useState('2025-06-25');
  const [time, setTime] = useState('14:00');
  const [priceMin, setPriceMin] = useState('188');
  const [priceMax, setPriceMax] = useState('228');
  const [totalSlots, setTotalSlots] = useState(6);
  const [scriptType, setScriptType] = useState<ScriptType>('hardcore');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [remark, setRemark] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const [isFirstPlay, setIsFirstPlay] = useState(false);

  const publishCities = cities.filter(c => c !== '全部城市');
  const cityIndex = publishCities.findIndex(c => c === city);

  const handleCityChange = (e: any) => {
    setCity(publishCities[e.detail.value]);
  };

  const handleDateChange = (e: any) => {
    setDate(e.detail.value);
  };

  const handleTimeChange = (e: any) => {
    setTime(e.detail.value);
  };

  const handleTypeClick = (type: ScriptType) => {
    setScriptType(type);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSlotChange = (delta: number) => {
    const newValue = totalSlots + delta;
    if (newValue >= 3 && newValue <= 12) {
      setTotalSlots(newValue);
    }
  };

  const canSubmit = scriptName && store && date && time && priceMin && priceMax;

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    console.log('[Publish] 提交发布:', {
      city, store, scriptName, date, time,
      priceMin: Number(priceMin), priceMax: Number(priceMax),
      totalSlots, scriptType, selectedTags,
      description, remark, isExclusive, isFirstPlay
    });

    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/myfleets/index'
      });
    }, 1500);
  };

  return (
    <View className={styles.publishPage}>
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>基本信息</View>

          <Picker
            mode="selector"
            range={publishCities}
            value={cityIndex >= 0 ? cityIndex : 0}
            onChange={handleCityChange}
          >
            <View className={styles.formItem}>
              <Text className={styles.itemLabel}>城市</Text>
              <View className={styles.itemContent}>
                <Text className={styles.pickerValue}>{city}</Text>
                <Text className={styles.arrow}>›</Text>
              </View>
            </View>
          </Picker>

          <View className={styles.formItem}>
            <Text className={styles.itemLabel}>店家</Text>
            <View className={styles.itemContent}>
              <Input
                className={styles.input}
                placeholder="请输入店家名称"
                placeholderClass={styles.placeholder}
                value={store}
                onInput={(e) => setStore(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.itemLabel}>剧本名</Text>
            <View className={styles.itemContent}>
              <Input
                className={styles.input}
                placeholder="请输入剧本名称"
                placeholderClass={styles.placeholder}
                value={scriptName}
                onInput={(e) => setScriptName(e.detail.value)}
              />
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>时间与费用</View>

          <Picker mode="date" value={date} onChange={handleDateChange}>
            <View className={styles.formItem}>
              <Text className={styles.itemLabel}>开车日期</Text>
              <View className={styles.itemContent}>
                <Text className={styles.pickerValue}>{date}</Text>
                <Text className={styles.arrow}>›</Text>
              </View>
            </View>
          </Picker>

          <Picker mode="time" value={time} onChange={handleTimeChange}>
            <View className={styles.formItem}>
              <Text className={styles.itemLabel}>开始时间</Text>
              <View className={styles.itemContent}>
                <Text className={styles.pickerValue}>{time}</Text>
                <Text className={styles.arrow}>›</Text>
              </View>
            </View>
          </Picker>

          <View className={styles.formItem}>
            <Text className={styles.itemLabel}>车费区间</Text>
            <View className={styles.itemContent}>
              <View className={styles.priceRange}>
                <Input
                  className={styles.priceInput}
                  type="number"
                  value={priceMin}
                  onInput={(e) => setPriceMin(e.detail.value)}
                />
                <Text className={styles.priceSeparator}>-</Text>
                <Input
                  className={styles.priceInput}
                  type="number"
                  value={priceMax}
                  onInput={(e) => setPriceMax(e.detail.value)}
                />
                <Text className={styles.priceUnit}>元</Text>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.itemLabel}>总人数</Text>
            <View className={styles.itemContent}>
              <View className={styles.slotPicker}>
                <View
                  className={classnames(styles.slotBtn, totalSlots <= 3 && styles.disabled)}
                  onClick={() => handleSlotChange(-1)}
                >
                  <Text>－</Text>
                </View>
                <Text className={styles.slotValue}>{totalSlots}</Text>
                <View
                  className={classnames(styles.slotBtn, totalSlots >= 12 && styles.disabled)}
                  onClick={() => handleSlotChange(1)}
                >
                  <Text>＋</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className={classnames(styles.formSection, styles.typeSection)}>
          <View className={styles.sectionTitle}>剧本类型</View>
          <View className={styles.typeGrid}>
            {typeOptions.map(type => (
              <View
                key={type.value}
                className={classnames(styles.typeItem, scriptType === type.value && styles.active)}
                onClick={() => handleTypeClick(type.value as ScriptType)}
              >
                <Text className={styles.typeIcon}>{type.icon}</Text>
                <Text className={styles.typeName}>{type.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={classnames(styles.formSection, styles.tagsSection)}>
          <View className={styles.sectionTitle}>标签偏好</View>
          <View className={styles.tagsContainer}>
            {tagOptions.map(tag => (
              <View
                key={tag}
                className={classnames(styles.tagItem, selectedTags.includes(tag) && styles.active)}
                onClick={() => handleTagClick(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={classnames(styles.formSection, styles.switchSection)}>
          <View className={styles.sectionTitle}>特殊标记</View>
          <View className={styles.switchItem}>
            <View className={styles.switchLabel}>
              <Text className={styles.switchIcon}>⭐</Text>
              <Text className={styles.switchText}>独家本</Text>
            </View>
            <Switch
              checked={isExclusive}
              onChange={(e) => setIsExclusive(e.detail.value)}
              color="#7B61FF"
            />
          </View>
          <View className={styles.switchItem}>
            <View className={styles.switchLabel}>
              <Text className={styles.switchIcon}>🚀</Text>
              <Text className={styles.switchText}>首发本</Text>
            </View>
            <Switch
              checked={isFirstPlay}
              onChange={(e) => setIsFirstPlay(e.detail.value)}
              color="#7B61FF"
            />
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>补充说明</View>
          <View className={classnames(styles.formItem, styles.textareaItem)}>
            <Text className={styles.itemLabel}>车队描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="介绍一下你的车队，比如对玩家的要求、注意事项等"
              placeholderClass={styles.placeholder}
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          <Text>发布车队</Text>
        </View>
      </View>
    </View>
  );
};

export default PublishPage;
