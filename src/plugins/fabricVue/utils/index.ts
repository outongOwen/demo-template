import type { BaseFilter } from '@fabric/filters/BaseFilter';
import { isEqual, isObject } from 'lodash';
import type { TFabricObjectProps } from '../types';
/**
 * 错误拦截
 * @param location
 * @param message
 */
export function throwError(location: string, message: string): never {
  throw new Error(`[fabric/${location}]: ${message}`);
}
/**
 * 比较两个对象的差异，返回新对象。
 * @param object 要比较的对象
 * @param base 对比的基准对象
 */
interface BaseObject {
  [key: string]: any;
}
type DifferenceResult = Record<string, any>;
const excludesKey = ['clipPath', 'controls'];
/**
 * 这是一个 TypeScript 函数，它比较两个对象并返回它们之间的差异。
 * @param {BaseObject} difObject - 包含需要与基础对象进行比较的新值或更新值的对象。
 * @param {BaseObject} baseObject - 基础对象是我们要与之比较差异的原始对象。
 * @returns 函数“difference”返回一个“DifferenceResult”对象，该对象包含两个“BaseObject”对象之间的差异。
 */
export function difference(difObject: BaseObject, baseObject: BaseObject): DifferenceResult {
  function changes(_difObject: any, _baseObject: any): DifferenceResult {
    const result: DifferenceResult = {};
    Object.keys(_difObject).forEach(key => {
      if (key === 'filters') {
        const newFilter = filterDifference(_difObject[key], _baseObject[key]);
        if (newFilter.length) {
          result[key] = newFilter;
        }
        if (_difObject[key].length === 0) {
          result[key] = [];
        }
      } else if (_difObject[key] !== _baseObject[key]) {
        if (isObject(_difObject[key]) && isObject(_baseObject[key]) && !excludesKey.includes(key)) {
          !isEqual(_difObject[key], _baseObject[key])
            ? changes(_difObject[key], _baseObject[key])
            : (result[key] = _difObject[key]);
        } else {
          result[key] = _difObject[key];
        }
      }
    });
    return result;
  }
  return changes(difObject, baseObject);
}
/**
 * 比较两个数组的差异，返回新数组。
 * @param newObjectFilters {Array<BaseFilter>}
 * @param  oldObjectFilters {Array<BaseFilter>}
 * @example [Blur, Brightness, Contrast, Grayscale, HueRotation, Invert, Mask, Noise, Pixelate, RemoveColor, Sepia, Shadow, Tint]
 * @returns {Array<BaseFilter>}
 */
export function filterDifference<T = BaseFilter>(newFilters: Array<T>, oldFilters: Array<T>): Array<T> {
  const newFilterMatchesOld = (newFilter: T) =>
    oldFilters.some((oldFilter: T) => !isEqual((newFilter as BaseFilter).toJSON(), (oldFilter as BaseFilter).toJSON()));
  const result = newFilters.filter((newFilter: T) => {
    return newFilterMatchesOld(newFilter);
  });
  return result;
}
// 获取Object的keys
export function objectKeys<T>(obj: T & Record<string, any>): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
// 提取控制属性值
export function extractFabricObjectProps<T = Record<string, any>>(
  fabricObjectProps: TFabricObjectProps,
  extractObject: Record<keyof T, any>
): T {
  const pickObject = {} as Record<keyof T, any>;
  for (const key in extractObject) {
    if (Object.hasOwn(extractObject, key)) {
      pickObject[key] = fabricObjectProps[key];
    }
  }
  return pickObject as T;
}
