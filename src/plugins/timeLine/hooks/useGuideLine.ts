import { parserActionsToPositions, parserTimeToTransform } from '../utils';
import type { DragGuideLine } from '../components/timeLineEditorArea/dragGuideLine';
import type { TimelineAction, TimelineRow } from '../types';
const dragLineData = reactive<DragGuideLine>({ isMoving: false, movePositions: [], assistPositions: [] });
export default function useGuideLine() {
  /** 获取辅助线 */
  const defaultGetAssistPosition = (data: {
    editorData: TimelineRow[];
    action: TimelineAction;
    row: TimelineRow;
    scaleUnit: number;
    hideCursor: boolean;
    cursorLeft: number;
    assistActionIds?: string[];
  }) => {
    const { editorData, assistActionIds, action, row, scaleUnit, cursorLeft, hideCursor } = data;
    const otherActions: TimelineAction[] = [];
    if (assistActionIds) {
      editorData.forEach(rowItem => {
        rowItem.actions.forEach(actionItem => {
          if (assistActionIds.includes(actionItem.id)) otherActions.push(actionItem);
        });
      });
    } else {
      editorData.forEach(rowItem => {
        if (rowItem.id !== row.id) {
          otherActions.push(...rowItem.actions);
        } else {
          rowItem.actions.forEach(actionItem => {
            if (actionItem.id !== action.id) otherActions.push(actionItem);
          });
        }
      });
    }

    const positions = parserActionsToPositions(otherActions, scaleUnit);
    if (!hideCursor) positions.push(cursorLeft);

    return positions;
  };
  /** 获取当前移动标记 */
  const defaultGetMovePosition = (data: { start: number; end: number; dir?: 'right' | 'left'; scaleUnit: number }) => {
    const { start, end, dir, scaleUnit } = data;
    const { left, width } = parserTimeToTransform({ start, end }, scaleUnit);
    if (!dir) return [left, left + width];
    return dir === 'right' ? [left + width] : [left];
  };
  /** 初始化draglines */
  const initDragLine = (data: { movePositions?: number[]; assistPositions?: number[] }) => {
    const { movePositions, assistPositions } = data;
    dragLineData.isMoving = true;
    dragLineData.movePositions = movePositions || [];
    dragLineData.assistPositions = assistPositions || [];
  };

  /** 更新dragline */
  const updateDragLine = (data: { movePositions?: number[]; assistPositions?: number[] }) => {
    const { movePositions, assistPositions } = data;
    if (movePositions) dragLineData.movePositions = movePositions;
    if (assistPositions) dragLineData.assistPositions = assistPositions;
  };

  /** 释放draglines */
  const disposeDragLine = () => {
    dragLineData.isMoving = false;
    dragLineData.movePositions = [];
    dragLineData.assistPositions = [];
  };

  return {
    initDragLine,
    updateDragLine,
    disposeDragLine,
    dragLineData,
    defaultGetAssistPosition,
    defaultGetMovePosition
  };
}
