import type { TimelineRow, TimelineAction } from '../../types';
export interface TimelineEditorEmits {
  (event: 'timeLineDurationChange', payload: { time: number }): void;
  (
    event: 'timeLineScaleMarksRangeChange',
    marks: Array<number>,
    payload: { maxFrameWidth: number; minFrameWidth: number }
  ): void;
  (event: 'actionMoveStart', params: { action: TimelineAction; row: TimelineRow }): void;
  (
    event: 'actionMoving',
    params: { action: TimelineAction; row: TimelineRow; start: number; end: number },
    next?: (result: boolean) => void
  ): void;
  (event: 'actionMoveEnd', params: { action: TimelineAction; row: TimelineRow; start: number; end: number }): void;
  (event: 'actionResizeStart', params: { action: TimelineAction; row: TimelineRow; dir: 'right' | 'left' }): void;
  (
    event: 'actionResizing',
    params: {
      action: TimelineAction;
      row: TimelineRow;
      start: number;
      end: number;
      dir: 'right' | 'left';
    },
    next?: (result: boolean) => void
  ): void;
  (
    event: 'actionResizeEnd',
    params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: 'right' | 'left' }
  ): void;
  (event: 'clickRow', params: { row: TimelineRow; time: number }): void;
  (event: 'clickAction', params: { action: TimelineAction; row: TimelineRow; time: number }): void;
  (event: 'clickActionOnly', params: { action: TimelineAction; row: TimelineRow; time: number }): void;
  (event: 'contextMenuRow', params: { row: TimelineRow; time: number }): void;
  (event: 'contextMenuAction', params: { action: TimelineAction; row: TimelineRow; time: number }): void;
  (event: 'cursorDragStart', params: { time: number }): void;
  (event: 'cursorDragging', params: { time: number }): void;
  (event: 'cursorDragEnd', params: { time: number }): void;
  (event: 'scroll', params: { left: number; top: number }): void;
  (event: 'clickTimeArea', params: { time: number }): void;
}
export const useDefineEmits = (emits: TimelineEditorEmits) => {
  /**
   * @description 时间线最大时长改变
   * @param  time
   * @type {time:number}
   * @returns {void}
   */
  const onTimeLineDurationChange = (time: number): void => {
    emits('timeLineDurationChange', { time });
  };
  /**
   * @description 时间线可用缩放标记
   * @type {Array<number>}
   * @returns {void}
   */
  const onTimeLineScaleMarksRangeChange = (
    marks: Array<number>,
    { maxFrameWidth, minFrameWidth }: { maxFrameWidth: number; minFrameWidth: number }
  ): void => {
    emits('timeLineScaleMarksRangeChange', marks, {
      maxFrameWidth,
      minFrameWidth
    });
  };
  /**
   * @description 动作移动开始
   * @param  params
   * @type  { action: TimelineAction; row: TimelineRow }
   * @returns {void}
   */
  const onActionMoveStart = (params: { action: TimelineAction; row: TimelineRow }): void => {
    emits('actionMoveStart', params);
  };
  /**
   * @description 动作移动
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; start: number; end: number }
   * @returns { boolean}
   */
  const onActionMoving = (params: {
    action: TimelineAction;
    row: TimelineRow;
    start: number;
    end: number;
  }): boolean => {
    let ret = true;
    emits('actionMoving', params, result => {
      ret = result;
    });
    return Boolean(ret);
  };
  /**
   * @description 动作移动结束
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; start: number; end: number }
   * @returns {void}
   */
  const onActionMoveEnd = (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }): void => {
    emits('actionMoveEnd', params);
  };
  /**
   * @description 动作改变大小开始
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; dir: 'right' | 'left' }
   * @returns {void}
   */
  const onActionResizeStart = (params: { action: TimelineAction; row: TimelineRow; dir: 'right' | 'left' }): void => {
    emits('actionResizeStart', params);
  };
  /**
   * @description 动作改变大小
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: 'right' | 'left' }
   * @returns {boolean}
   */
  const onActionResizing = (params: {
    action: TimelineAction;
    row: TimelineRow;
    start: number;
    end: number;
    dir: 'right' | 'left';
  }): boolean => {
    let ret = true;
    emits('actionResizing', params, result => {
      ret = result;
    });
    return Boolean(ret);
  };
  /**
   * @description 动作改变大小结束
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: 'right' | 'left' }
   * @returns {void}
   */
  const onActionResizeEnd = (params: {
    action: TimelineAction;
    row: TimelineRow;
    start: number;
    end: number;
    dir: 'right' | 'left';
  }): void => {
    emits('actionResizeEnd', params);
  };
  /**
   * @description 行点击
   * @param params
   * @type { row: TimelineRow; time: number }
   *  @returns {void}
   */
  const onClickRow = (params: { row: TimelineRow; time: number }): void => {
    emits('clickRow', params);
  };
  /**
   * @description 动作点击
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; time: number }
   * @returns {void}
   */
  const onClickAction = (params: { action: TimelineAction; row: TimelineRow; time: number }): void => {
    emits('clickAction', params);
  };

  /**
   * @description 动作点击
   * @abstract 仅触发点击事件，不触发其他事件
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; time: number }
   * @returns {void}
   */
  const onClickActionOnly = (params: { action: TimelineAction; row: TimelineRow; time: number }): void => {
    emits('clickActionOnly', params);
  };
  /**
   * @description 右键行
   * @param params
   * @type { row: TimelineRow; time: number }
   * @returns {void}
   */
  const onContextMenuRow = (params: { row: TimelineRow; time: number }): void => {
    emits('contextMenuRow', params);
  };
  /**
   * @description 右键动作
   * @param params
   * @type { action: TimelineAction; row: TimelineRow; time: number }
   * @returns {void}
   */
  const onContextMenuAction = (params: { action: TimelineAction; row: TimelineRow; time: number }): void => {
    emits('contextMenuAction', params);
  };
  /**
   * @description 点击时间区域
   * @param params
   * @type { time: number }
   * @returns {void}
   */
  const onClickTimeArea = (params: { time: number }): void => {
    emits('clickTimeArea', params);
  };
  /**
   * @description 光标拖拽开始
   * @param params
   * @type { time: number }
   * @returns {void}
   */
  const onCursorDragStart = (params: { time: number }): void => {
    emits('cursorDragStart', params);
  };
  /**
   * @description 光标拖拽
   * @param params
   * @type { time: number }
   * @returns {void}
   */
  const onCursorDragging = (params: { time: number }): void => {
    emits('cursorDragging', params);
  };
  /**
   * @description 光标拖拽结束
   * @param params
   * @type { time: number }
   * @returns {void}
   */
  const onCursorDragEnd = (params: { time: number }): void => {
    emits('cursorDragEnd', params);
  };
  /**
   * @description 滚动
   * @param params
   * @type { left: number; top: number }
   * @returns {void}
   */
  const onScroll = (params: { left: number; top: number }): void => {
    emits('scroll', params);
  };

  return {
    onTimeLineDurationChange,
    onTimeLineScaleMarksRangeChange,
    onActionMoveStart,
    onActionMoving,
    onActionMoveEnd,
    onActionResizeStart,
    onActionResizing,
    onActionResizeEnd,
    onCursorDragStart,
    onCursorDragging,
    onCursorDragEnd,
    onClickTimeArea,
    onClickAction,
    onClickRow,
    onClickActionOnly,
    onContextMenuRow,
    onContextMenuAction,
    onScroll
  };
};

export type TimeLineEditorShareEmits = ReturnType<typeof useDefineEmits>;
