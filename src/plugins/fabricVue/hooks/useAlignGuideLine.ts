// import { Point } from 'fabric';
// import type { Canvas, TMat2D, TACoords } from 'fabric';
// import type { AlignGuideline } from '../types';
// import { alignGuidelineSettings } from '../settings';
// export const useAlignGuideLine = (canvas: Canvas, _align: AlignGuideline) => {
//   const { aligningLineOffset, aligningLineMargin, aligningLineWidth, aligningLineColor, aligningLineColorBase } =
//     alignGuidelineSettings;
//   const ctx = canvas.getSelectionContext();
//   const verticalLines = [];
//   const horizontalLines = [];
//   let zoomRatio = 1;
//   let viewportTransform: TMat2D;
//   // 绘制辅助线
//   function drawLine(x1, y1, x2, y2) {
//     ctx.save();
//     ctx.lineWidth = aligningLineWidth;
//     ctx.strokeStyle = aligningLineColor;
//     ctx.beginPath();
//     ctx.moveTo((x1 + viewportTransform[4]) * zoomRatio, (y1 + viewportTransform[5]) * zoomRatio);
//     ctx.lineTo((x2 + viewportTransform[4]) * zoomRatio, (y2 + viewportTransform[5]) * zoomRatio);
//     ctx.stroke();
//     ctx.restore();
//   }
//   // 绘制竖直辅助线
//   function drawVerticalLine(coords: Record<string, number>) {
//     drawLine(
//       coords.x ? coords.x - 0.5 : coords.x + 0.5,
//       coords.y1 > coords.y2 ? coords.y2 : coords.y1,
//       coords.x ? coords.x - 0.5 : coords.x + 0.5,
//       coords.y2 > coords.y1 ? coords.y2 : coords.y1
//     );
//   }
//   // 绘制水平辅助线
//   function drawHorizontalLine(coords: Record<string, number>) {
//     drawLine(
//       coords.x1 > coords.x2 ? coords.x2 : coords.x1,
//       coords.y ? coords.y - 0.5 : coords.y + 0.5,
//       coords.x2 > coords.x1 ? coords.x2 : coords.x1,
//       coords.y ? coords.y - 0.5 : coords.y + 0.5
//     );
//   }

//   /**
//    * @description 是否在吸附区间内;
//    * @params value1: 辅助线位置
//    * @params value2: 拖拽的元素位置
//    * aligningLineMargin: 自动吸附距离
//    */
//   function isInRange(value1, value2) {
//     return value2 > value1 - aligningLineMargin && value2 < value1 + aligningLineMargin;
//   }

//   /**
//    * @description 辅助线;
//    * @params verticalList: 辅助线left
//    * @params horizontalList: 辅助线left
//    * @params objCenterList: left/top吸附位置
//    * @params activeObject: 拖拽的元素实例对象
//    * @params activeObjectCenter: 拖拽元素的中心位置
//    */
//   function snapAll(verticalList, horizontalList, objCenterList, activeObject, activeObjectCenter) {
//     let verticalCenter = activeObjectCenter.x;
//     let horizontalCenter = activeObjectCenter.y;
//     objCenterList.forEach((v, index) => {
//       if (isInRange(v.x, activeObjectCenter.x)) {
//         verticalLines.push({
//           x: verticalList[index],
//           y1: 0,
//           y2: canvas.height
//         });
//         verticalCenter = v.x;
//       }
//       if (isInRange(v.y, activeObjectCenter.y)) {
//         horizontalLines.push({
//           y: horizontalList[index],
//           x1: 0,
//           x2: canvas.width
//         });
//         horizontalCenter = v.y;
//       }
//     });
//     if (verticalLines.length || horizontalLines.length) {
//       activeObject.setPositionByOrigin(new Point(verticalCenter, horizontalCenter), 'center', 'center');
//     }
//   }
//   const initAligningGuidelines = () => {
//     canvas.on('mouse:down', () => {
//       viewportTransform = canvas.viewportTransform;
//       zoomRatio = canvas.getZoom();
//     });

//     canvas.on('object:moving', e => {
//       const activeObject = e.target;
//       // 获取当前拖拽的元素的中心点坐标
//       const activeObjectCenter = activeObject.getCenterPoint();
//       // 当前拖拽元素的boundingReact信息
//       const activeObjectBoundingRect = activeObject.getBoundingRect();
//       // boundingReact的宽高信息
//       const activeObjectHalfHeight = activeObjectBoundingRect.height / (2 * viewportTransform[3]);
//       const activeObjectHalfWidth = activeObjectBoundingRect.width / (2 * viewportTransform[0]);
//       // 画布的transform信息
//       const transform = canvas._currentTransform;

//       if (!transform) return;
//       const verticalList = [0, canvas.width / 2, canvas.width];
//       const horizontalList = [0, canvas.height / 2, canvas.height];
//       const objectCenterList = [
//         { x: activeObjectHalfWidth, y: activeObjectHalfHeight },
//         { x: canvas.width / 2, y: canvas.height / 2 },
//         { x: canvas.width - activeObjectHalfWidth, y: canvas.height - activeObjectHalfHeight }
//       ];
//       snapAll(verticalList, horizontalList, objectCenterList, activeObject, activeObjectCenter);
//     });

//     canvas.on('before:render', () => {
//       canvas.contextTop && canvas.clearContext(canvas.contextTop);
//     });

//     canvas.on('after:render', () => {
//       for (var i = verticalLines.length; i--; ) {
//         drawVerticalLine(verticalLines[i]);
//       }
//       for (var i = horizontalLines.length; i--; ) {
//         drawHorizontalLine(horizontalLines[i]);
//       }
//       verticalLines.length = horizontalLines.length = 0;
//     });

//     canvas.on('mouse:up', () => {
//       verticalLines.length = horizontalLines.length = 0;
//       canvas.renderAll();
//     });
//   };
//   return {
//     initAligningGuidelines
//   };
// };
