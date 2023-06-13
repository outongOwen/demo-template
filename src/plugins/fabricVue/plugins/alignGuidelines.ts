import { Object, util, Point } from 'fabric';
import type { Canvas, Object as FabricObject, TMat2D } from 'fabric';
import { objectKeys } from '../utils';
import type { VerticalLineCoords, HorizontalLineCoords, ACoordsExtendsCenter, IgnoreObjTypes } from '../types';

export class AlignGuidelines {
  /**
   * 吸附线的间距
   * @type {number}
   */
  protected aligningLineMargin = 5;

  /**
   * 吸附线的宽度
   * @type {number}
   */
  protected aligningLineWidth = 1;

  /**
   * 吸附线的颜色
   * @type {string}
   */
  protected aligningLineColor = '#fff';

  /**
   * 忽略的对象类型
   * @type {IgnoreObjTypes}
   */
  declare ignoreObjTypes?: IgnoreObjTypes;

  /**
   * 包含对象类型
   * @type {IgnoreObjTypes}
   */
  declare pickObjTypes?: IgnoreObjTypes;

  /**
   * canvas实例
   * @type {Canvas}
   */
  declare canvas: Canvas;

  /**
   * canvas的上下文
   * @type {CanvasRenderingContext2D}
   */
  declare ctx: CanvasRenderingContext2D;

  /**
   * 视口的变换
   * @type {TMat2D}
   */
  private declare viewportTransform: TMat2D;

  /**
   * 水平线集合
   * @type {HorizontalLineCoords[]}
   */
  private horizontalLines: HorizontalLineCoords[] = [];

  /**
   * 垂直线集合
   * @type {VerticalLineCoords[]}
   */
  private verticalLines: VerticalLineCoords[] = [];

  /**
   * 拖拽的元素实例对象
   * @type {FabricObject}
   */
  private activeObj: FabricObject = new Object();

  constructor({
    canvas,
    aligningOptions,
    ignoreObjTypes,
    pickObjTypes
  }: {
    canvas: Canvas;
    aligningOptions?: {
      lineMargin?: number;
      lineWidth?: number;
      lineColor?: string;
    };
    ignoreObjTypes?: IgnoreObjTypes;
    pickObjTypes?: IgnoreObjTypes;
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getSelectionContext();
    this.ignoreObjTypes = ignoreObjTypes || [];
    this.pickObjTypes = pickObjTypes || [];
    if (aligningOptions) {
      this.aligningLineMargin = aligningOptions.lineMargin || this.aligningLineMargin;
      this.aligningLineWidth = aligningOptions.lineWidth || this.aligningLineWidth;
      this.aligningLineColor = aligningOptions.lineColor || this.aligningLineColor;
    }
  }

  private drawSign(x: number, y: number) {
    const ctx = this.ctx;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = this.aligningLineColor;
    ctx.beginPath();
    const size = 2;
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
  }

  // eslint-disable-next-line max-params
  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this.ctx;
    const point1 = util.transformPoint(new Point(x1, y1), this.canvas.viewportTransform);
    const point2 = util.transformPoint(new Point(x2, y2), this.canvas.viewportTransform);

    // use origin canvas api to draw guideline
    ctx.save();
    ctx.lineWidth = this.aligningLineWidth;
    ctx.strokeStyle = this.aligningLineColor;
    ctx.beginPath();

    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);

    ctx.stroke();

    this.drawSign(point1.x, point1.y);
    this.drawSign(point2.x, point2.y);

    ctx.restore();
  }

  private drawVerticalLine(coords: VerticalLineCoords) {
    const movingCoords = this.getObjDraggingObjCoords(this.activeObj);
    if (!objectKeys(movingCoords).some(key => Math.abs(movingCoords[key].x - coords.x) < 0.0001)) return;
    this.drawLine(coords.x, Math.min(coords.y1, coords.y2), coords.x, Math.max(coords.y1, coords.y2));
  }

  private drawHorizontalLine(coords: HorizontalLineCoords) {
    const movingCoords = this.getObjDraggingObjCoords(this.activeObj);
    if (!objectKeys(movingCoords).some(key => Math.abs(movingCoords[key].y - coords.y) < 0.0001)) return;
    this.drawLine(Math.min(coords.x1, coords.x2), coords.y, Math.max(coords.x1, coords.x2), coords.y);
  }

  private isInRange(value1: number, value2: number) {
    return Math.abs(Math.round(value1) - Math.round(value2)) <= this.aligningLineMargin / this.canvas.getZoom();
  }

  private watchMouseDown() {
    this.canvas.on('mouse:down', () => {
      this.clearLinesMeta();
      this.viewportTransform = this.canvas.viewportTransform;
    });
  }

  private watchMouseUp() {
    this.canvas.on('mouse:up', () => {
      this.clearLinesMeta();
      this.canvas.renderAll();
    });
  }

  private watchMouseWheel() {
    this.canvas.on('mouse:wheel', () => {
      this.clearLinesMeta();
    });
  }

  private clearLinesMeta() {
    this.horizontalLines.length = 0;
    this.verticalLines.length = 0;
  }

  private watchObjectMoving() {
    this.canvas.on('object:moving', e => {
      this.clearLinesMeta();
      const activeObject = e.target as FabricObject;
      this.activeObj = activeObject;
      const canvasObjects = this.canvas.getObjects().filter(obj => {
        if (this.ignoreObjTypes?.length) {
          return !this.ignoreObjTypes.some(item => (obj as any)[item.key] === item.value);
        }
        if (this.pickObjTypes?.length) {
          return this.pickObjTypes.some(item => (obj as any)[item.key] === item.value);
        }
        return true;
      }) as FabricObject[];
      // @ts-ignore
      const transform = this.canvas._currentTransform;
      if (!transform) return;
      this.traverseAllObjects(activeObject, canvasObjects);
    });
  }

  private getObjDraggingObjCoords(activeObject: FabricObject): ACoordsExtendsCenter {
    const aCoords = activeObject._getCoords();
    const centerPoint = new Point((aCoords.tl.x + aCoords.br.x) / 2, (aCoords.tl.y + aCoords.br.y) / 2);
    const offsetX = centerPoint.x - activeObject.getCenterPoint().x;
    const offsetY = centerPoint.y - activeObject.getCenterPoint().y;
    return objectKeys(aCoords).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: {
            x: aCoords[key].x - offsetX,
            y: aCoords[key].y - offsetY
          }
        };
      },
      {
        c: activeObject.getCenterPoint()
      }
    ) as ACoordsExtendsCenter;
  }

  // 当对象被旋转时，需要忽略一些坐标，例如水平辅助线只取最上、下边的坐标（参考 figma）
  private omitCoords(objCoords: ACoordsExtendsCenter, type: 'vertical' | 'horizontal') {
    let newCoords;
    type PointArr = [keyof ACoordsExtendsCenter, Point];
    if (type === 'vertical') {
      let l: PointArr = ['tl', objCoords.tl];
      let r: PointArr = ['tl', objCoords.tl];
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
      } as ACoordsExtendsCenter;
    } else {
      let t: PointArr = ['tl', objCoords.tl];
      let b: PointArr = ['tl', objCoords.tl];
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
      } as ACoordsExtendsCenter;
    }
    return newCoords;
  }

  private getObjMaxWidthHeightByCoords(coords: ACoordsExtendsCenter) {
    const objHeight = Math.max(Math.abs(coords.c.y - coords.tl.y), Math.abs(coords.c.y - coords.tr.y)) * 2;
    const objWidth = Math.max(Math.abs(coords.c.x - coords.tl.x), Math.abs(coords.c.x - coords.tr.x)) * 2;
    return { objHeight, objWidth };
  }

  /**
   *FabricObject.getCenterPoint将通过鼠标移动和拖动距离返回对象计算的中心点。
   * calcCenterPointByACoords将返回对象位置的真实中心点。
   */
  private calcCenterPointByACoords(coords: NonNullable<FabricObject['aCoords']>): Point {
    return new Point((coords.tl.x + coords.br.x) / 2, (coords.tl.y + coords.br.y) / 2);
  }

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
      } as ACoordsExtendsCenter;
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
              } as ACoordsExtendsCenter);
              this.horizontalLines.push({ y, x1, x2 });
            } else {
              const { x1, x2 } = calcHorizontalLineCoords(objPoint, objCoordsByMovingDistance);
              this.horizontalLines.push({ y, x1, x2 });
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
              } as ACoordsExtendsCenter);
              this.verticalLines.push({ x, y1, y2 });
            } else {
              const { y1, y2 } = calcVerticalLineCoords(objPoint, objCoordsByMovingDistance);
              this.verticalLines.push({ x, y1, y2 });
            }
          }
        });
      });

      this.snap({
        activeObject,
        draggingObjCoords: objCoordsByMovingDistance,
        snapXPoints,
        snapYPoints
      });
    }
  }

  private snap({
    activeObject,
    snapXPoints,
    draggingObjCoords,
    snapYPoints
  }: {
    activeObject: FabricObject;
    snapXPoints: number[];
    draggingObjCoords: ACoordsExtendsCenter;
    snapYPoints: number[];
  }) {
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
      // auto snap nearest object, record all the snap points, and then find the nearest one
      new Point(sortPoints(snapXPoints, draggingObjCoords.c.x), sortPoints(snapYPoints, draggingObjCoords.c.y)),
      'center',
      'center'
    );
  }

  clearGuideline() {
    this.canvas.clearContext(this.ctx);
  }

  watchRender() {
    this.canvas.on('before:render', () => {
      this.clearGuideline();
    });

    this.canvas.on('after:render', () => {
      for (let i = this.verticalLines.length; i--; ) {
        this.drawVerticalLine(this.verticalLines[i]);
      }
      for (let i = this.horizontalLines.length; i--; ) {
        this.drawHorizontalLine(this.horizontalLines[i]);
      }
      this.canvas.calcOffset();
    });
  }

  init() {
    this.watchObjectMoving();
    this.watchRender();
    this.watchMouseDown();
    this.watchMouseUp();
    this.watchMouseWheel();
  }
}
