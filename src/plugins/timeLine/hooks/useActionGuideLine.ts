import { parserActionsToPositions, parserTimeToTransform } from '../utils';
import type { TimelineAction, TimelineRow } from '../types';
import type { DragActionGuideLine, TargetType } from '../components/timeLineEditorArea/dragGuideLine/index';
const dragLineActionLine = reactive<DragActionGuideLine>({
  isMoving: false,
  targetType: 'action',
  movePositions: [],
  assistPositions: []
});
export default function useActionGuideLine() {
  /** 获取全部辅助线位置 */
  const defaultGetAllAssistPosition = (data: {
    editorData: TimelineRow[];
    scaleUnit: number;
    extendPos?: number[];
  }) => {
    const { editorData, scaleUnit, extendPos } = data;
    const otherActions: TimelineAction[] = [];
    editorData.forEach(rowItem => {
      rowItem.actions.forEach(actionItem => {
        otherActions.push(actionItem);
      });
    });
    const positions = parserActionsToPositions(otherActions, scaleUnit);
    if (extendPos?.length) {
      positions.push(...extendPos.map(item => Number(item)));
    }
    return positions;
  };
  /** 获取辅助线 */
  const defaultGetAssistPosition = (data: {
    editorData: TimelineRow[];
    action: TimelineAction;
    row: TimelineRow;
    scaleUnit: number;
    hideCursor: boolean;
    cursorLeft: number;
    assistActionIds?: string[];
    extendPos?: string[];
  }) => {
    const { editorData, assistActionIds, action, row, scaleUnit, cursorLeft, hideCursor, extendPos } = data;
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
    if (!hideCursor) {
      positions.push(cursorLeft);
    }
    if (extendPos?.length) {
      positions.push(...extendPos.map(item => Number(item)));
    }
    positions.sort((a, b) => a - b);
    return positions;
  };
  /** 获取当前移动标记 */
  const defaultGetMovePosition = (data: { start: number; end: number; scaleUnit: number; dir?: 'right' | 'left' }) => {
    const { start, end, dir, scaleUnit } = data;
    const { left, width } = parserTimeToTransform({ start, end }, scaleUnit);
    if (!dir) return [left, left + width];
    return dir === 'right' ? [left + width] : [left];
  };
  /** 初始化draglines */
  const initDragLine = (data: { movePositions?: number[]; assistPositions?: number[]; targetType?: TargetType }) => {
    const { movePositions, assistPositions, targetType = 'action' } = data;
    dragLineActionLine.isMoving = true;
    dragLineActionLine.targetType = targetType;
    dragLineActionLine.movePositions = movePositions || [];
    dragLineActionLine.assistPositions = assistPositions || [];
  };

  /** 更新dragline */
  const updateDragLine = (data: { movePositions?: number[]; assistPositions?: number[] }) => {
    const { movePositions, assistPositions } = data;
    if (movePositions) dragLineActionLine.movePositions = movePositions;
    if (assistPositions) dragLineActionLine.assistPositions = assistPositions;
  };

  /** 释放draglines */
  const disposeDragLine = () => {
    dragLineActionLine.isMoving = false;
    dragLineActionLine.targetType = 'action';
    dragLineActionLine.movePositions = [];
    dragLineActionLine.assistPositions = [];
  };

  return {
    initDragLine,
    updateDragLine,
    disposeDragLine,
    dragLineActionLine,
    defaultGetAllAssistPosition,
    defaultGetAssistPosition,
    defaultGetMovePosition
  };
}
