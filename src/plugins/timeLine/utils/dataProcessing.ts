import { v4 as UUIDv4 } from 'uuid';
import type { TimelineRow, TimelineAction } from '../types';
/**
 * @description 获取当前所有的action
 * @param {TimelineRow[]} editorData
 * @returns {TimelineAction[]}
 */
export function getAllActions(editorData: TimelineRow[]): TimelineAction[] {
  return editorData.reduce((pre: TimelineAction[], cur: TimelineRow) => {
    return pre.concat(cur.actions);
  }, []);
}
/**
 * @description 在editorData中根据rowId获取行数据
 * @param {string} rowId
 * @param {TimelineRow[]} editorData
 * @returns {TimelineRow}
 */
export function getRowById(rowId: string, editorData: TimelineRow[]): TimelineRow | undefined {
  return editorData.find(item => item.id === rowId);
}
/**
 * @description 根据actionId 获取action
 * @param {string} actionId
 * @param {TimelineRow[]} editorData
 * @returns {TimelineAction}
 */
export function getActionById(actionId: string, editorData: TimelineRow[]): TimelineAction | undefined {
  return getAllActions(editorData).find((item: TimelineAction) => item.id === actionId);
}
/**
 * @description 根据actionId 获取row
 * @param {string} actionId
 * @param {TimelineRow[]} editorData
 * @returns {TimelineRow}
 */
export function getRowByActionId(actionId: string, editorData: TimelineRow[]): TimelineRow | undefined {
  return editorData.find(item => item.actions.some(action => action.id === actionId));
}
/**
 * @description 根据当前行id，获取index
 * @param {string} rowId
 * @param {TimelineRow[]} editorData
 */
export function getRowIndexByRowId(rowId: string, editorData: TimelineRow[]): number {
  return editorData.findIndex(item => item.id === rowId);
}
/**
 * @description 根据当前行id，获取其上一行或者下一行数据
 * @param {string} rowId
 * @param {previous|next} type
 * @param {TimelineRow[]} editorData
 */
export function getPreviousOrNextRowByRowId(
  rowId: string,
  type: 'previous' | 'next',
  editorData: TimelineRow[]
): TimelineRow | undefined {
  const index = editorData.findIndex(item => item.id === rowId);
  if (type === 'previous') {
    return editorData[index - 1];
  }
  return editorData[index + 1];
}
/**
 * @description 根据actionId删除当前行动作，根据rowId新增当前动作
 * @param {string} actionId
 * @param {string} rowId
 * @param {TimelineRow[]} editorData
 * @returns {TimelineRow[]}
 */
export function moveActionToRow(actionId: string, rowId: string, editorData: TimelineRow[]): TimelineRow[] | undefined {
  const newEditorData = editorData.map(item => {
    const newRow = { ...item };
    newRow.actions = item.actions.filter(action => action.id !== actionId);
    return newRow;
  });
  const action = getActionById(actionId, editorData);
  if (action) {
    const row = getRowById(rowId, newEditorData);
    if (row) {
      row.actions.push(action);
    }
  }
  return newEditorData;
}
/**
 * @description 删除一条action,新增一条row
 * @param {string} actionId
 * @param {TimelineRow[]} editorData
 * @param {before|after} type
 */
export function removeActionAndAddRow(
  actionId: string,
  editorData: TimelineRow[],
  type: 'before' | 'after'
): TimelineRow[] | undefined {
  const newEditorData = editorData.map(item => {
    const newRow = { ...item };
    newRow.actions = item.actions.filter(action => action.id !== actionId);
    return newRow;
  });
  const action = getActionById(actionId, editorData);
  if (action) {
    const row = getRowByActionId(actionId, editorData);
    if (row) {
      const newRow = { ...row };
      newRow.actions = [action];
      const index = newEditorData.findIndex(item => item.id === row.id);
      if (type === 'before') {
        newEditorData.splice(index, 0, newRow);
      } else {
        newEditorData.splice(index + 1, 0, newRow);
      }
    }
  }
  return newEditorData;
}
/**
 * @description 创建row数据并且插入到指定index
 * @param {number} rowIndex
 * @param {TimelineRow[]} editorData
 */
export function createRowInsertEditorDataByRowIndex(rowIndex: number, rowType, editorData: TimelineRow[]) {
  const newRow: TimelineRow = {
    id: UUIDv4(),
    /** 行名称 */
    name: rowIndex,
    /** 行类型 */
    type: rowType,
    /** 行的动作列表 */
    actions: []
  };
  editorData.splice(rowIndex, 0, newRow);
}
/**
 * @description 新建行数据
 * @param {string} rowType
 * @param {string} name
 * @returns {TimelineRow}
 */
export function createNewRow(rowType, name): TimelineRow {
  return {
    id: UUIDv4(),
    /** 行名称 */
    name,
    /** 行类型 */
    type: rowType,
    /** 侧边栏类型 */
    sideBarId: rowType,
    /** 行的动作列表 */
    actions: []
  };
}
/**
 * @description 插入行到指定位置
 * @param {TimelineRow} row
 * @param {number} index
 * @param {TimelineRow[]} editorData
 */
export function insertRowByIndex(row: TimelineRow, index: number, editorData: TimelineRow[]) {
  editorData.splice(index, 0, row);
}
