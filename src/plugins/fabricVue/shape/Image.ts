import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, shallowRef, toRef, watch, watchEffect, toRefs } from 'vue';
import { watchOnce } from '@vueuse/core';
import { Image, util } from 'fabric';
import type { ImageProps as FabricImageProps, ImageSource } from 'fabric';
import { cloneDeep, isEmpty, isString } from 'lodash';
import type { TObjectInstance } from '../types';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindImageEvent, useControls } from '../hooks';
import { difference, throwError } from '../utils';
export type FImageProps = Partial<FabricImageProps> | Record<string, any>;
export type ImageInst = {
  instance: TObjectInstance<Image>;
};
export const imageProps = {
  imageSource: {
    type: [Object] as PropType<ImageSource | null>,
    default: () => {
      return {};
    }
  },
  config: {
    type: [Object] as PropType<FImageProps>,
    default: () => {
      return {};
    },
    required: true
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
    const imageObject = shallowRef<Image>(new Image(util.createImage()));
    setControls(imageObject.value, config.value);
    useBindImageEvent(imageObject.value, 'bind');
    const imageObjectRef = toRef(imageObject, 'value');
    watchOnce(imageSource, (imgSrc: ImageSource | null | undefined) => {
      if (!imgSrc) return;
      imageObject.value.set(config.value);
      parentInstance.add(imageObject.value);
      imageObject.value.applyFilters();
      imageObject.value.setCoords();
      canvasInject?.instance.requestRenderAll();
    });
    watch(imageSource, (src: ImageSource | null | undefined) => {
      if (!src || !canvasInject) return;
      imageObject.value.setElement(src);
      imageObject.value.set(config.value);
      imageObject.value.applyFilters();
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
          targetObject.filters = difProps.filters;
          targetObject.applyFilters();
          targetObject.setCoords();
          canvasInject?.instance.renderAll();
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
      instance: imageObjectRef as unknown as TObjectInstance<Image>
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
