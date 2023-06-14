import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, shallowRef, toRef, watch, watchEffect, toRefs } from 'vue';
import { Image } from 'fabric';
import type { Canvas, ImageProps as FabricImageProps, ImageSource } from 'fabric';
import { cloneDeep, isEmpty, isString } from 'lodash-es';
import type { TProps } from '@fabric/shapes/Object/types';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindImageEvent, useControls } from '../hooks';
import { difference, throwError } from '../utils';
export type FImageProps = TProps<FabricImageProps> | Record<string, any>;
export type ImageInst = {
  instance: Image;
};
export const imageProps = {
  config: {
    type: Object as PropType<FImageProps>,
    required: true
  },
  imgSrc: {
    type: [Object] as PropType<ImageSource>,
    default: () => {}
  },
  onImageChanged: Function as PropType<(image: Image, canvas: Canvas) => void>
} as const;
export type ImageProps = typeof imageProps;
export default defineComponent({
  name: 'FabricImage',
  inheritAttrs: false,
  props: imageProps,
  setup(props, { attrs }): ImageInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
    const { setControls } = useControls();
    const imageObject = shallowRef<Image>();
    const imageObjectRef = toRef(imageObject, 'value');
    const { imgSrc, config } = toRefs(props);
    const { parentInstance } = useObjectParent();
    // Image;
    watchEffect(() => {
      if (isString(imgSrc.value)) {
        throwError(
          'Image',
          'please use [HTMLImageElement | HTMLVideoElement | HTMLCanvasElement] type element instead of string'
        );
      }
    });
    watch(imgSrc, (src: ImageSource, oldSrc: ImageSource) => {
      if (src) {
        if (!canvasInject) return;
        if (!imageObject.value) {
          imageObject.value = new Image(src, config.value);
          setControls(imageObject.value, props.config);
          useBindImageEvent(imageObject.value, attrs, 'bind');
          parentInstance.add(imageObject.value);
          canvasInject.requestRenderAll();
        }
        if (imageObject.value && oldSrc) {
          imageObject.value.setElement(src);
          props.onImageChanged && props.onImageChanged(imageObject.value, canvasInject.instance);
          canvasInject.requestRenderAll();
        }
      }
    });
    watch(
      () => cloneDeep(config.value),
      (newConfig, oldConfig) => {
        let isRefresh = false;
        if (!oldConfig && !imageObject.value) return;
        const difProps = difference(newConfig, oldConfig);
        if (isEmpty(difProps)) return;
        Object.entries(difProps).forEach(([key, value]) => {
          imageObject.value?.get(key) !== value && imageObject.value?.set(key, value) && (isRefresh = true);
        });
        isRefresh && canvasInject?.instance.requestRenderAll();
      },
      {
        deep: true
      }
    );

    onBeforeUnmount(() => {
      if (imageObject.value) {
        imageObject.value.off();
        parentInstance && parentInstance.remove(imageObject.value);
        imageObject.value.off();
      }
    });
    return {
      instance: imageObjectRef as unknown as Image
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
