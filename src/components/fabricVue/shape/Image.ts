import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, shallowRef, toRef, watch, watchEffect, toRefs } from 'vue';
import { Image, Control, controlsUtils, util } from 'fabric';
import { watchOnce } from '@vueuse/core';
import type { Canvas, ImageProps as FabricImageProps, ImageSource, Object as FabricObject } from 'fabric';
import { cloneDeep, isEmpty, isString } from 'lodash-es';
import type { TProps } from '@fabric/shapes/Object/types';
// eslint-disable-next-line import/no-unresolved
import deleteIcon from '@/assets/svg-icon/arrows-rotate.svg?url';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindImageEvent } from '../hooks';
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
// eslint-disable-next-line max-params
function drawImg(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined
) {
  if (angle === undefined) return;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(util.degreesToRadians(angle));
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize);
  ctx.restore();
}
export default defineComponent({
  name: 'FabricImage',
  inheritAttrs: false,
  props: imageProps,
  setup(props, { attrs }): ImageInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
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
          // imageObject.value.setControlsVisibility({
          //   mtr: false
          // });
          useBindImageEvent(imageObject.value, attrs, 'on');
          parentInstance.add(imageObject.value);
        }
        if (imageObject.value && oldSrc) {
          imageObject.value.setElement(src);
          props.onImageChanged && props.onImageChanged(imageObject.value, canvasInject.instance);
          canvasInject.requestRenderAll();
        }
      }
    });
    watchOnce(imageObject, async imgObj => {
      const delImg = await util.loadImage(deleteIcon);
      if (!imgObj) return;
      imgObj.controls = {
        ...controlsUtils.createObjectDefaultControls(),
        ...{
          mtr: new Control({
            x: 0,
            y: 0.5,
            offsetY: 30,
            sizeX: 30,
            sizeY: 30,
            touchSizeX: 30,
            touchSizeY: 30,
            actionName: 'rotate',
            cursorStyle: 'alias',
            actionHandler: controlsUtils.rotationWithSnapping,
            // cursorStyleHandler: controlsUtils.rotationStyleHandler,
            // eslint-disable-next-line func-name-matching, max-params
            render: function renderDelIcon(
              ctx: CanvasRenderingContext2D,
              left: number,
              top: number,
              _styleOverride: any,
              fabricObject: FabricObject
            ) {
              // 绘制圆形背景
              ctx.beginPath();
              ctx.arc(left, top, 15, 0, 2 * Math.PI);
              ctx.fillStyle = '#fff';
              ctx.fill();
              drawImg(ctx, left, top, delImg, 20, 20, fabricObject.angle);
            }
          })
        }
      };
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
      parentInstance && imageObject.value && parentInstance.remove(imageObject.value);
      imageObject.value && useBindImageEvent(imageObject.value, attrs, 'off');
    });
    return {
      instance: imageObjectRef as unknown as Image
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
