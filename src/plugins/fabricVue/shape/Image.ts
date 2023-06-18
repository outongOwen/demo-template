import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, shallowRef, toRef, watch, watchEffect, toRefs } from 'vue';
import { watchOnce } from '@vueuse/core';
import { Image, util } from 'fabric';
import type { ImageProps as FabricImageProps, ImageSource, Canvas } from 'fabric';
import { cloneDeep, isEmpty, isString } from 'lodash-es';
import type { TProps } from '@fabric/shapes/Object/types';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindImageEvent, useControls } from '../hooks';
import { difference, throwError } from '../utils';
export type FImageProps = TProps<FabricImageProps> | Record<string, any>;
export type ImageInst = {
  instance: Image;
  canvasInstance: Canvas;
};
export const imageProps = {
  config: {
    type: Object as PropType<FImageProps>,
    default: () => {}
  },
  imageSource: {
    type: [Object, String] as PropType<ImageSource>,
    default: () => {}
  }
};
export type ImageProps = typeof imageProps;
export default defineComponent({
  name: 'FabricImage',
  inheritAttrs: false,
  props: imageProps,
  setup(props): ImageInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
    const { parentInstance } = useObjectParent();
    const { setControls } = useControls();
    const { imageSource, config } = toRefs(props);
    const imageObject = shallowRef<Image>(new Image(util.createCanvasElement()));
    setControls(imageObject.value, config.value);
    useBindImageEvent(imageObject.value, 'bind');
    const imageObjectRef = toRef(imageObject, 'value');
    watchOnce(imageSource, (imgSrc: ImageSource) => {
      if (!imgSrc) return;
      imageObject.value.set(config.value);
      parentInstance.add(imageObject.value);
      imageObject.value.applyFilters();
      imageObject.value.setCoords();
      canvasInject?.instance.requestRenderAll();
    });
    watch(imageSource, (src: ImageSource) => {
      if (!src || !canvasInject) return;
      imageObject.value.setElement(src);
      imageObject.value.setCoords();
      canvasInject.instance.requestRenderAll();
    });
    watch(
      () => cloneDeep(config.value),
      (newConfig, oldConfig) => {
        let isRefresh = false;
        const targetObject = imageObject.value;
        if (!oldConfig && !targetObject) return;
        const difProps = difference(newConfig, oldConfig);
        if (isEmpty(difProps)) return;
        if (Object.keys(difProps).includes('filters')) {
          nextTick(() => {
            targetObject.filters = difProps.filters;
            targetObject.applyFilters();
            canvasInject?.instance.renderAll();
          });
        } else {
          Object.entries(difProps).forEach(([key, value]) => {
            targetObject?.get(key) !== value && targetObject?.set(key, value) && (isRefresh = true);
          });
          if (isRefresh) {
            targetObject.setCoords();
            canvasInject?.instance.renderAll();
          }
        }
      },
      {
        deep: true
      }
    );
    onBeforeUnmount(() => {
      if (imageObject.value) {
        imageObject.value.off();
        parentInstance && parentInstance.remove(imageObject.value);
      }
    });
    watchEffect(() => {
      if (isString(imageSource.value) || !isEmpty(imageSource.value)) {
        throwError(
          'Image',
          'please use [HTMLImageElement | HTMLVideoElement | HTMLCanvasElement] type element instead of string'
        );
      }
    });
    return {
      instance: imageObjectRef as unknown as Image,
      canvasInstance: imageObject.value.canvas as unknown as Canvas
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
