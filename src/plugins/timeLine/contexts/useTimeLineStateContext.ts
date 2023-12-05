import type { ShallowRef } from 'vue';
import { isString, isArray } from 'lodash';
import { useContext } from '../hooks';
export interface TimeLineStateContextProps {
  /**
   * @description 刻度单位（ms/px）
   */
  scaleUnit: Ref<number>;
  /**
   * @description 时间线编辑区域容器DOM
   * @default null
   * @type {HTMLElement|null}
   */
  timeLineEditorRef: HTMLElement | null | undefined;
  /**
   * @description 是否有时间主轴
   */
  hasMainRow: Ref<boolean>;
  /**
   * @description 刻度缩放单位 （ms/px）
   * @default 0
   * @type {number}
   */
  selectedActionIds: Ref<Array<string>>;
  /**
   * @description 选中action的ref集合
   */
  selectedActionRefs: ShallowRef<Map<string, HTMLElement | SVGElement>>;

  /**
   * @description 拖拽目标记录值
   */
  rowLinePosition: {
    y: number;
    x?: number;
    isMoving: boolean;
  };
  /**
   * @description 设置选中action
   * @param {Array<string>} actionIds
   * @returns {void}
   */
  setSelectedActionId(selectId?: string | string[], push?: boolean): void;
}
const { useInject, useProvide } = useContext<TimeLineStateContextProps>('TimeLineStateContext');
export default function useTimeLineStateContext() {
  // 刻度单位（ms/px）
  const scaleUnit = ref<number>(0);
  // 是否有时间主轴
  const hasMainRow = ref<boolean>(false);

  // 选中的action的id集合
  const selectedActionIds = ref<Array<string>>([]);
  // 选中的action的ref集合
  const selectedActionRefs = shallowRef<Map<string, HTMLElement | SVGElement>>(new Map());
  // 拖拽目标记录值
  const rowLinePosition = reactive({
    y: 0,
    isMoving: false
  });

  //  设置选中action的id
  const setSelectedActionId = (selectId, push = false) => {
    if (!selectId) {
      selectedActionIds.value = [];
    }
    if (isString(selectId)) {
      if (push) {
        if (selectedActionIds.value.includes(selectId)) {
          return;
        }
        selectedActionIds.value.push(selectId);
        return;
      }
      selectedActionIds.value = [selectId];
    }
    if (isArray(selectId)) {
      if (push) {
        // eslint-disable-next-line no-param-reassign
        selectId = selectId.filter(item => !selectedActionIds.value.includes(item));
        if (!selectId.length) return;
        selectedActionIds.value.push(...selectId);
        return;
      }
      selectedActionIds.value = selectId;
    }
  };
  const timeLineStateProps: TimeLineStateContextProps = {
    scaleUnit,
    hasMainRow,
    timeLineEditorRef: null,
    selectedActionIds,
    selectedActionRefs,
    rowLinePosition,
    setSelectedActionId
  };
  const provideTimeLineStateContext = () => {
    return useProvide(timeLineStateProps);
  };
  const injectTimeLineStateContext = () => {
    return useInject();
  };
  return {
    provideTimeLineStateContext,
    injectTimeLineStateContext
  };
}
