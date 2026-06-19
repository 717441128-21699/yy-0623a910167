import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import './app.scss';
import { useFleetStore } from '@/store/fleetStore';
import { mockFleets } from '@/data/mockFleets';

const STORE_VERSION = 'v2';

function App(props) {
  useEffect(() => {
    const state = useFleetStore.getState();
    const storedVer = localStorage.getItem('fleet-version');
    if (state.fleets.length === 0 || storedVer !== STORE_VERSION) {
      console.log('[App] 初始化/升级车队数据，加载 mock 数据');
      useFleetStore.setState({ fleets: [...mockFleets] });
      localStorage.setItem('fleet-version', STORE_VERSION);
    }
  }, []);

  useDidShow(() => {
    console.log('[App] App Show');
  });

  useDidHide(() => {
    console.log('[App] App Hide');
  });

  return props.children;
}

export default App;
