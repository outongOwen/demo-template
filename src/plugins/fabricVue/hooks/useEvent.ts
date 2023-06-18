import type { ComponentInternalInstance } from 'vue';
import { getCurrentInstance } from 'vue';
import type { StaticCanvas, Canvas, Group, IText, Text, Textbox, Image } from 'fabric';
import type { TEventCallback } from '@fabric/Observable';
import type { FabricObject } from '../types';
type EventAction = 'bind' | 'unbind';
export const canvasEvents = [
  'object:modified',
  'object:moving',
  'object:scaling',
  'object:rotating',
  'object:skewing',
  'object:resizing',
  'object:selected',
  'object:added',
  'object:removed',
  'group:selected',
  'before:transform',
  'before:selection:cleared',
  'selection:cleared',
  'selection:created',
  'selection:updated',
  'mouse:up',
  'mouse:down',
  'mouse:move',
  'mouse:up:before',
  'mouse:down:before',
  'mouse:move:before',
  'mouse:dblclick',
  'mouse:wheel',
  'mouse:over',
  'mouse:out',
  'drop:before',
  'drop',
  'dragover',
  'dragenter',
  'dragleave',
  'before:render',
  'after:render',
  'canvas:cleared',
  // 文字事件
  'text:changed'
  // // path
  // 'path:added',
  // 'path:ends',
  // 'path:after',
  // 'path:created'
];
export const objectEvents = [
  'added',
  'removed',
  'selected',
  'deselected',
  'modified',
  'moving',
  'scaling',
  'rotating',
  'resizing',
  'skewing',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousewheel',
  'mousedblclick',
  'dragover',
  'dragenter',
  'dragleave',
  'drop'
];
export const textEvents = ['changed', 'selection:changed', 'editing:entered', 'editing:exited'];
// 匹配once事件 例如onOnceClick
const eventSuffixRegExp = /^(onOnce|on)(:?)([A-Za-z:]*)$/;
/**
 * @abstract 事件绑定/解绑
 * @param instance 组件实例
 * @param attrs 组件属性
 * @param events 事件列表
 * @param {enum} type on/off 绑定/解绑
 */

const bindEvent = (
  instance: StaticCanvas | Canvas | Group | FabricObject,
  {
    attrs,
    eventsName,
    eventAction
  }: { attrs: ComponentInternalInstance['attrs']; eventsName: string[]; eventAction?: EventAction }
) => {
  // 事件绑定
  for (const attrItem of Object.entries(attrs)) {
    const [name, handlerEvent] = attrItem as [string, TEventCallback];
    const match = name.match(eventSuffixRegExp);
    if (match) {
      const actionType = match[1] === 'onOnce' ? 'once' : match[1];
      const eventName = match[3].toLowerCase() as any;
      if (eventsName.includes(eventName)) {
        if (eventAction === 'bind' && actionType === 'once') {
          instance.once(eventName, handlerEvent);
        }
        if (eventAction === 'bind' && actionType === 'on') {
          instance.on(eventName, handlerEvent);
        }
        if (eventAction === 'unbind') {
          instance.off({ eventName, handlerEvent });
        }
      }
    }
  }
};
/**
 * @abstract 画布事件绑定/解绑
 * @param canvas 画布实例
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindCanvasEvent(canvas: Canvas, eventAction: EventAction) {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  if (!Object.keys(attrs).length) return;
  bindEvent(canvas, { attrs, eventsName: canvasEvents, eventAction });
}
/**
 * 对象事件绑定/解绑
 * @param object 画布实例
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindObjectEvent(object: FabricObject, eventAction: EventAction) {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  // const emits = type.emits as string[]
  if (!Object.keys(attrs).length) return;
  bindEvent(object, { attrs, eventsName: objectEvents, eventAction });
}
/**
 * 文字补充事件绑定/解绑
 * @param text 文字实例
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindTextEvent(textObject: Textbox | IText | Text, eventAction: EventAction) {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  if (!Object.keys(attrs).length) return;
  // 文字事件处理函数
  bindEvent(textObject, { attrs, eventsName: [...objectEvents, ...textEvents], eventAction });
}
/**
 * Image事件绑定/解绑
 * @param image 图片实例
 * @param {String[]} attrs on/off 绑定/解绑
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindImageEvent(image: Image, eventAction: EventAction) {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  if (!Object.keys(attrs).length) return;
  bindEvent(image, { attrs, eventsName: objectEvents, eventAction });
}
