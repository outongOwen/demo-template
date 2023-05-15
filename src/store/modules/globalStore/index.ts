import { defineStore } from 'pinia';
import type { GlobalStateType } from './types';

export const useGlobalStore = defineStore('useGlobalStore', {
  state: (): GlobalStateType => ({
    testSelect: true
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
