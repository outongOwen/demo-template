<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <div class="wh-full">
    <Canvas
      ref="playerCanvasRef"
      :configuration="canvasConfiguration"
      :control-props="controlPropsSetting"
      :controls-visibility="controlsVisibilitySetting"
      :controls="customControls"
      @once:after:render="handleAfterRender"
      @selection:created="handleObjectSelected"
      @selection:update="handleObjectSelected"
      @object:added="handleObjectAdded"
    >
      <IText :config="textConfig" />
      <Text :config="textConfig" />
      <Textbox :config="textConfig" />
      <Image ref="imageRef" :img-src="imageSrc" :config="imageConfig" />
      <Group ref="groupRef" :config="groupConfig">
        <Image ref="groupImageRef" :img-src="imageSrc" :config="groupImageConfig" @added="handleGroupImageAdded" />
        <Rect :config="groupRectConfig" />
        <Textbox :config="groupTextboxConfig" />
      </Group>
    </Canvas>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { omit, pick } from 'lodash-es';
import { reactiveComputed } from '@vueuse/core';
import { util, Control, controlsUtils } from 'fabric';
import type { ImageSource, Object as FabricObject, TPointerEvent } from 'fabric';
import { usePlayerStore, useThemeStore } from '@/store';
import { Canvas, Image, Group, IText, Text, Textbox, Rect } from '~/src/plugins/fabricVue';
import type {
  CanvasInst,
  ImageInst,
  GroupInst,
  FCanvasConfiguration,
  FTextboxProps,
  FTextProps,
  FGroupProps,
  FRectProps,
  FImageProps
} from '~/src/plugins/fabricVue';
defineOptions({ name: 'PlayerCanvas' });
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
const playerStore = usePlayerStore();
const themeStore = useThemeStore();
const { getResolution } = storeToRefs(playerStore);
const canvasConfiguration: FCanvasConfiguration = {
  DPI: 300
  // devicePixelRatio: 2
};
const playerCanvasRef = ref<CanvasInst>();
const imageRef = ref<ImageInst>();
const groupImageRef = ref<ImageInst>();
const groupRef = ref<GroupInst>();
const imageSrc = ref<ImageSource>();
const imageConfig = reactive<FImageProps>({
  left: 120,
  top: 120,
  scaleX: 1,
  scaleY: 1,
  strokeWidth: 0,
  centeredScaling: true
  // borderColor: '#1890FF',
  // cornerColor: '#fff',
  // transparentCorners: false,
  // cornerStrokeColor: '#fff',
  // borderScaleFactor: 2
});

const textConfig = reactive<FTextProps>({
  text: '123123123123123123',
  fontSize: 100,
  left: 0,
  top: 0,
  fill: '#116548'
  // borderColor: '#fff'
});

const groupConfig = reactive<FGroupProps>({
  width: 500,
  height: 500,
  layout: 'fixed',
  borderColor: '#fff'
});
const groupRectConfig = reactive<FRectProps>({
  width: 500,
  height: 500,
  left: 0,
  top: 0,
  strokeWidth: 0,
  fill: 'transparent'
});
const groupTextboxConfig = reactive<FTextboxProps>({
  text: '213123',
  width: groupRectConfig.width,
  height: groupRectConfig.height,
  fontSize: 40,
  left: 0,
  top: 0,
  fill: '#fff',
  splitByGrapheme: true,
  strokeWidth: 0
});
const groupImageConfig = reactive<FImageProps>({
  left: 0,
  top: 0,
  scaleX: 1,
  scaleY: 1
});
watchEffect(() => {
  getResolution.value &&
    nextTick(() => {
      unref(playerCanvasRef)!.instance!.setDimensions({ ...getResolution.value });
    });
});
const handleAfterRender = ({ ctx }: { ctx: CanvasRenderingContext2D }) => {
  console.log(ctx, 'once:after:renderonce:after:renderonce:after:renderonce:after:renderonce:after:render');
  // console.log(unref(playerCanvasRef)!.instance);
  // unref(playerCanvasRef)!
  //   .instance.getObjects()
  //   .forEach(item => {
  //     console.log(item.toJSON());
  //     console.log(item);
  //   });
  // console.log('unref(playerCanvasRef)!.instance.getObjects(): ', unref(playerCanvasRef)!.instance.getObjects());
};
const handleGroupImageAdded = () => {};
const handleObjectSelected = ({ e, selected }: { e: TPointerEvent; selected: Array<FabricObject> }) => {
  console.log('eeee', e);
  console.log('selectedselectedselectedselected', selected);
};
const handleObjectAdded = ({ target }: { target: FabricObject }) => {
  console.log('targettargettargettarget', target);
};
const customControls = reactiveComputed(() => {
  const delImg = document.createElement('img');
  delImg.src = new URL('@/assets/svg-icon/arrows-rotate.svg', import.meta.url).href;
  return {
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
  };
});
const controlPropsSetting = reactiveComputed(() => {
  return omit(themeStore.getPlayerSettings.controls, ['visibility']);
});
const controlsVisibilitySetting = reactiveComputed(() => {
  return { ...pick(themeStore.getPlayerSettings.controls, ['visibility']).visibility };
});
onMounted(async () => {
  // const canvas = new Canvas(playerCanvasRef.value!);
  // canvasInstance = canvas;
  const imageObject = await util.loadImage('https://loremflickr.com/3840/2160/city?lock=6726747135410176');
  imageConfig.width = imageObject.width;
  imageConfig.height = imageObject.height;
  groupTextboxConfig.width = groupRectConfig.width;
  groupTextboxConfig.height = groupRectConfig.height;
  groupImageConfig.width = imageObject.width;
  groupImageConfig.height = imageObject.height;
  groupImageConfig.scaleX = groupRectConfig.width! / imageObject.width;
  groupImageConfig.scaleY = groupRectConfig.height! / imageObject.height;
  imageSrc.value = imageObject;
  nextTick(() => {
    // console.log(imageRef.value!.instance, 'imageRef.value!.instanceimageRef.value!.instance');
    imageRef.value!.instance.scaleToWidth(groupRectConfig.width!);
    imageRef.value!.instance.scaleToHeight(groupRectConfig.width!);
    groupRef.value!.instance.sendObjectToBack(groupImageRef.value!.instance);
  });
});
</script>

<style scoped lang="scss">
:deep(.canvas-container) {
  @apply important-h100% important-w100%;
  .lower-canvas,
  .upper-canvas {
    @apply important-max-h100% important-max-w100% important-w-unset important-h-unset important-absolute-transform-center;
  }
  .lower-canvas {
    @apply bg-black;
  }
}
</style>
