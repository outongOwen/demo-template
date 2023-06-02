import Mp4Plugin from 'xgplayer-mp4';
import { useThemeStore } from '@/store';
export class CustomExtPreset {
  plugins: (typeof Mp4Plugin)[];

  constructor(_options: any, playerConfig: any) {
    const themeStore = useThemeStore();
    this.plugins = [Mp4Plugin]; // 使用的插件
    // 统一修改播放器配置
    playerConfig.commonStyle = {
      // 进度条底色
      // progressColor: themeStore.getThemeColor,
      // 播放完成部分进度条底色
      playedColor: themeStore.getThemeColor,
      // 缓存部分进度条底色
      // cachedColor: '',
      // 进度条滑块样式
      // sliderBtnStyle: {},
      // 音量颜色
      volumeColor: themeStore.getThemeColor
    };
    playerConfig.mp4plugin = {
      maxBufferLength: 30,
      minBufferLength: 10
    };
    playerConfig.playbackRate = [0.5, 0.75, 1, 1.5, 2];
  }
}
