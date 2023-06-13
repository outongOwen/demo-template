import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import { playerSettings } from '@/settings';
import { getNaiveThemeOverrides, initThemeSettings } from './helpers';
export const useThemeStore = defineStore('ThemeStore', {
  state: (): Theme.Setting => initThemeSettings(),
  getters: {
    /** naiveUI的主题配置 */
    naiveThemeOverrides(state) {
      const overrides = getNaiveThemeOverrides({ primary: state.themeColor, ...state.otherColor });
      return overrides;
    },
    /** naive-ui暗黑主题 */
    naiveTheme(state) {
      return state.darkMode ? darkTheme : undefined;
    },
    /** 获取主题色 */
    getThemeColor(state) {
      return state.themeColor;
    },
    /** 获取播放器配置 */
    getPlayerSettings() {
      playerSettings.controls = {
        ...playerSettings.controls,
        ...{
          borderColor: this.themeColor,
          cornerColor: this.themeColor,
          cornerStrokeColor: this.themeColor
        }
      };
      return playerSettings;
    }
  },
  actions: {
    /** 设置暗黑模式 */
    setDarkMode(darkMode: boolean) {
      this.darkMode = darkMode;
    },
    /** 设置自动跟随系统主题 */
    setFollowSystemTheme(visible: boolean) {
      this.followSystemTheme = visible;
    },
    /** 自动跟随系统主题 */
    setAutoFollowSystemMode(darkMode: boolean) {
      if (this.followSystemTheme) {
        this.darkMode = darkMode;
      }
    },
    /** 切换/关闭 暗黑模式 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    /** 设置系统主题颜色 */
    setThemeColor(themeColor: string) {
      this.themeColor = themeColor;
    }
  }
});
