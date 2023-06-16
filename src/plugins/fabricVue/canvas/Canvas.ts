import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Canvas, config as fabricConfigurations } from 'fabric';
import type { TConfiguration } from '@fabric/config';
import { useBindCanvasEvent } from '../hooks';
import { useCanvasContext, useControlsContext } from '../context';
import type { FControlProps, TControlSet, ControlsVisibility, AlignGuidelinesOptions } from '../types';
import { AlignGuidelines } from '../plugins';
export interface FCanvasConfiguration extends TConfiguration {}
export type FCanvasConfig = Record<string, any>;
export interface CanvasInst {
  instance: Canvas;
  renderAll: () => void;
  requestRenderAll: () => void;
}
export const canvasProps = {
  config: {
    type: Object as PropType<FCanvasConfig>,
    default: () => {}
  },
  configuration: {
    type: Object as PropType<FCanvasConfiguration>,
    default: () => {}
  },
  controlsVisibility: {
    type: Object as PropType<ControlsVisibility>,
    default: () => {}
  },
  controlProps: {
    type: Object as PropType<FControlProps>,
    default: () => {}
  },
  controls: {
    type: Object as PropType<TControlSet>,
    default: () => {}
  },
  alignGuidelines: {
    type: Object as PropType<AlignGuidelinesOptions>,
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
    const { provideControlsContext } = useControlsContext();

    const canvasElement = document.createElement('canvas');
    const canvas = new Canvas(canvasElement, props.config);
    /**
     *  设置canvas的配置
     */
    props.configuration && Object.assign(fabricConfigurations, props.configuration);
    /**
     * 设置对齐线
     */
    const guideline = new AlignGuidelines({
      canvas,
      options: props.alignGuidelines
    });
    guideline.init();
    const renderAll = () => {
      canvas.renderAll();
    };
    const requestRenderAll = () => {
      canvas.requestRenderAll();
    };
    // 全局注入canvas实例
    provideCanvasContext({
      instance: canvas,
      renderAll,
      requestRenderAll
    });
    // 全局注入controls配置
    provideControlsContext({
      controlProps: props.controlProps,
      controls: props.controls,
      controlsVisibility: props.controlsVisibility
    });
    onMounted(() => {
      useBindCanvasEvent(canvas, 'bind');
    });
    onBeforeUnmount(() => {
      canvas.off(); // 移除所有事件
      canvas?.dispose();
      canvasElement?.remove();
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
