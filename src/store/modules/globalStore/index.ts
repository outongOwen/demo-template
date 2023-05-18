import { defineStore } from 'pinia';
import type { GlobalStateType } from './index.type';

export const useGlobalStore = defineStore('useGlobalStore', {
  state: (): GlobalStateType => ({
    testSelect: false
  }),
  getters: {
    getTestSelect(state) {
      return state.testSelect;
    }
  },
  actions: {
    setTestSelect(testSelect: boolean) {
      this.testSelect = testSelect;
    }
  }
});
