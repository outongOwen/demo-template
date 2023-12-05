/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
/**
 * @fileoverview Extend the target object from other objects.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * @module object
 */

/**
 * Extend the target object from other objects.
 * @param {object} target - Object that will be extended
 * @param {...object} objects - Objects as sources
 * @returns {object} Extended object
 * @memberof module:object
 */
export function extend(target, objects) {
  // eslint-disable-line no-unused-vars
  const hasOwnProp = Object.prototype.hasOwnProperty;
  let i;
  let len;
  let prop;
  let source;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

// module.exports = extend
