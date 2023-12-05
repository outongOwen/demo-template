import { keyMirror } from './util';

/**
 * Object type
 * @type {Object.<string, string>}
 */
export const OBJ_TYPE = {
  CROPZONE: 'cropzone'
};

// 限制最小缩放，
export const LIMIT_SIZE = {
  limitPercent: 0.2225
};

/**
 * Component names
 * @type {Object.<string, string>}
 */
export const componentNames = keyMirror('IMAGE_LOADER', 'CROPPER');

/**
 * Cropzone default option
 * @type {Object}
 */
export const CROPZONE_DEFAULT_OPTIONS = {
  hasRotatingPoint: false,
  hasBorders: true,
  lockScalingFlip: true,
  lockRotation: true,
  lockSkewingX: true,
  lockSkewingY: true
};

/**
 * Event names
 * @type {Object.<string, string>}
 */
export const eventNames = {
  OBJECT_MOVED: 'objectMoved',
  OBJECT_SCALED: 'objectScaled',
  MOUSE_MOVE: 'mousemove'
};

/**
 * Shortcut key values
 * @type {Object.<string, number>}
 */
export const keyCodes = {
  Z: 90,
  Y: 89,
  C: 67,
  V: 86,
  SHIFT: 16,
  BACKSPACE: 8,
  DEL: 46,
  ARROW_DOWN: 40,
  ARROW_UP: 38,
  SPACE: 32,
  DIGIT_0: 48,
  DIGIT_9: 57
};
