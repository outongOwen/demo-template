<!--
 * @abstract:播放器控件
 * @author: owenTong
 * @since: 2023-06-01
 * index.vue
-->
<template>
  <div class="w100% flex flex-col">
    <div class="h50px w100%">
      <player-progress-bar
        v-model:time="playerCurrentTime"
        :total-time="getTimeLineMaxEndTime"
        :frame-rate="playerSettings.frameRate"
        @change="handlePlayerTimeChange"
      />
    </div>
    <div class="h28px w100%">
      <player-controls-btn
        v-model:speed="playerSpeed"
        v-model:proportion="playerProportion"
        :is-fullscreen="getIsFullscreenState"
        :playing="playerPlaying"
        :control-list-options="controlListOptions"
        @speed-change="handleSpeedChange"
        @proportion-change="handleProportionChange"
        @css-fullscreen-change="handleCssFullscreenChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { playerSettings } from '@/settings';
import { usePlayerStore, useTimeLineStore } from '@/store';
import type { ControlListOptions, SelectMixOption } from './button/index.vue';
import PlayerControlsBtn from './button/index.vue';
import PlayerProgressBar from './progress/index.vue';
defineOptions({ name: 'PlayerControls' });
const playerStore = usePlayerStore();
const timeLineStore = useTimeLineStore();
const { getIsFullscreenState, getProportion, getSpeed, getPlayerState } = storeToRefs(playerStore);
const { getTimeLineMaxEndTime } = storeToRefs(timeLineStore);
const playerCurrentTime = ref<number>(0);
const playerSpeed = computed({
  set: (value: number) => {
    playerStore.setSpeed(value);
  },
  get: (): number => {
    return getSpeed.value;
  }
});
const playerProportion = computed({
  set: (value: string) => {
    playerStore.setProportion(value);
  },
  get: (): string => {
    return getProportion.value;
  }
});
const playerPlaying = computed(() => {
  return getPlayerState.value.playing && !getPlayerState.value.waiting;
});
/**
 * 播放
 */
const playerPlay = () => {
  const result = timeLineStore.timeLineRef?.play({
    // toTime: unref(getTimeLineMaxEndTime)
    autoEnd: true
  });
  console.log(result);
};
/**
 * 暂停
 */
const playerPause = () => {
  timeLineStore.timeLineRef?.pause();
};
/**
 * seek
 */
const playerSeek = (time?: number) => {
  console.log(time);
};
/**
 * 控制按钮列表
 */
const controlListOptions: ControlListOptions[] = [
  {
    title: '后退1帧',
    icon: 'ic:outline-skip-previous',
    type: 'seek',
    time: -1,
    event: playerSeek
  },
  {
    title: '后退5帧',
    icon: 'ic:baseline-skip-previous',
    type: 'seek',
    time: -5,
    event: playerSeek
  },
  {
    title: '后退1秒',
    icon: 'dashicons:controls-skipback',
    type: 'seek',
    time: -25,
    event: playerSeek
  },
  {
    title: '暂停',
    icon: 'mdi:pause',
    type: 'pause',
    event: playerPause
  },
  {
    title: '播放',
    icon: 'mdi:play',
    type: 'play',
    event: playerPlay
  },
  {
    title: '前进1秒',
    icon: 'dashicons:controls-skipforward',
    type: 'seek',
    time: 25,
    event: playerSeek
  },
  {
    title: '前进5帧',
    icon: 'ic:baseline-skip-next',
    type: 'seek',
    time: 5,
    event: playerSeek
  },
  {
    title: '前进1帧',
    icon: 'ic:outline-skip-next',
    type: 'seek',
    time: 1,
    event: playerSeek
  }
];
const handleSpeedChange = (key: number, option: any) => {
  console.log(key, option);
};
const handleProportionChange = (_key: string, option: SelectMixOption) => {
  playerStore.setResolution(option.resolution);
};
const handleCssFullscreenChange = (state: boolean) => {
  playerStore.setFullscreenState(state);
};
/**
 * 播放器时间更新
 */
const handlePlayerTimeChange = () => {
  timeLineStore.timeLineRef?.pause();
  // 时间更新相关操作
  timeLineStore.timeLineRef && timeLineStore.timeLineRef.setTime(playerCurrentTime.value);
};
const handlerPlay = () => {
  playerStore.setPlayerState({
    playing: true
  });
};
const handlerPause = () => {
  playerStore.setPlayerState({
    playing: false
  });
};
const handlerSetTimeByTick = ({ time }) => {
  playerCurrentTime.value = time;
};
const handlerAfterSetTime = ({ time }) => {
  playerCurrentTime.value = time;
};
// 封装销毁订阅事件
const destroyListener = () => {
  if (timeLineStore.timeLineRef) {
    // 检查是否存在
    timeLineStore.timeLineRef?.pause();
    timeLineStore.timeLineRef?.listener.off('play', handlerPlay);
    timeLineStore.timeLineRef?.listener.off('paused', handlerPause);
    timeLineStore.timeLineRef?.listener.off('setTimeByTick', handlerSetTimeByTick);
    timeLineStore.timeLineRef?.listener.off('afterSetTime', handlerAfterSetTime);
  }
};
/**
 * 销毁订阅事件
 */
watch(
  () => timeLineStore.timeLineRef,
  timeLineRef => {
    if (!timeLineRef) return;
    destroyListener();
    timeLineRef.listener.on('play', handlerPlay);
    timeLineRef.listener.on('paused', handlerPause);
    timeLineRef.listener.on('setTimeByTick', handlerSetTimeByTick);
    timeLineRef.listener.on('afterSetTime', handlerAfterSetTime);
  },
  {
    immediate: true,
    flush: 'post'
  }
);
onBeforeUnmount(() => {
  destroyListener();
});
</script>

<style scoped></style>
