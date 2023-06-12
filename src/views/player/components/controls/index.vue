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
        :total-time="1000000"
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
import { usePlayerStore } from '@/store';
import PlayerControlsBtn from '@/components/module/player/PlayerControlsBtn.vue';
import PlayerProgressBar from '@/components/module/player/PlayerProgressBar.vue';
import type { ControlListOptions, SelectMixOption } from '@/components/module/player/PlayerControlsBtn.vue';
defineOptions({ name: 'PlayerControls' });
const playerStore = usePlayerStore();
const { getIsFullscreenState, getProportion, getSpeed } = storeToRefs(playerStore);
const playerCurrentTime = ref<number>(0);
const playerPlaying = ref<boolean>(false);
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
/**
 * 播放
 */
const playerPlay = () => {
  playerPlaying.value = !playerPlaying.value;
};
/**
 * 暂停
 */
const playerPause = () => {
  playerPlaying.value = !playerPlaying.value;
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
</script>

<style scoped></style>
