import { defineStore } from 'pinia';
import { playerSettings } from '@/settings';
import type { PlayerType, PlayerState } from './index.type';
const { proportion, defaultResolution, speed } = playerSettings;
export const usePlayerStore = defineStore('usePlayerStore', {
  state: (): PlayerType => ({
    isFullscreen: false,
    proportion,
    resolution: defaultResolution,
    speed,
    playerState: {
      isPlaying: false
    }
  }),
  getters: {
    // 获取全屏状态
    getIsFullscreenState(): boolean {
      return this.isFullscreen;
    },
    // 获取比例
    getProportion(): string {
      return this.proportion;
    },
    // 获取分辨率
    getResolution(): Player.Resolution {
      return this.resolution;
    },
    // 获取倍速
    getSpeed(): number {
      return this.speed;
    },
    // 获取播放状态
    getPlayerState(): PlayerState {
      return this.playerState;
    }
  },
  actions: {
    // 切换全屏状态
    setFullscreenState(isFullscreen: boolean) {
      this.isFullscreen = isFullscreen;
    },
    // 设置比例
    setProportion(proportionValue: string) {
      this.proportion = proportionValue;
    },
    // 设置分辨率
    setResolution(resolutionValue: Player.Resolution) {
      this.resolution = resolutionValue;
    },
    // 设置倍速
    setSpeed(speedValue: number) {
      this.speed = speedValue;
    },
    // 设置播放状态
    setPlayerState({ isPlaying }: PlayerState) {
      this.playerState.isPlaying = isPlaying;
    }
  }
});
