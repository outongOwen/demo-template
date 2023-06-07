<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <div class="wh-full">
    <Canvas ref="playerCanvasRef" @after:render="handleAfterRender">
      <IText :config="textConfig" />
      <Text :config="textConfig" />
      <Textbox :config="textConfig" />
      <Image ref="imageRef" :img-src="imageSrc" :config="imageConfig" />
      <Group ref="groupRef" :config="groupConfig">
        <Image ref="groupImageRef" :img-src="imageSrc" :config="imageConfig2" />
        <IText :config="textConfig" />
      </Group>
    </Canvas>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { util } from 'fabric';
import type { ImageSource, ImageProps } from 'fabric';
import { usePlayerStore } from '@/store';
import { Canvas, Image, Group, IText, Text, Textbox } from '@/components/fabricVue';
import type { CanvasInst, ImageInst, GroupInst } from '@/components/fabricVue';
defineOptions({ name: 'PlayerCanvas' });
const playerStore = usePlayerStore();
const { getResolution } = storeToRefs(playerStore);
const playerCanvasRef = ref<CanvasInst>();
const imageRef = ref<ImageInst>();
const groupImageRef = ref<ImageInst>();
const groupRef = ref<GroupInst>();
const imageSrc = ref<ImageSource>();
const imageConfig = reactive({
  left: 120,
  top: 120,
  scaleX: 1,
  scaleY: 1
}) as Partial<ImageProps>;
const imageConfig2 = reactive({
  left: 100,
  top: 100,
  scaleX: 1,
  scaleY: 1
}) as Partial<ImageProps>;
const textConfig = reactive({
  text: '123123123123123123',
  fontSize: 100,
  left: 0,
  top: 0,
  fill: '#116548'
});
/**
 * todo: 由于fabric暂时没有暴漏GroupProps,后续如果暴漏了添加
 */
const groupConfig = reactive({
  // layout: 'fit-content-lazy'
}) as any;
watchEffect(() => {
  getResolution.value &&
    nextTick(() => {
      unref(playerCanvasRef)!.instance!.setDimensions({ ...getResolution.value });
    });
});
const handleAfterRender = () => {
  console.log('渲染成功');
};
onMounted(async () => {
  // const canvas = new Canvas(playerCanvasRef.value!);
  // canvasInstance = canvas;
  const imageObject = await util.loadImage(
    'https://raw.githubusercontent.com/outongOwen/picture_bed/main/image/202303281503974.jpg'
  );
  imageConfig.width = imageObject.width;
  imageConfig.height = imageObject.height;
  imageSrc.value = imageObject;
  nextTick(() => {
    // groupImageRef.value?.instance.scaleToWidth(imageObject.width / 10);
    imageRef.value?.instance.scaleToWidth(imageObject.width / 10);
    groupConfig.scaleX = 0.5;
    groupConfig.scaleY = 0.5;
    playerCanvasRef.value!.requestRenderAll();
    groupRef.value!.instance.sendObjectToBack(groupImageRef.value!.instance);
  });

  // const text = new IText('center fabricVue', {
  //   left: 1280 / 2,
  //   top: 720 / 2,
  //   fill: '#fff',
  //   fontSize: 100,
  //   originX: 'center',
  //   originY: 'center',
  //   zIndex: 1
  // });
  // unref(playerCanvasRef)?.instance!.add(text);
  // const image = new Image(imageObject, {
  //   width: imageObject.width,
  //   height: imageObject.height,
  //   left: 0,
  //   top: 0,
  //   zIndex: 9
  // });
  // image.scaleToWidth(imageObject.width / 10);
  // canvas.add(image);
  // canvas.requestRenderAll();
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
