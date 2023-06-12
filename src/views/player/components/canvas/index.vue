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
      :config="{
        borderColor: '#116548',
        cornerColor: '#116548',
        transparentCorners: false,
        cornerStrokeColor: '#116548',
        borderScaleFactor: 2
      }"
      @selection:created="handleObjectSelected"
      @selection:update="handleObjectSelected"
      @object:added="handleObjectAdded"
      @after:render="handleAfterRender"
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
import { util } from 'fabric';
import type { ImageSource, Object as FabricObject, TPointerEvent } from 'fabric';
import { usePlayerStore } from '@/store';
import { Canvas, Image, Group, IText, Text, Textbox, Rect } from '@/components/fabricVue';
import type {
  CanvasInst,
  ImageInst,
  GroupInst,
  FConfiguration,
  FTextboxProps,
  FTextProps,
  FGroupProps,
  FRectProps,
  FImageProps
} from '@/components/fabricVue';
defineOptions({ name: 'PlayerCanvas' });
const playerStore = usePlayerStore();
const { getResolution } = storeToRefs(playerStore);
const canvasConfiguration: FConfiguration = {
  // DPI: 300
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
  borderColor: '#1890FF',
  cornerColor: '#fff',
  transparentCorners: false,
  cornerStrokeColor: '#fff',
  borderScaleFactor: 2
});

const textConfig = reactive<FTextProps>({
  text: '123123123123123123',
  fontSize: 100,
  left: 0,
  top: 0,
  fill: '#116548',
  borderColor: '#116548',
  cornerColor: '#116548',
  transparentCorners: false,
  cornerStrokeColor: '#116548',
  borderScaleFactor: 2.5
});

const groupConfig = reactive<FGroupProps>({
  width: 500,
  height: 500
  // layout: 'fixed'
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
  console.log(ctx, 'handleObjectAddedhandleObjectAddedhandleObjectAdded');
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
onMounted(async () => {
  // const canvas = new Canvas(playerCanvasRef.value!);
  // canvasInstance = canvas;
  const imageObject = await util.loadImage('https://loremflickr.com/2151/1333/model?lock=1812595036127232');
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
