import type { ComponentInternalInstance, SetupContext } from 'vue';
import { getCurrentInstance } from 'vue';
import type { Object as FabricObject, Canvas, IText, Text, Textbox, Image } from 'fabric';
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
const suffixRegExp = /^on([A-Za-z:]+)$/;
// export const
/**
 * @abstract 事件绑定/解绑
 * @param instance 组件实例
 * @param attrs 组件属性
 * @param events 事件列表
 * @param {enum} type on/off 绑定/解绑
 */
// eslint-disable-next-line max-params
const bindEvent = (instance: any, attrs: ComponentInternalInstance['attrs'], events: string[], type?: 'on' | 'off') => {
  // 事件绑定
  for (const [name, handlerEvent] of Object.entries(attrs)) {
    const match = name.match(suffixRegExp);
    if (match) {
      const eventName = match[1].toLowerCase();
      if (events.includes(eventName)) {
        if (type === 'on') {
          instance.off(eventName);
          instance.on(eventName, handlerEvent);
        }
        if (type === 'off') {
          instance.off(eventName);
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
export function useBindCanvasEvent(canvas: Canvas, eventType: 'on' | 'off') {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  if (!Object.keys(attrs).length) return;
  bindEvent(canvas, attrs, canvasEvents, eventType);
}
/**
 * 对象事件绑定/解绑
 * @param object 画布实例
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindObjectEvent(object: FabricObject, eventType: 'on' | 'off') {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  // const emits = type.emits as string[]
  if (!Object.keys(attrs).length) return;
  bindEvent(object, attrs, objectEvents, eventType);
}
/**
 * 文字补充事件绑定/解绑
 * @param text 文字实例
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindTextEvent(textObject: Textbox | IText | Text, eventType: 'on' | 'off') {
  const ctx = getCurrentInstance();
  if (!ctx) return;
  const { attrs } = ctx;
  if (!Object.keys(attrs).length) return;
  // 文字事件处理函数
  bindEvent(textObject, attrs, [...objectEvents, ...textEvents], eventType);
}
/**
 * Image事件绑定/解绑
 * @param image 图片实例
 * @param {String[]} attrs on/off 绑定/解绑
 * @param {enum} type on/off 绑定/解绑
 */
export function useBindImageEvent(image: Image, attrs: SetupContext['attrs'], type: 'on' | 'off') {
  if (!Object.keys(attrs).length) return;
  bindEvent(image, attrs, objectEvents, type);
}
