import { isObject, isString, isArray, cloneDeep, isEqual, mergeWith, unionWith } from 'lodash-es';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}
/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (!isObject(params)) {
    // 使用自定义的辅助函数 isObject 进行类型检查
    return;
  }

  const keys = Object.keys(params);
  for (const key of keys) {
    const value = params[key];

    // 判断是否有 format 方法且为函数类型
    const format = value?.format ?? null;
    if (format && typeof format === 'function') {
      params[key] = value.format(DATE_TIME_FORMAT);
    }

    if (isString(key)) {
      const valueToUpdate = params[key]; // 使用不同的变量名避免重复声明
      if (valueToUpdate) {
        try {
          params[key] = isString(valueToUpdate) ? valueToUpdate.trim() : valueToUpdate;
        } catch (error) {
          // 移除错误对象类型声明，TypeScript 会自动推断
          throw new Error(error as string);
        }
      }
    }

    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}
/**

 递归合并两个对象。
 Recursively merge two objects.
 @param target 目标对象，合并后结果存放于此。The target object to merge into.
 @param source 要合并的源对象。The source object to merge from.
 @returns 合并后的对象。The merged object.
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  target: T,
  source: U
): T & U {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isObject(objValue) && isObject(srcValue)) {
      return mergeWith(cloneDeep(objValue), srcValue, (prevValue, nextValue) => {
        // 如果是数组，合并数组(去重) If it is an array, merge the array (remove duplicates)
        return isArray(prevValue) ? unionWith(prevValue, nextValue, isEqual) : undefined;
      });
    }
    return objValue;
  });
}
