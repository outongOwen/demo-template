import type { MenuOption } from 'naive-ui';
import type { IconifyIcon } from '@iconify/vue';
interface AeaConfig {
  /** 二级菜单 */
  secondMenu: boolean;
  /** 搜索表单 */
  searchForm: boolean;
  /** 材料区域 */
  materialBody: boolean;
}
declare interface SecondMenuOptions {
  label: string;
  key: string;
  icon?: string | IconifyIcon;
  [key: string]: unknown;
}
declare type ExtendMenuOptions = {
  /** 二级菜单 */
  secondMenuOptions?: SecondMenuOptions[];
  /** 区域配置 */
  areaConfig: AeaConfig;
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 二级菜单是否开启网络请求 */
  isNetworkSecondMenu?: boolean;
} & MenuOption;
