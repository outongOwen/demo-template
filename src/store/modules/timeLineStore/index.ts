import { defineStore } from 'pinia';
import type { TimeLineStateType } from './index.type';

export const useTimeLineStore = defineStore('useTimeLineStore', {
  state: (): TimeLineStateType => ({
    timeLineRefs: null
  }),
  getters: {
    geTimeLineRefs(): TimeLineStateType['timeLineRefs'] {
      return this.timeLineRefs;
    }
  },
  actions: {
    setTimeLineRefs(timeLineRefs: TimeLineStateType['timeLineRefs']) {
      this.timeLineRefs = timeLineRefs;
    }
  }
});
