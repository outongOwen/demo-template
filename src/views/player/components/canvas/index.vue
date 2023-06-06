<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <div class="wh-full">
    <canvas ref="playerCanvasRef" />
  </div>
</template>

<script setup lang="ts">
import { Canvas, IText, util, Image } from 'fabric';
defineOptions({ name: 'PlayerCanvas' });
const playerCanvasRef = ref<HTMLCanvasElement>();
onMounted(async () => {
  const canvas = new Canvas(playerCanvasRef.value!, {
    width: 720 * (16 / 9),
    height: 720
  });
  const imageObject = await util.loadImage(
    'https://raw.githubusercontent.com/outongOwen/picture_bed/main/image/202303281503974.jpg'
  );
  const image = new Image(imageObject, {
    width: imageObject.width,
    height: imageObject.height,
    left: 0,
    top: 0,
    zIndex: 9
  });
  const text = new IText('center fabricVue', {
    left: 1280 / 2,
    top: 720 / 2,
    fill: '#fff',
    fontSize: 100,
    originX: 'center',
    originY: 'center',
    zIndex: 1
  });
  canvas.add(image);
  canvas.add(text);
  image.scaleToWidth(imageObject.width / 10);
  canvas.requestRenderAll();
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
