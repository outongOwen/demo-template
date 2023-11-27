import { useContext } from '../hooks';
export interface TimeLineStateContextProps {
  /**
   * @description 是否有时间主轴
   */
  hasMainRow: boolean;
  /**
   * @description 滚动条尺寸
   * @default 8
   */
  scrollBarSize: number;
  /**
   * @description 选中action
   * @default []
   * @type{Array<string>}
   */
  selectedActionIds: Array<string>;
  /**
   * @description 选中action的ref集合
   */
  selectedActionRefs: Map<string, HTMLElement | SVGElement>;
  /**
   * @description 时间线编辑区域容器ref
   * @default null
   * @type {HTMLElement|null}
   */
  timeLineEditorRef: HTMLElement | null | undefined;

  /**
   * @description 设置选中action
   * @param {Array<string>} actionIds
   * @returns {void}
   */
  setSelectedActionId(selectId?: string | string[], push?: boolean): void;
}
const { useInject, useProvide } = useContext<TimeLineStateContextProps>('TimeLineStateContext', {
  native: false,
  readonly: false
});
export default function useTimeLineStateContext() {
  const provideTimeLineStateContext = (context: TimeLineStateContextProps): TimeLineStateContextProps => {
    const { state } = useProvide(context);
    return state;
  };
  const injectTimeLineStateContext = () => {
    return useInject();
  };
  return {
    provideTimeLineStateContext,
    injectTimeLineStateContext
  };
}
