import type { ShallowReactive, ShallowRef } from 'vue';
import { isString, isArray } from 'lodash';
import { useContext } from '../hooks';
import type { TimelineAction, TimelineRow } from '../types';
// import { getActionById } from '../utils/dataProcessing';
export interface DropzoneInfo {
  isMoving: boolean;
  dragId: string;
  rowId: string;
  top: number;
  direction: 'center' | 'top' | 'bottom';
}
export interface ActionDragState {
  isMoving: boolean;
  isResizing: boolean;
  rowId: string;
  actionId: string;
}
export interface TimeLineEditorAreaContextProps {
  /**
   * @description: 时间线数据
   */
  editorData: Ref<TimelineRow[] | undefined>;
  /** */
  actionDragState: ActionDragState;
  /**
   * @description: 当前选中actionsRef集合(支持多选)
   * @default: []
   * @type {Array<TimelineAction>}
   */
  selectedActionRefs: Map<string, HTMLElement | SVGElement>;
  /**
   * @description: 当前选中actionsId数组(支持多选)
   * @default: []
   * @type {Array<string>}
   */
  selectedActionIds: ShallowRef<Array<string>>;
  /**
   * @description: 当前选中的action数组(支持多选)
   * @default: []
   * @type {Array<TimelineAction>}
   */
  selectedActions: ComputedRef<Array<TimelineAction>>;
  /**
   * @description: 掉落区域的Info
   * @type {DropzoneInfo}
   */
  dropzoneInfo: ShallowReactive<DropzoneInfo>;
  /**
   * @description: 设置拖动状态
   * @param {ActionDragState} state
   * @returns {void}
   */
  setActionDragState: (state: ActionDragState) => void;
  /**
   * @description: 清除拖动状态
   * @returns {void}
   */
  clearActionDragState: () => void;
  /**
   * @description: 释放
   * @returns {void}
   * @example
   */
  disposeDraggable: () => void;
  /**
   * @description: 设置选中action的id
   * @param {string | string[]} selectId
   * @param {boolean} push
   * @returns {void}
   */
  setSelectedActionId: (selectId?: string | string[], push?: boolean) => void;
  /**
   * @description: 清空选中
   * @returns {void}
   */
  clearSelected: () => void;
  /**
   * @description: 设置掉落区域的Info
   * @param {string} rowId
   * @param {number} top
   * @param {'center' | 'top' | 'bottom'} direction
   * @returns {void}
   */
  setDropzoneInfo: (rowId: string, top: number, direction: 'center' | 'top' | 'bottom') => void;
  /**
   * @description: 释放掉落区域的Info
   * @returns {void}
   */
  disposeDropzoneInfo: () => void;
}
const { useInject, useProvide } = useContext<TimeLineEditorAreaContextProps>('TimeLineEditorAreaContext', {
  native: true
});
export default function useTimeLineEditorAreaContext() {
  // 时间线数据
  const editorData = ref<TimelineRow[]>([]);
  // 拖动状态
  const actionDragState = reactive<ActionDragState>({
    isResizing: false,
    isMoving: false,
    rowId: '',
    actionId: ''
  });
  // 当前选中actionsId数组(支持多选)
  const selectedActionIds = shallowRef<Array<string>>([]);
  // 当前选中actionsRef(支持多选)
  const selectedActionRefs = reactive(new Map());
  // 当前选中的action数组
  const selectedActions = computed<Array<TimelineAction>>(() => {
    return editorData?.value
      ? editorData.value.reduce((prev: TimelineAction[], curr) => {
          const action = curr.actions.find(actionItem => selectedActionIds.value.includes(actionItem.id));
          if (action) prev.push(action);
          return prev;
        }, [])
      : [];
  });
  // 掉落区域的Info
  const dropzoneInfo = reactive<DropzoneInfo>({
    rowId: '',
    top: 0,
    direction: 'center',
    isMoving: false,
    dragId: ''
  });
  // 设置拖动状态
  const setActionDragState = (state: ActionDragState) => {
    const { isMoving, isResizing, rowId, actionId } = state;
    actionDragState.isResizing = isResizing;
    actionDragState.isMoving = isMoving;
    actionDragState.rowId = rowId;
    actionDragState.actionId = actionId;
  };
  // 清除拖动状态
  const clearActionDragState = () => {
    actionDragState.isResizing = false;
    actionDragState.isMoving = false;
    actionDragState.rowId = '';
    actionDragState.actionId = '';
  };
  //  设置选中action的id
  const setSelectedActionId = (selectId, push = false) => {
    if (!selectId) {
      selectedActionIds.value.length = 0;
      return;
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
        const filterSelectId = selectId.filter(item => !selectedActionIds.value.includes(item));
        if (!filterSelectId.length) return;
        selectedActionIds.value.push(...filterSelectId);
        return;
      }
      selectedActionIds.value = selectId;
    }
  };
  const setDropzoneInfo = (rowId: string, top: number, direction: 'center' | 'top' | 'bottom') => {
    dropzoneInfo.rowId = rowId;
    dropzoneInfo.top = top;
    dropzoneInfo.direction = direction;
  };
  // 释放掉落区域的Info
  const disposeDropzoneInfo = () => {
    dropzoneInfo.rowId = '';
    dropzoneInfo.top = 0;
    dropzoneInfo.direction = 'center';
  };
  // 释放选中所有状态
  const disposeDraggable = () => {
    selectedActionIds.value = [];
    dropzoneInfo.dragId = '';
    selectedActionRefs.clear();
    dropzoneInfo.rowId = '';
    dropzoneInfo.top = 0;
    dropzoneInfo.direction = 'center';
  };
  // 清空选中
  const clearSelected = () => {
    selectedActionIds.value = [];
  };
  const timeLineEditorAreaContextProps: TimeLineEditorAreaContextProps = {
    editorData,
    actionDragState,
    selectedActionIds,
    clearSelected,
    selectedActionRefs,
    selectedActions,
    dropzoneInfo,
    disposeDraggable,
    setSelectedActionId,
    setDropzoneInfo,
    disposeDropzoneInfo,
    setActionDragState,
    clearActionDragState
  };
  const provideTimeLineEditorAreaContext = ({ editorData: timelineData }: Partial<TimeLineEditorAreaContextProps>) => {
    if (timelineData?.value) editorData.value = timelineData.value;
    return useProvide(timeLineEditorAreaContextProps);
  };
  const injectTimeLineEditorAreaContext = () => {
    return useInject();
  };
  return {
    provideTimeLineEditorAreaContext,
    injectTimeLineEditorAreaContext
  };
}
