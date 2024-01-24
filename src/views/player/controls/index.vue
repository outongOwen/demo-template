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
        :total-time="125280"
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
import { watchOnce } from '@vueuse/core';
import { playerSettings } from '@/settings';
import { usePlayerStore, useTimeLineStore } from '@/store';
import type { ControlListOptions, SelectMixOption } from './button/index.vue';
import PlayerControlsBtn from './button/index.vue';
import PlayerProgressBar from './progress/index.vue';
defineOptions({ name: 'PlayerControls' });
const playerStore = usePlayerStore();
const timeLineStore = useTimeLineStore();
const { getIsFullscreenState, getProportion, getSpeed, getPlayerState } = storeToRefs(playerStore);
const playerCurrentTime = ref<number>(0);
// const playerPlaying = ref<boolean>(false);
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
  return getPlayerState.value.isPlaying;
});
/**
 * 播放
 */
const playerPlay = () => {
  const result = timeLineStore.timeLineRef?.play();
  result &&
    playerStore.setPlayerState({
      isPlaying: true
    });
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
const handlePlayerTimeChange = (_time: number) => {
  // 时间更新相关操作
  // console.log(time, 'time');
};
watchOnce(
  () => timeLineStore.timeLineRef,
  timeLineRef => {
    if (!timeLineRef) return;
    timeLineRef?.listener.on('paused', () => {
      playerStore.setPlayerState({
        isPlaying: false
      });
    });
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  if (timeLineStore.timeLineRef) {
    timeLineStore.timeLineRef?.pause();
    timeLineStore.timeLineRef?.listener.off('paused');
  }
});
</script>

<style scoped></style>
