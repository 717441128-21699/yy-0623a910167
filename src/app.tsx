import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import './app.scss';
import { useFleetStore } from '@/store/fleetStore';
import { mockFleets } from '@/data/mockFleets';

function App(props) {
  const initStore = useFleetStore((state) => {
    return state.fleets.length === 0;
  });

  useEffect(() => {
    const state = useFleetStore.getState();
    if (state.fleets.length === 0) {
      console.log('[App] 初始化车队数据，加载 mock 数据');
      useFleetStore.setState({ fleets: [...mockFleets] });
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
