import { isEqual, isObject } from 'lodash-es';
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

interface DifferenceResult extends BaseObject {}

export function difference(difObject: BaseObject, baseObject: BaseObject): DifferenceResult {
  function changes(_difObject: BaseObject, _baseObject: BaseObject): DifferenceResult {
    const result: DifferenceResult = {};
    Object.keys(_difObject).forEach(key => {
      if (!isEqual(_difObject[key], _baseObject[key])) {
        result[key] =
          isObject(_difObject[key]) && isObject(_baseObject[key])
            ? changes(_difObject[key], _baseObject[key])
            : _difObject[key];
      }
    });
    return result;
  }
  return changes(difObject, baseObject);
}
