import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Switch } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFleetStore } from '@/store/fleetStore';
import { Fleet } from '@/types/fleet';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const fleetId = router.params.id;
  const getFleetById = useFleetStore((s) => s.getFleetById);
  const addMember = useFleetStore((s) => s.addMember);

  const [fleet, setFleet] = useState<Fleet | null>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [availableTime, setAvailableTime] = useState('');
  const [rolePreference, setRolePreference] = useState('');
  const [canCrossPlay, setCanCrossPlay] = useState(false);
  const [hasReadSeries, setHasReadSeries] = useState(false);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    const found = getFleetById(fleetId || '');
    if (found) {
      setFleet(found);
    }
  }, [fleetId, getFleetById]);

  const canSubmit = name && availableTime;

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写必填信息', icon: 'none' });
      return;
    }
    if (!fleetId) {
      Taro.showToast({ title: '参数错误', icon: 'none' });
      return;
    }

    addMember(fleetId, {
      name,
      gender,
      availableTime,
      rolePreference,
      canCrossPlay,
      hasReadSeries,
      remark
    });

    Taro.showModal({
      title: '报名成功',
      content: '已提交报名申请，请等待发起人确认。你可以在"我的车队-我参与的"中查看状态。',
      showCancel: false,
      confirmText: '知道了',
      success: () => {
        Taro.navigateBack();
      }
    });
  };

  if (!fleet) {
    return (
      <View className={styles.signupPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const safeRoleSlots = Array.isArray(fleet.roleSlots) ? fleet.roleSlots : [];

  return (
    <View className={styles.signupPage}>
      <View className={styles.fleetInfo}>
        <View className={styles.fleetDetail}>
          <Text className={styles.scriptName}>{fleet.scriptName}</Text>
          <Text className={styles.fleetMeta}>
            {fleet.date} {fleet.time} · {fleet.city} {fleet.store}
          </Text>
        </View>
        <Text className={styles.fleetPrice}>¥{fleet.priceMin}起</Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.itemLabel}>
            <Text className={styles.required}>*</Text>昵称
          </Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入你的昵称"
              value={name}
              onInput={(e) => setName(e.detail.value)}
              maxlength={20}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.itemLabel}>
            <Text className={styles.required}>*</Text>性别
          </Text>
          <View className={styles.genderOptions}>
            <View
              className={classnames(styles.genderOption, gender === 'male' && styles.active)}
              onClick={() => setGender('male')}
            >
              <Text className={styles.genderIcon}>♂</Text>
              <Text>男</Text>
            </View>
            <View
              className={classnames(styles.genderOption, gender === 'female' && styles.active)}
              onClick={() => setGender('female')}
            >
              <Text className={styles.genderIcon}>♀</Text>
              <Text>女</Text>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.itemLabel}>
            <Text className={styles.required}>*</Text>可到时间
          </Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="如：14:00 准时到 / 可能晚到10分钟"
              value={availableTime}
              onInput={(e) => setAvailableTime(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>角色意向</Text>

        <View className={styles.formItem}>
          <Text className={styles.itemLabel}>意向角色</Text>
          {safeRoleSlots.length > 0 && (
            <View className={styles.roleOptions}>
              {safeRoleSlots.map((role) => {
                const isSelected = rolePreference === role.name;
                return (
                  <View
                    key={role.id}
                    className={classnames(styles.roleOption, isSelected && styles.roleActive)}
                    onClick={() => setRolePreference(isSelected ? '' : role.name)}
                  >
                    <Text>{role.name}</Text>
                    <Text className={styles.roleGenderHint}>
                      {role.gender === 'male' ? '♂' : role.gender === 'female' ? '♀' : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="或手动输入想玩的角色（选填）"
              value={rolePreference}
              onInput={(e) => setRolePreference(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <View className={styles.switchItem}>
            <Text className={styles.switchLabel}>
              是否接受反串
              <Text className={styles.switchDesc}>（女生玩男角/男生玩女角）</Text>
            </Text>
            <Switch checked={canCrossPlay} onChange={(e) => setCanCrossPlay(e.detail.value)} color="#7B61FF" />
          </View>
          <View className={styles.switchItem}>
            <Text className={styles.switchLabel}>
              是否已读同系列作品
              <Text className={styles.switchDesc}>（避免剧透/影响体验）</Text>
            </Text>
            <Switch checked={hasReadSeries} onChange={(e) => setHasReadSeries(e.detail.value)} color="#7B61FF" />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>补充说明</Text>
        <View className={styles.formItem}>
          <Textarea
            className={styles.textarea}
            placeholder="有什么想对发起人说的？（选填）"
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            maxlength={200}
          />
        </View>
      </View>

      <View className={styles.tipsSection}>
        <Text className={styles.tipsTitle}>温馨提示</Text>
        <View className={styles.tipsList}>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>•</Text>
            <Text>报名后状态默认为"待确认"，请等待发起人审核</Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>•</Text>
            <Text>发起人通过后，你需要在"我的"页面确认能否到场</Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>•</Text>
            <Text>如临时有事无法到场，请提前告知发起人</Text>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          <Text>提交报名</Text>
        </View>
      </View>
    </View>
  );
};

export default SignupPage;
