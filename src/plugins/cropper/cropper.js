/* eslint-disable */
import { util, Control } from 'fabric';
import { extend } from './extend';
import Component from './component';
import Cropzone from './cropzone';
import { keyCodes, componentNames, CROPZONE_DEFAULT_OPTIONS, LIMIT_SIZE } from './consts';
import { clamp, fixFloatingPoint, addListener, removeListener } from './util';

const MOUSE_MOVE_THRESHOLD = 10;
const DEFAULT_OPTION = {
  presetRatio: null,
  top: 0,
  left: 0,
  height: 1,
  width: 1
};

/**
 * Cropper components
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @class Cropper
 * @ignore
 */
class Cropper extends Component {
  constructor(graphics, { deleteObject }) {
    super(componentNames.CROPPER, graphics);
    /**
     * Cropzone
     * @type {Cropzone}
     * @private
     */
    this._cropzone = null;
    this.deleteObject = deleteObject;

    /**
     * StartX of Cropzone
     * @type {number}
     * @private
     */
    this._startX = null;

    /**
     * StartY of Cropzone
     * @type {number}
     * @private
     */
    this._startY = null;

    /**
     * State whether shortcut key is pressed or not
     * @type {boolean}
     * @private
     */
    this._withShiftKey = false;

    /**
     * Listeners
     * @type {object.<string, function>}
     * @private
     */
    this._listeners = {
      keydown: this._onKeyDown.bind(this),
      keyup: this._onKeyUp.bind(this),
      mousedown: this._onFabricMouseDown.bind(this),
      mousemove: this._onFabricMouseMove.bind(this),
      mouseup: this._onFabricMouseUp.bind(this)
    };
  }

  /**
   * Start cropping
   */
  start() {
    if (this._cropzone) {
      return;
    }
    const canvas = this.getCanvas();
    this._cropzone = new Cropzone(
      canvas,
      extend(
        {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          strokeWidth: 0, // {@link https://github.com/kangax/fabric.js/issues/2860}
          cornerSize: 10,
          fill: 'transparent',
          cornerStyle: 'circle',
          cornerColor: '#fff',
          cornerStrokeColor: '#fff',
          transparentCorners: false,
          lineWidth: 2,
          borderColor: '#fff'
        },
        CROPZONE_DEFAULT_OPTIONS,
        LIMIT_SIZE
      )
    );

    canvas.discardActiveObject();
    canvas.add(this._cropzone);

    canvas.on('mouse:down', this._listeners.mousedown);
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';

    addListener(document, 'keydown', this._listeners.keydown);
    addListener(document, 'keyup', this._listeners.keyup);
  }

  // 添加自定义的btn按钮
  addControlBtn() {
    console.log(this._cropzone.controls);
    const deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    const deleteImg = document.createElement('img');
    deleteImg.src = deleteIcon;
    this._cropzone.controls.cancelControl = new Control({
      x: 0.5,
      y: 0.5,
      offsetX: -12,
      offsetY: 20,
      cursorStyle: 'pointer',
      mouseUpHandler: this.deleteObject.bind(this),
      render: this.renderIcon(deleteImg),
      cornerSize: 24
    });
    this._cropzone.controls.confirmControl = new Control({
      x: 0.5,
      y: 0.5,
      offsetY: 20,
      offsetX: -40,
      cursorStyle: 'pointer',
      mouseUpHandler: this.deleteObject.bind(this),
      render: this.renderIcon(deleteImg),
      cornerSize: 24
    });
  }

  renderIcon(icon) {
    // eslint-disable-next-line max-params
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    };
  }

  /**
   * End cropping
   */
  end() {
    const canvas = this.getCanvas();
    const cropzone = this._cropzone;

    if (!cropzone) {
      return;
    }
    canvas.remove(cropzone);
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.off('mouse:down', this._listeners.mousedown);
    canvas.forEachObject((obj) => {
      obj.evented = true;
    });

    this._cropzone = null;

    removeListener(document, 'keydown', this._listeners.keydown);
    removeListener(document, 'keyup', this._listeners.keyup);
  }

  /**
   * Change cropzone visible
   * @param {boolean} visible - cropzone visible state
   */
  changeVisibility(visible) {
    if (this._cropzone) {
      this._cropzone.set({ visible });
    }
  }

  /**
   * onMousedown handler in fabric canvas
   * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event
   * @private
   */
  _onFabricMouseDown(fEvent) {
    const canvas = this.getCanvas();

    if (fEvent.target) {
      return;
    }

    canvas.selection = false;
    const coord = canvas.getPointer(fEvent.e);

    this._startX = coord.x;
    this._startY = coord.y;

    canvas.on({
      'mouse:move': this._listeners.mousemove,
      'mouse:up': this._listeners.mouseup
    });
  }

  /**
   * onMousemove handler in fabric canvas
   * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event
   * @private
   */
  _onFabricMouseMove(fEvent) {
    const canvas = this.getCanvas();
    const pointer = canvas.getPointer(fEvent.e);
    const { x, y } = pointer;
    const cropzone = this._cropzone;

    if (Math.abs(x - this._startX) + Math.abs(y - this._startY) > MOUSE_MOVE_THRESHOLD) {
      canvas.remove(cropzone);

      cropzone.set(this._calcRectDimensionFromPoint(x, y, cropzone.presetRatio));

      canvas.add(cropzone);
      cropzone.setCoords();
      canvas.setActiveObject(cropzone);
    }
  }

  /**
   * Get rect dimension setting from Canvas-Mouse-Position(x, y)
   * @param {number} x - Canvas-Mouse-Position x
   * @param {number} y - Canvas-Mouse-Position Y
   * @param {number|null} presetRatio - fixed aspect ratio (width/height) of the cropzone (null if not set)
   * @returns {{left: number, top: number, width: number, height: number}}
   * @private
   */
  /* eslint-disable complexity */
  _calcRectDimensionFromPoint(x, y, presetRatio = null) {
    const canvas = this.getCanvas();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const startX = this._startX;
    const startY = this._startY;
    let left = clamp(x, 0, startX);
    let top = clamp(y, 0, startY);
    let width = clamp(x, startX, canvasWidth) - left; // (startX <= x(mouse) <= canvasWidth) - left
    let height = clamp(y, startY, canvasHeight) - top; // (startY <= y(mouse) <= canvasHeight) - top

    if (this._withShiftKey && !presetRatio) {
      // make fixed ratio cropzone
      if (width > height) {
        height = width;
      } else if (height > width) {
        width = height;
      }

      if (startX >= x) {
        left = startX - width;
      }

      if (startY >= y) {
        top = startY - height;
      }
    } else if (presetRatio) {
      // Restrict cropzone to given presetRatio
      height = width / presetRatio;

      // If moving in a direction where the top left corner moves (ie. top-left, bottom-left, top-right)
      // the left and/or top values has to be changed based on the new height/width
      if (startX >= x) {
        left = clamp(startX - width, 0, canvasWidth);
      }

      if (startY >= y) {
        top = clamp(startY - height, 0, canvasHeight);
      }

      // Check if the new height is too large
      if (top + height > canvasHeight) {
        height = canvasHeight - top; // Set height to max available height
        width = height * presetRatio; // Restrict cropzone to given presetRatio based on the new height

        // If moving in a direction where the top left corner moves (ie. top-left, bottom-left, top-right)
        // the left and/or top values has to be changed based on the new height/width
        if (startX >= x) {
          left = clamp(startX - width, 0, canvasWidth);
        }

        if (startY >= y) {
          top = clamp(startY - height, 0, canvasHeight);
        }
      }
    }

    return {
      left,
      top,
      width,
      height
    };
  }

  /**
   * onMouseup handler in fabric canvas
   * @private
   */
  _onFabricMouseUp() {
    const cropzone = this._cropzone;
    const listeners = this._listeners;
    const canvas = this.getCanvas();

    canvas.setActiveObject(cropzone);
    canvas.off({
      'mouse:move': listeners.mousemove,
      'mouse:up': listeners.mouseup
    });
  }

  /**
   * Get cropped image data
   * @param {Object} cropRect cropzone rect
   *  @param {Number} cropRect.left left position
   *  @param {Number} cropRect.top top position
   *  @param {Number} cropRect.width width
   *  @param {Number} cropRect.height height
   * @returns {?{imageName: string, url: string}} cropped Image data
   */
  getCroppedImageData(cropRect) {
    const canvas = this.getCanvas();
    const containsCropzone = canvas.contains(this._cropzone);
    if (!cropRect) {
      return null;
    }

    if (containsCropzone) {
      canvas.remove(this._cropzone);
    }

    const imageData = canvas.toDataURL(cropRect);

    if (containsCropzone) {
      canvas.add(this._cropzone);
    }

    return imageData;
  }

  /**
   * Get cropped rect
   * @returns {Object} rect
   */
  getCropzoneRect() {
    const cropzone = this._cropzone;

    if (!cropzone.isValid()) {
      return null;
    }

    return {
      left: cropzone.left,
      top: cropzone.top,
      width: cropzone.width,
      height: cropzone.height
    };
  }

  /**
   * Set a cropzone square
   * @param {number} [presetRatio] - preset ratio
   */
  setCropzoneRect(presetRatio) {
    const canvas = this.getCanvas();
    const cropzone = this._cropzone;

    canvas.discardActiveObject();
    canvas.selection = false;
    canvas.remove(cropzone);

    cropzone.set(
      presetRatio
        ? this._getPresetPropertiesForCropSize(presetRatio)
        : { ...DEFAULT_OPTION, width: canvas.width, height: canvas.height }
    );

    canvas.add(cropzone);
    canvas.selection = true;

    if (presetRatio) {
      canvas.setActiveObject(cropzone);
    }
  }

  /**
   * set a cropzone by position
   * @param {Object}[{left: number, top: number, width: number, height: number}]
   */
  setCropzoneRectByPosition(position) {
    const canvas = this.getCanvas();
    const cropzone = this._cropzone;

    canvas.discardActiveObject();
    canvas.selection = false;
    canvas.remove(cropzone);

    cropzone.set(position);
    canvas.add(cropzone);
    canvas.selection = true;
  }

  /**
   * get a cropzone square info
   * @param {number} presetRatio - preset ratio
   * @returns {{presetRatio: number, left: number, top: number, width: number, height: number}}
   * @private
   */
  _getPresetPropertiesForCropSize(presetRatio) {
    const canvas = this.getCanvas();
    const originalWidth = canvas.getWidth();
    const originalHeight = canvas.getHeight();

    const standardSize = originalWidth >= originalHeight ? originalWidth : originalHeight;
    const getScale = (value, orignalValue) => (value > orignalValue ? orignalValue / value : 1);

    let width = standardSize * presetRatio;
    let height = standardSize;

    const scaleWidth = getScale(width, originalWidth);
    [width, height] = [width, height].map((sizeValue) => sizeValue * scaleWidth);

    const scaleHeight = getScale(height, originalHeight);
    [width, height] = [width, height].map((sizeValue) => fixFloatingPoint(sizeValue * scaleHeight));

    return {
      presetRatio,
      top: (originalHeight - height) / 2,
      left: (originalWidth - width) / 2,
      width,
      height
    };
  }

  /**
   * Keydown event handler
   * @param {KeyboardEvent} e - Event object
   * @private
   */
  _onKeyDown(e) {
    if (e.keyCode === keyCodes.SHIFT) {
      this._withShiftKey = true;
    }
  }

  /**
   * Keyup event handler
   * @param {KeyboardEvent} e - Event object
   * @private
   */
  _onKeyUp(e) {
    if (e.keyCode === keyCodes.SHIFT) {
      this._withShiftKey = false;
    }
  }
}

export default Cropper;
