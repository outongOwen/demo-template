import { defineStore } from 'pinia';
import type { TimelineExpose } from '@/plugins/timeLine';
import type { TimeLineStateType, ScaleInfo } from './index.type';
export const useTimeLineStore = defineStore('useTimeLineStore', {
  state: (): TimeLineStateType => ({
    timeLineRef: null,
    scaleInfo: {
      scale: 0,
      scaleStep: 0.01,
      scaleSmallCellWidth: 20, // px
      scaleLargeCellWidth: 100, // px
      scaleSmallCellMs: 40 // ms
    }
  }),
  getters: {
    //  获取时间轴缩放信息
    getScaleInfo(): ScaleInfo {
      return this.scaleInfo;
    }
  },
  actions: {
    // 设置时间轴实例
    setTimeLineRef(timeLineRef: TimelineExpose | null) {
      this.timeLineRef = timeLineRef;
    },
    //  设置时间轴缩放信息
    setScaleInfo(scaleInfo: ScaleInfo) {
      Object.assign(this.scaleInfo, scaleInfo);
    }
  }
});
