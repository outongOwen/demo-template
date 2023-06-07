import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Canvas } from 'fabric';
import { useBindCanvasEvent } from '../hooks';
import { useCanvasContext } from '../context';
export interface CanvasInst {
  instance: Canvas;
  renderAll: () => void;
  requestRenderAll: () => void;
}
export const canvasProps = {
  config: {
    type: Object as PropType<Partial<typeof Canvas>>,
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
    const canvas = new Canvas(canvasElement, props.config);
    canvas.renderAll();
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
