import { Object as FabricObject, util, Point, Color } from 'fabric';
import type { Canvas, ModifiedEvent } from 'fabric';
import { objectKeys } from '../utils';
import type {
  VerticalLineCoords,
  HorizontalLineCoords,
  ACoordsExtendsCenter,
  IgnoreObjTypes,
  TACoords,
  SnapProps,
  AlignGuidelinesProps,
  AlignGuidelinesOptions,
  AlignGuidelinesPreset,
  LineSignOptions,
  PointArray
} from '../types';
const defaultAlignGuidelinesOptions: AlignGuidelinesOptions = {
  autoAdsorb: true,
  aligningLineMargin: 5,
  aligningLineWidth: 1,
  aligningLineColor: '#fff',
  isOpenLineSign: true,
  isOpenAlignGuidelines: true,
  alignGuidelinesPreset: ['canvas', 'object', 'objectRotation'],
  lineSignOptions: {
    lineWidth: 0.5,
    size: 2.5,
    color: '#fff'
  },
  ignoreObjTypes: [],
  pickObjTypes: []
};
export class AlignGuidelines {
  /**
   * 吸附安全距离
   * @type {number}
   * @default 5
   */
  declare aligningLineMargin: number;

  /**
   * 吸附开关
   * @type {boolean}
   * @default true
   */
  declare autoAdsorb: boolean;

  /**
   * 吸附线的宽度
   * @type {number}
   * @default 1
   */
  declare aligningLineWidth: number;

  /**
   * 吸附线的颜色
   * @type {string}
   * @default #fff
   */
  declare aligningLineColor: string;

  /**
   * 是否开启辅助线
   * @type {boolean}
   * @default true
   */
  declare isOpenAlignGuidelines?: boolean;

  /**
   * 是否开启标记线
   */
  declare isOpenLineSign?: boolean;

  /**
   * 标记线样式选项
   */
  declare lineSignOptions?: LineSignOptions;

  /**
   * 辅助线预设 canvas: 画布边缘及其画布XY中心轴  object: 对象边缘  objectRotation: 对象旋转的边缘
   * @type {AlignGuidelinesPreset}  'canvas' | 'object' | 'objectRotation'
   * @default 'canvas'
   */
  declare alignGuidelinesPreset?: AlignGuidelinesPreset;

  /**
   * 忽略的对象类型
   * @type {IgnoreObjTypes}
   */
  private ignoreObjTypes?: IgnoreObjTypes;

  /**
   * 包含对象类型
   * @type {IgnoreObjTypes}
   */
  private pickObjTypes?: IgnoreObjTypes;

  /**
   * canvas实例
   * @type {Canvas}
   */
  private canvas: Canvas;

  /**
   * canvas的上下文
   * @type {CanvasRenderingContext2D}
   */
  private _canvasCtx: CanvasRenderingContext2D;

  /**
   * 水平辅助线集合
   * @type {HorizontalLineCoords[]}
   */
  private _horizontalLines: HorizontalLineCoords[] = [];

  /**
   * 垂直辅助线集合
   * @type {VerticalLineCoords[]}
   */
  private _verticalLines: VerticalLineCoords[] = [];

  /**
   * 旋转辅助线开关
   * @type {boolean}
   */
  private _onOffRotationGuidelines = false;

  constructor({ canvas, options }: AlignGuidelinesProps) {
    this.canvas = canvas;
    this._canvasCtx = canvas.getSelectionContext();
    const alignOptions: AlignGuidelinesOptions = options
      ? { ...defaultAlignGuidelinesOptions, ...options }
      : defaultAlignGuidelinesOptions;
    Object.keys(alignOptions).forEach(key => {
      Object.defineProperty(this, key, {
        value: alignOptions[key],
        writable: true,
        enumerable: true,
        configurable: true
      });
    });
  }

  /**
   * 绘制复制线标志,用于标记吸附线的位置
   * @param x {number} x坐标
   * @param y {number} y坐标
   */
  private drawSign(x: number, y: number) {
    const ctx = this._canvasCtx;
    const size = this.lineSignOptions!.size!;
    ctx.lineWidth = this.lineSignOptions!.lineWidth!;
    ctx.strokeStyle = this.lineSignOptions?.color ? this.lineSignOptions.color : this.aligningLineColor;
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
  }

  /**
   *  绘制辅助线
   * @param x1 {number} 起始点x坐标
   * @param y1  {number} 起始点y坐标
   * @param x2  {number} 结束点x坐标
   * @param y2  {number} 结束点y坐标
   */
  // eslint-disable-next-line max-params
  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this._canvasCtx;
    const point1 = util.transformPoint(new Point(x1, y1), this.canvas.viewportTransform);
    const point2 = util.transformPoint(new Point(x2, y2), this.canvas.viewportTransform);

    ctx.save();
    ctx.lineWidth = this.aligningLineWidth;
    ctx.strokeStyle = this.aligningLineColor;
    ctx.beginPath();

    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);

    ctx.stroke();

    this.isOpenLineSign && this.drawSign(point1.x, point1.y);
    this.isOpenLineSign && this.drawSign(point2.x, point2.y);

    ctx.restore();
  }

  /**
   *  绘制垂直辅助线
   * @param coords {VerticalLineCoords}
   * @returns {void}
   */
  private drawVerticalLine(coords: VerticalLineCoords): void {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    const movingCoords = this.getObjDraggingObjCoords(activeObject);
    if (!objectKeys(movingCoords).some(key => Math.abs(movingCoords[key].x - coords.x) < 0.1)) return;
    this.drawLine(
      coords.x ? coords.x - this.aligningLineWidth / 2 : coords.x + this.aligningLineWidth / 2,
      Math.min(coords.y1, coords.y2),
      coords.x ? coords.x - this.aligningLineWidth / 2 : coords.x + this.aligningLineWidth / 2,
      Math.max(coords.y1, coords.y2)
    );
  }

  /**
   * 绘制水平辅助线
   * @param coords {HorizontalLineCoords}
   * @returns {void}
   */
  private drawHorizontalLine(coords: HorizontalLineCoords): void {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    const movingCoords = this.getObjDraggingObjCoords(activeObject);
    if (!objectKeys(movingCoords).some(key => Math.abs(movingCoords[key].y - coords.y) < 0.1)) return;
    this.drawLine(
      Math.min(coords.x1, coords.x2),
      coords.y ? coords.y - this.aligningLineWidth / 2 : coords.y + this.aligningLineWidth / 2,
      Math.max(coords.x1, coords.x2),
      coords.y ? coords.y - this.aligningLineWidth / 2 : coords.y + this.aligningLineWidth / 2
    );
  }

  /**
   * 绘制旋转辅助线
   */
  private drawRotationGuidelines(): void {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || !this._onOffRotationGuidelines) return;
    // 获取对象中心点坐标
    const center = activeObject!.getCenterPoint();
    const angle = activeObject!.angle;
    const { width, height } = this.canvas;
    const lineSize = width > height ? width : height;
    const lineColor = new Color(this.aligningLineColor);
    const ctx = this._canvasCtx;
    // 虚线从中心到边缘透明度过渡
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, lineSize / 2);
    gradient.addColorStop(1, lineColor.setAlpha(0).toRgba());
    gradient.addColorStop(0, lineColor.setAlpha(1).toRgba());
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = this.aligningLineColor;
    ctx.lineWidth = this.aligningLineWidth;
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    // 0度角
    ctx.moveTo(center.x, center.y - lineSize / 2);
    ctx.lineTo(center.x, center.y + lineSize / 2);
    // 90度角
    ctx.moveTo(center.x - lineSize / 2, center.y);
    ctx.lineTo(center.x + lineSize / 2, center.y);
    // 45度角
    ctx.moveTo(center.x - lineSize / 2, center.y - lineSize / 2);
    ctx.lineTo(center.x + lineSize / 2, center.y + lineSize / 2);
    // 135度角
    ctx.moveTo(center.x + lineSize / 2, center.y - lineSize / 2);
    ctx.lineTo(center.x - lineSize / 2, center.y + lineSize / 2);
    ctx.stroke();
    // 添加矩形
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.fillRect(center.x - 18, center.y - 10, 36, 20);
    ctx.stroke();
    // 添加文字
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.beginPath();
    ctx.fillText(`${Math.round(angle)}°`, center.x, center.y);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 判断是否进入范围（进入吸附）
   * @param point1
   * @param point2
   * @returns {boolean}
   */
  private isInRange(point1: number, point2: number) {
    const zoom = this.canvas.getZoom();
    return Math.abs(point1 - point2) <= this.aligningLineMargin / zoom;
  }

  /**
   *  置空吸附线缓存
   */
  private clearLinesMeta() {
    this._horizontalLines.length = 0;
    this._verticalLines.length = 0;
  }

  /**
   *
   * @param activeObject 活动对象
   * @returns {ACoordsExtendsCenter}
   */
  private getObjDraggingObjCoords(activeObject: FabricObject): ACoordsExtendsCenter {
    const aCoords = activeObject.aCoords;
    const centerPoint = new Point((aCoords.tl.x + aCoords.br.x) / 2, (aCoords.tl.y + aCoords.br.y) / 2);
    const offsetX = centerPoint.x - activeObject.getCenterPoint().x;
    const offsetY = centerPoint.y - activeObject.getCenterPoint().y;
    const newACoords = objectKeys(aCoords).reduce(
      (pre, cur) => {
        return {
          ...pre,
          [cur]: {
            x: aCoords[cur].x - offsetX,
            y: aCoords[cur].y - offsetY
          }
        };
      },
      {
        c: activeObject.getCenterPoint()
      }
    );
    return newACoords as ACoordsExtendsCenter;
  }

  /**
   *  当对象被旋转时，需要忽略一些坐标，例如水平辅助线只取最上、下边的坐标
   * @param objCoords {ACoordsExtendsCenter}
   * @param type {string} 'vertical' | 'horizontal'
   * @returns
   */
  private omitCoords(objCoords: ACoordsExtendsCenter, type: 'vertical' | 'horizontal') {
    let newCoords;
    if (type === 'vertical') {
      let l: PointArray = ['tl', objCoords.tl];
      let r: PointArray = ['tl', objCoords.tl];
      objectKeys(objCoords).forEach(key => {
        if (objCoords[key].x < l[1].x) {
          l = [key, objCoords[key]];
        }
        if (objCoords[key].x > r[1].x) {
          r = [key, objCoords[key]];
        }
      });
      newCoords = {
        [l[0]]: l[1],
        [r[0]]: r[1],
        c: objCoords.c
      };
    } else {
      let t: PointArray = ['tl', objCoords.tl];
      let b: PointArray = ['tl', objCoords.tl];
      objectKeys(objCoords).forEach(key => {
        if (objCoords[key].y < t[1].y) {
          t = [key, objCoords[key]];
        }
        if (objCoords[key].y > b[1].y) {
          b = [key, objCoords[key]];
        }
      });
      newCoords = {
        [t[0]]: t[1],
        [b[0]]: b[1],
        c: objCoords.c
      };
    }
    return newCoords;
  }

  /**
   * 根据对象的坐标计算对象的宽高
   * @param coords {ACoordsExtendsCenter}
   * @returns
   */
  private getObjMaxWidthHeightByCoords(coords: ACoordsExtendsCenter) {
    const objHeight = Math.max(Math.abs(coords.c.y - coords.tl.y), Math.abs(coords.c.y - coords.tr.y)) * 2;
    const objWidth = Math.max(Math.abs(coords.c.x - coords.tl.x), Math.abs(coords.c.x - coords.tr.x)) * 2;
    return { objHeight, objWidth };
  }

  /**
   *FabricObject.getCenterPoint将通过鼠标移动和拖动距离返回对象计算的中心点。
   * calcCenterPointByACoords将返回对象位置的真实中心点。
   * @param coords
   * @returns {Point}
   */
  private calcCenterPointByACoords(coords: TACoords): Point {
    return new Point((coords.tl.x + coords.br.x) / 2, (coords.tl.y + coords.br.y) / 2);
  }

  /**
   * private
   * @param activeObject 活动对象
   * @param snapXPoints
   * @type {SnapProps}
   */
  private snap({ activeObject, draggingObjCoords, snapXPoints, snapYPoints }: SnapProps) {
    const sortPoints = (list: number[], originPoint: number) => {
      if (!list.length) return originPoint;
      return list
        .map(val => ({
          abs: Math.abs(originPoint - val),
          val
        }))
        .sort((a, b) => a.abs - b.abs)[0].val;
    };
    activeObject.setPositionByOrigin(
      // 自动捕捉最近的对象，记录所有捕捉点，然后查找最近的一个
      new Point(sortPoints(snapXPoints, draggingObjCoords.c.x), sortPoints(snapYPoints, draggingObjCoords.c.y)),
      'center',
      'center'
    );
  }

  /**
   *  遍历所有对象绘制测量线，计算对象的坐标点
   * @param activeObject
   * @param canvasObjects
   */
  private traverseAllObjects(activeObject: FabricObject, canvasObjects: FabricObject[]) {
    const objCoordsByMovingDistance = this.getObjDraggingObjCoords(activeObject);
    const snapXPoints: number[] = [];
    const snapYPoints: number[] = [];
    for (let i = canvasObjects.length; i--; ) {
      // eslint-disable-next-line no-continue
      if (canvasObjects[i] === activeObject) continue;
      const objCoords = {
        ...canvasObjects[i].aCoords,
        c: canvasObjects[i].getCenterPoint()
      };
      const { objHeight, objWidth } = this.getObjMaxWidthHeightByCoords(objCoords);
      objectKeys(objCoordsByMovingDistance).forEach(activeObjPoint => {
        const newCoords = canvasObjects[i].angle !== 0 ? this.omitCoords(objCoords, 'horizontal') : objCoords;
        function calcHorizontalLineCoords(objPoint: keyof ACoordsExtendsCenter, activeObjCoords: ACoordsExtendsCenter) {
          let x1: number;
          let x2: number;
          if (objPoint === 'c') {
            x1 = Math.min(objCoords.c.x - objWidth / 2, activeObjCoords[activeObjPoint].x);
            x2 = Math.max(objCoords.c.x + objWidth / 2, activeObjCoords[activeObjPoint].x);
          } else {
            x1 = Math.min(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x);
            x2 = Math.max(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x);
          }
          return { x1, x2 };
        }
        objectKeys(newCoords).forEach(objPoint => {
          if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].y, objCoords[objPoint].y)) {
            const y = objCoords[objPoint].y;
            const offset = objCoordsByMovingDistance[activeObjPoint].y - y;
            snapYPoints.push(objCoordsByMovingDistance.c.y - offset);
            if (activeObject.aCoords) {
              const { x1, x2 } = calcHorizontalLineCoords(objPoint, {
                ...activeObject.aCoords,
                c: this.calcCenterPointByACoords(activeObject.aCoords)
              });
              this._horizontalLines.push({ y, x1, x2 });
            } else {
              const { x1, x2 } = calcHorizontalLineCoords(objPoint, objCoordsByMovingDistance);
              this._horizontalLines.push({ y, x1, x2 });
            }
          }
        });
      });
      objectKeys(objCoordsByMovingDistance).forEach(activeObjPoint => {
        const newCoords = canvasObjects[i].angle !== 0 ? this.omitCoords(objCoords, 'vertical') : objCoords;
        function calcVerticalLineCoords(objPoint: keyof ACoordsExtendsCenter, activeObjCoords: ACoordsExtendsCenter) {
          let y1: number;
          let y2: number;
          if (objPoint === 'c') {
            y1 = Math.min(newCoords.c.y - objHeight / 2, activeObjCoords[activeObjPoint].y);
            y2 = Math.max(newCoords.c.y + objHeight / 2, activeObjCoords[activeObjPoint].y);
          } else {
            y1 = Math.min(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y);
            y2 = Math.max(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y);
          }
          return { y1, y2 };
        }
        objectKeys(newCoords).forEach(objPoint => {
          if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].x, objCoords[objPoint].x)) {
            const x = objCoords[objPoint].x;
            const offset = objCoordsByMovingDistance[activeObjPoint].x - x;
            snapXPoints.push(objCoordsByMovingDistance.c.x - offset);
            if (activeObject.aCoords) {
              const { y1, y2 } = calcVerticalLineCoords(objPoint, {
                ...activeObject.aCoords,
                c: this.calcCenterPointByACoords(activeObject.aCoords)
              });
              this._verticalLines.push({ x, y1, y2 });
            } else {
              const { y1, y2 } = calcVerticalLineCoords(objPoint, objCoordsByMovingDistance);
              this._verticalLines.push({ x, y1, y2 });
            }
          }
        });
      });
      this.autoAdsorb &&
        this.snap({
          activeObject,
          draggingObjCoords: objCoordsByMovingDistance,
          snapXPoints,
          snapYPoints
        });
    }
  }

  /**
   * 清除辅助线
   */
  private clearGuideline() {
    this.canvas.clearContext(this._canvasCtx);
  }
  /**
   * 属性修改事件回调
   */

  private bindModifiedEventCallback(e: ModifiedEvent) {
    this.clearLinesMeta();
    const activeObject = e.target;
    const canvasAllObjects: FabricObject[] = [];
    const canvasObjects = this.canvas.getObjects().filter(obj => {
      if (this.ignoreObjTypes?.length) {
        return !this.ignoreObjTypes.some(item => (obj as any)[item.key] === item.value);
      }
      if (this.pickObjTypes?.length) {
        return this.pickObjTypes.some(item => (obj as any)[item.key] === item.value);
      }
      return true;
    }) as FabricObject[];
    this.alignGuidelinesPreset?.includes('object') && canvasAllObjects.push(...canvasObjects);
    if (this.alignGuidelinesPreset?.includes('canvas')) {
      const zoom = this.canvas.getZoom();
      // 模拟一个画布对象，添加中心和边界辅助线
      const cObject = new FabricObject({
        left: 0,
        top: 0,
        padding: 0,
        width: this.canvas.width / zoom,
        height: this.canvas.height / zoom,
        selectable: false,
        evented: false,
        strokeWidth: 0,
        stroke: 'transparent'
      });
      cObject.setCoords();
      canvasAllObjects.push(cObject);
    }
    const transform = this.canvas._currentTransform;
    if (!transform) return;
    this.traverseAllObjects(activeObject, canvasAllObjects);
  }

  /**
   * 监听对象属性修改事件
   */
  private watchObjectModified() {
    this.canvas.on('object:moving', (e: ModifiedEvent) => {
      this.bindModifiedEventCallback(e);
    });
    this.canvas.on('object:scaling', (e: ModifiedEvent) => {
      this.autoAdsorb = false;
      this.bindModifiedEventCallback(e);
      this.autoAdsorb = true;
    });
    this.canvas.on('object:rotating', () => {
      if (this.alignGuidelinesPreset?.includes('objectRotation')) {
        !this._onOffRotationGuidelines && (this._onOffRotationGuidelines = true);
      }
    });
  }

  /**
   * 监听渲染事件
   */
  private watchRender() {
    this.canvas.on('before:render', () => {
      this.clearGuideline();
    });
    this.canvas.on('after:render', () => {
      for (let i = this._verticalLines.length; i--; ) {
        this.drawVerticalLine(this._verticalLines[i]);
      }
      for (let i = this._horizontalLines.length; i--; ) {
        this.drawHorizontalLine(this._horizontalLines[i]);
      }
      this.alignGuidelinesPreset?.includes('objectRotation') && this.drawRotationGuidelines();
      this.canvas.calcOffset();
    });
  }

  /**
   * 监听鼠标事件
   */
  private watchMouseEvent() {
    this.canvas.on('mouse:down', () => {
      this.clearLinesMeta();
    });
    this.canvas.on('mouse:up', () => {
      this._onOffRotationGuidelines = false;
      this.clearGuideline();
      this.clearLinesMeta();
      this.canvas.renderAll();
    });
    this.canvas.on('mouse:wheel', () => {
      this.clearLinesMeta();
    });
  }

  init() {
    if (this.isOpenAlignGuidelines) {
      this.watchObjectModified();
      this.watchRender();
      this.watchMouseEvent();
    }
  }
}
