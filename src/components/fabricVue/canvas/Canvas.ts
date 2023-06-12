import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { useBindCanvasEvent } from '../hooks';
import { useCanvasContext } from '../context';
import { CanvasVue } from './Canvas.class';
import type { FConfiguration, ICanvasVue, FOptions } from './Canvas.class';
export interface CanvasInst {
  instance: ICanvasVue;
  renderAll: () => void;
  requestRenderAll: () => void;
}
export const canvasProps = {
  config: {
    type: Object as PropType<FOptions>,
    default: () => {}
  },
  configuration: {
    type: Object as PropType<FConfiguration>,
    default: () => {}
  }
} as const;
export type CanvasProps = typeof canvasProps;
export default defineComponent({
  name: 'FabricCanvas',
  inheritAttrs: false,
  props: canvasProps,
  setup(props): CanvasInst {
    const { provideCanvasContext } = useCanvasContext();
    const canvasElement = document.createElement('canvas');
    const canvas = new CanvasVue({
      el: canvasElement,
      configuration: props.configuration,
      options: props.config
    });
    canvas.on('after:render', () => {
      console.log(canvas.getObjects(), 'canvas.getObjects()');
    });
    const renderAll = () => {
      canvas.renderAll();
    };
    const requestRenderAll = () => {
      canvas.requestRenderAll();
    };
    provideCanvasContext({
      instance: canvas,
      renderAll,
      requestRenderAll
    });
    onMounted(() => {
      useBindCanvasEvent(canvas, 'on');
    });
    onBeforeUnmount(() => {
      canvas?.dispose();
      canvasElement?.remove();
      useBindCanvasEvent(canvas, 'off');
    });
    return {
      instance: canvas,
      renderAll,
      requestRenderAll
    };
  },
  mounted() {
    this.$el.parentNode.insertBefore(this.instance!.wrapperEl, this.$el);
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
