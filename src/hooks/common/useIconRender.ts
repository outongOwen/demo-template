import type { VNodeChild, Component } from 'vue';
import { h } from 'vue';
import type { IconifyIcon } from '@iconify/vue';
import SvgIcon from '@/components/custom/SvgIcon.vue';
/**
 * 图标渲染
 * - 用于vue的render函数
 */
export default function useIconRender() {
  interface IconConfig {
    /**
     * 图标名称(iconify图标的名称)
     * - 例如：mdi-account 或者 mdi:account
     */
    icon?: string | IconifyIcon;
    /**
     * 本地svg图标文件名(assets/svg-icon文件夹下)
     */
    localIcon?: string;
    /** 图标颜色 */
    color?: string;
    /** 图标大小 */
    fontSize?: number;
  }

  interface IconStyle {
    color?: string;
    fontSize?: string;
  }

  /**
   * 图标渲染
   * @param config
   * @property icon - 图标名称(iconify图标的名称), 例如：mdi-account 或者 mdi:account
   * @property localIcon - 本地svg图标文件名(assets/svg-icon文件夹下)
   * @property color - 图标颜色
   * @property fontSize - 图标大小
   */
  const iconRender = (config: IconConfig): (() => VNodeChild & Component) => {
    const { color, fontSize, icon, localIcon } = config;

    const style: IconStyle = {};

    if (color) {
      style.color = color;
    }
    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }

    if (!icon && !localIcon) {
      window.console.warn('没有传递图标名称，请确保给icon或localIcon传递有效值!');
    }

    return () => h(SvgIcon, { icon, localIcon, style });
  };

  return {
    iconRender
  };
}
