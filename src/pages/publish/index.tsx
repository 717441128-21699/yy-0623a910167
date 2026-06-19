import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Picker, Switch, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { cities, tagOptions, defaultRoleTemplates } from '@/data/mockFleets';
import { useFleetStore } from '@/store/fleetStore';
import { ScriptType, RoleSlot, RoleGender } from '@/types/fleet';

const typeOptions = [
  { value: 'hardcore', label: '硬核推理', icon: '🧠' },
  { value: 'emotion', label: '情感沉浸', icon: '💕' },
  { value: 'fun', label: '欢乐机制', icon: '🎉' },
  { value: 'terror', label: '恐怖惊悚', icon: '👻' },
  { value: 'mechanism', label: '机制阵营', icon: '⚔️' }
];

const generateId = () => Math.random().toString(36).substring(2, 10);

const PublishPage: React.FC = () => {
  const addFleet = useFleetStore((s) => s.addFleet);

  const [city, setCity] = useState('上海');
  const [store, setStore] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [date, setDate] = useState('2025-06-25');
  const [time, setTime] = useState('14:00');
  const [priceMin, setPriceMin] = useState('188');
  const [priceMax, setPriceMax] = useState('228');
  const [totalPlayers, setTotalPlayers] = useState(6);
  const [neededPlayers, setNeededPlayers] = useState(4);
  const [scriptType, setScriptType] = useState<ScriptType>('hardcore');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [remark, setRemark] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const [isFirstPlay, setIsFirstPlay] = useState(false);

  const initialRoles = useMemo(() => {
    const template = defaultRoleTemplates[scriptType] || defaultRoleTemplates.other;
    return template.slice(0, totalPlayers).map((r) => ({
      id: generateId(),
      name: r.name,
      gender: r.gender as RoleGender,
      description: ''
    }));
  }, []);

  const [roleSlots, setRoleSlots] = useState<RoleSlot[]>(initialRoles);

  const publishCities = cities.filter((c) => c !== '全部城市');
  const cityIndex = publishCities.findIndex((c) => c === city);

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
    const template = defaultRoleTemplates[type] || defaultRoleTemplates.other;
    const newRoles = template.slice(0, totalPlayers).map((r) => ({
      id: generateId(),
      name: r.name,
      gender: r.gender as RoleGender,
      description: ''
    }));
    setRoleSlots(newRoles);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTotalChange = (delta: number) => {
    const newTotal = totalPlayers + delta;
    if (newTotal >= 3 && newTotal <= 12) {
      setTotalPlayers(newTotal);
      if (neededPlayers > newTotal - 1) {
        setNeededPlayers(Math.max(1, newTotal - 1));
      }
      const template = defaultRoleTemplates[scriptType] || defaultRoleTemplates.other;
      if (newTotal > roleSlots.length) {
        const extra = template.slice(roleSlots.length, newTotal).map((r) => ({
          id: generateId(),
          name: r.name,
          gender: r.gender as RoleGender,
          description: ''
        }));
        setRoleSlots([...roleSlots, ...extra]);
      } else if (newTotal < roleSlots.length) {
        setRoleSlots(roleSlots.slice(0, newTotal));
      }
    }
  };

  const handleNeededChange = (delta: number) => {
    const newValue = neededPlayers + delta;
    if (newValue >= 1 && newValue <= totalPlayers - 1) {
      setNeededPlayers(newValue);
    }
  };

  const handleRoleNameChange = (index: number, value: string) => {
    const updated = [...roleSlots];
    updated[index] = { ...updated[index], name: value };
    setRoleSlots(updated);
  };

  const handleRoleGenderChange = (index: number) => {
    const updated = [...roleSlots];
    const order: RoleGender[] = ['any', 'male', 'female'];
    const curIdx = order.indexOf(updated[index].gender);
    updated[index] = { ...updated[index], gender: order[(curIdx + 1) % 3] };
    setRoleSlots(updated);
  };

  const handleAddRole = () => {
    if (roleSlots.length < 12) {
      const template = defaultRoleTemplates[scriptType] || defaultRoleTemplates.other;
      const templateRole = template[roleSlots.length] || { name: `角色${roleSlots.length + 1}`, gender: 'any' as RoleGender };
      setRoleSlots([
        ...roleSlots,
        { id: generateId(), name: templateRole.name, gender: templateRole.gender as RoleGender, description: '' }
      ]);
      setTotalPlayers(roleSlots.length + 1);
    }
  };

  const handleRemoveRole = (index: number) => {
    if (roleSlots.length > 3) {
      const updated = roleSlots.filter((_, i) => i !== index);
      setRoleSlots(updated);
      setTotalPlayers(updated.length);
      if (neededPlayers > updated.length - 1) {
        setNeededPlayers(Math.max(1, updated.length - 1));
      }
    }
  };

  const canSubmit = scriptName && store && date && time && priceMin && priceMax;

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const newFleet = addFleet({
      city,
      store,
      scriptName,
      date,
      time,
      priceMin: Number(priceMin),
      priceMax: Number(priceMax),
      totalPlayers,
      neededPlayers,
      scriptType,
      tags: selectedTags,
      description,
      remark,
      isExclusive,
      isFirstPlay,
      roleSlots
    });

    console.log('[Publish] 发布成功:', newFleet.id, newFleet.scriptName);

    Taro.showToast({ title: '发布成功', icon: 'success' });

    setTimeout(() => {
      Taro.switchTab({ url: '/pages/myfleets/index' });
    }, 1200);
  };

  const genderLabel = (g: RoleGender) => (g === 'male' ? '♂' : g === 'female' ? '♀' : '不限');

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
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>人数</View>

          <View className={styles.formItem}>
            <Text className={styles.itemLabel}>总人数</Text>
            <View className={styles.itemContent}>
              <View className={styles.slotPicker}>
                <View
                  className={classnames(styles.slotBtn, totalPlayers <= 3 && styles.disabled)}
                  onClick={() => handleTotalChange(-1)}
                >
                  <Text>－</Text>
                </View>
                <Text className={styles.slotValue}>{totalPlayers}</Text>
                <View
                  className={classnames(styles.slotBtn, totalPlayers >= 12 && styles.disabled)}
                  onClick={() => handleTotalChange(1)}
                >
                  <Text>＋</Text>
                </View>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.itemLabel}>缺口人数</Text>
            <View className={styles.itemContent}>
              <View className={styles.slotPicker}>
                <View
                  className={classnames(styles.slotBtn, neededPlayers <= 1 && styles.disabled)}
                  onClick={() => handleNeededChange(-1)}
                >
                  <Text>－</Text>
                </View>
                <Text className={styles.slotValue}>{neededPlayers}</Text>
                <View
                  className={classnames(styles.slotBtn, neededPlayers >= totalPlayers - 1 && styles.disabled)}
                  onClick={() => handleNeededChange(1)}
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
            {typeOptions.map((type) => (
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

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            角色位设置
            <Text style={{ fontSize: 22, color: '#86909C', fontWeight: 400, marginLeft: 12 }}>
              点击性别可切换：不限 ♂ → ♀
            </Text>
          </View>

          <View className={styles.roleList}>
            {roleSlots.map((role, index) => (
              <View key={role.id} className={styles.roleItem}>
                <Text className={styles.roleIndex}>{index + 1}</Text>
                <Input
                  className={styles.roleNameInput}
                  value={role.name}
                  onInput={(e) => handleRoleNameChange(index, e.detail.value)}
                />
                <View
                  className={classnames(
                    styles.roleGenderBtn,
                    role.gender === 'male' && styles.genderMale,
                    role.gender === 'female' && styles.genderFemale
                  )}
                  onClick={() => handleRoleGenderChange(index)}
                >
                  <Text>{genderLabel(role.gender)}</Text>
                </View>
                <View
                  className={classnames(styles.roleRemoveBtn, roleSlots.length <= 3 && styles.disabled)}
                  onClick={() => handleRemoveRole(index)}
                >
                  <Text>×</Text>
                </View>
              </View>
            ))}

            {roleSlots.length < 12 && (
              <View className={styles.roleAddBtn} onClick={handleAddRole}>
                <Text>＋ 添加角色位</Text>
              </View>
            )}
          </View>
        </View>

        <View className={classnames(styles.formSection, styles.tagsSection)}>
          <View className={styles.sectionTitle}>标签偏好</View>
          <View className={styles.tagsContainer}>
            {tagOptions.map((tag) => (
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
            <Switch checked={isExclusive} onChange={(e) => setIsExclusive(e.detail.value)} color="#7B61FF" />
          </View>
          <View className={styles.switchItem}>
            <View className={styles.switchLabel}>
              <Text className={styles.switchIcon}>🚀</Text>
              <Text className={styles.switchText}>首发本</Text>
            </View>
            <Switch checked={isFirstPlay} onChange={(e) => setIsFirstPlay(e.detail.value)} color="#7B61FF" />
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
