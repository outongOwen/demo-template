import type { TimelineAction, TimelineRow } from '../types';
import { getRowById, getRowIndexByRowId, createNewRow } from '../utils';
/**
 * @description: 根据action拖拽掉落的位置判断数据操作方式
 * @param params
 * @param {TimelineAction} action
 * @returns {void}
 */
interface DropActionParams {
  direction: 'top' | 'bottom' | 'center';
  targetRowId: string;
  fromRowId: string;
  action: TimelineAction;
  editorData: TimelineRow[];
}
export default function useDropAction({ direction, targetRowId, fromRowId, action, editorData }: DropActionParams) {
  if (direction === 'center') {
    if (targetRowId === fromRowId) return;
    const targetRow = getRowById(targetRowId, editorData);
    const fromRow = getRowById(fromRowId, editorData);
    if (!fromRow || !targetRow) return;
    fromRow.actions.splice(fromRow.actions.indexOf(action), 1);
    targetRow.actions.push(action);
    fromRow.actions.length === 0 && editorData.splice(editorData.indexOf(fromRow), 1);
    return;
  }
  const rowIndex = getRowIndexByRowId(targetRowId, editorData);
  const targetRow = getRowById(targetRowId, editorData);
  if (!targetRow) return;
  const newRow = createNewRow(targetRow.type, rowIndex);
  const fromRow = getRowById(fromRowId, editorData);
  if (!fromRow) return;
  newRow.actions.push(action);
  if (direction === 'top') {
    fromRow.actions.splice(fromRow.actions.indexOf(action), 1);
    editorData.splice(rowIndex, 0, newRow);
  }
  if (direction === 'bottom') {
    fromRow.actions.splice(fromRow.actions.indexOf(action), 1);
    editorData.splice(rowIndex + 1, 0, newRow);
  }
  fromRow.actions.length === 0 && editorData.splice(editorData.indexOf(fromRow), 1);
}
