import { defineStore } from 'pinia';
import type { TimeLineStateType, ScaleInfo } from './index.type';

export const useTimeLineStore = defineStore('useTimeLineStore', {
  state: (): TimeLineStateType => ({
    scaleInfo: {
      sliderKeys: [],
      scale: 0,
      scaleSmallCellWidth: 20, // px
      scaleLargeCellWidth: 100, // px
      scaleSmallCellMs: 40 // ms
    }
  }),
  getters: {
    getScaleInfo(): TimeLineStateType['scaleInfo'] {
      // console.warn('getScaleInfo------>', this.scaleInfo);
      return this.scaleInfo;
    }
  },
  actions: {
    setScaleInfo(scaleInfo: ScaleInfo) {
      Object.assign(this.scaleInfo, scaleInfo);
    }
  }
});
