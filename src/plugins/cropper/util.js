/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
const { min, max } = Math;
const FLOATING_POINT_DIGIT = 2;
/**
 * Clamp value
 * @param {number} value - Value
 * @param {number} minValue - Minimum value
 * @param {number} maxValue - Maximum value
 * @returns {number} clamped value
 */
export function clamp(value, minValue, maxValue) {
  if (minValue > maxValue) {
    // eslint-disable-next-line no-param-reassign
    [minValue, maxValue] = [maxValue, minValue];
  }

  return max(minValue, min(value, maxValue));
}

/**
 * Make key-value object from arguments
 * @returns {object.<string, string>}
 */
export function keyMirror(...args) {
  const obj = {};

  // forEach(args, (key) => {
  //   obj[key] = key
  // })
  args.forEach((key) => {
    obj[key] = key;
  });

  return obj;
}

/**
 * Fix floating point diff.
 * @param {number} value - original value
 * @returns {number} fixed value
 */
export function fixFloatingPoint(value) {
  return Number(value.toFixed(FLOATING_POINT_DIGIT));
}

export function addListener(el, ...args) {
  el.addEventListener(...args);
}

export function removeListener(el, ...args) {
  el.removeEventListener(...args);
}

export function isArray(obj) {
  return obj instanceof Array;
}

/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
export function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the element
 *  2) The index of the element
 *  3) The array(or Array-like object) being traversed
 * @param {Array|Arguments|NodeList} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEachArray from 'tui-code-snippet/collection/forEachArray';
 *
 * // CommonJS
 * const forEachArray = require('tui-code-snippet/collection/forEachArray');
 *
 * let sum = 0;
 *
 * forEachArray([1,2,3], function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 */
export function forEachArray(arr, iteratee, context) {
  let index = 0;
  const len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

export /**
 * Execute the provided callback once for each property of object which actually exist.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property
 *  2) The name of the property
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
 *
 * // CommonJS
 * const forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties');
 *
 * let sum = 0;
 *
 * forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 */
function forEachOwnProperties(obj, iteratee, context) {
  let key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}
