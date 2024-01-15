import { defineStore } from 'pinia';
import type { GlobalStateType } from './index.type';

export const useGlobalStore = defineStore('useGlobalStore', {
  state: (): GlobalStateType => ({
    testSelect: false,
    is3v3AuthStatus: false
  }),
  getters: {
    getTestSelect(): boolean {
      return this.testSelect;
    },
    getIs3v3Status(): boolean {
      return this.is3v3AuthStatus;
    }
  },
  actions: {
    setTestSelect(testSelect: boolean) {
      this.testSelect = testSelect;
    },
    setIs3v3Status(is3v3AuthStatus: boolean) {
      this.is3v3AuthStatus = is3v3AuthStatus;
    }
  }
});
