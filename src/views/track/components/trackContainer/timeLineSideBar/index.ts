// 侧边栏配置
export interface TimeLineSideBarOptionItem {
  /** 图标 */
  icon?: string;
  /** 删除 */
  deleted?: boolean;
  /** 锁定 */
  locked?: boolean;
  /** 隐藏 */
  hided?: boolean;
  /** 静音 */
  muted?: boolean;
}
export const defaultTimeLineSideBarOptionItem: TimeLineSideBarOptionItem = {
  icon: '',
  deleted: false,
  locked: false,
  hided: false,
  muted: false
};
/**
 * @abstract 根据时间线行属性配置侧边栏
 */

export const timeLineSideBarOptions: Record<string, TimeLineSideBarOptionItem> = {
  main: {
    icon: 'carbon:home',
    deleted: true,
    locked: true,
    hided: true,
    muted: true
  },
  video: {
    icon: 'mdi:video-outline',
    deleted: true,
    locked: true,
    hided: true,
    muted: true
  },
  image: {
    icon: 'material-symbols:image-outline-sharp',
    deleted: true,
    locked: true,
    hided: true,
    muted: false
  },
  audio: {
    icon: 'tabler:music',
    deleted: true,
    locked: true,
    hided: true,
    muted: true
  },
  text: {
    icon: 'ph:text-t-bold',
    deleted: true,
    locked: true,
    hided: true,
    muted: false
  }
};
