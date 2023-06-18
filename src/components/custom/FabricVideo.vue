<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-16
 * Video.vue
-->
<template>
  <FabricImage
    ref="imageRef"
    v-bind="$attrs"
    :image-source="imageSource"
    :config="imageConfig"
    @added="handleImageAdd"
    @selected="handleSelected"
    @deselected="handleDeselected"
  />
</template>

<script setup lang="ts">
import { getFilterBackend, util } from 'fabric';
import type { WebGLFilterBackend } from 'fabric';
// import type { FilterBackend } from '@fabric/filters/FilterBackend';
import { reactiveComputed } from '@vueuse/core';
import { Image as FabricImage } from '@/plugins/fabricVue';
import type { ImageInst, FImageProps } from '@/plugins/fabricVue';
defineOptions({ name: 'FabricVideo' });

type VideoConfig = {
  [T: string]: any;
};
interface Props {
  src: string;
  config: VideoConfig & FImageProps;
}
const props = defineProps<Props>();
const { src, config } = toRefs(props);
const imageRef = ref<ImageInst>();
const videoElement = ref<HTMLVideoElement>();
const localConfig = reactive<FImageProps>({});
const imageConfig = reactiveComputed((): Exclude<FImageProps, keyof VideoConfig> => {
  console.log('localConfig', localConfig);
  return {
    ...config.value,
    ...localConfig
  };
});
const imageSource = shallowRef<HTMLVideoElement>();
const handleImageAdd = () => {
  localConfig.scaleX = 0.3;
  localConfig.scaleY = 0.3;
  // imageRef.value!.instance.scaleToWidth(800);
  // imageRef.value?.instance?.canvas?.renderAll();
};
let timer = 0;
const animationRender = () => {
  const instance = imageRef.value?.instance;
  const canvas = instance?.canvas;
  const render = () => {
    const backend = getFilterBackend() as WebGLFilterBackend;
    if (backend?.evictCachesForKey) {
      const cacheKey = instance?.cacheKey ?? '';
      backend.evictCachesForKey(cacheKey);
      backend.evictCachesForKey(`${cacheKey}_filtered`);
    }
    instance?.applyFilters();
    instance?.setCoords();
    canvas?.renderAll();
    timer = util.requestAnimFrame(render);
  };
  timer = util.requestAnimFrame(render);
};

const handleVideoPlay = () => {
  console.log('handleVideoPlay');
  videoElement.value?.play();
  animationRender();
};
const handleVideoPause = () => {
  videoElement.value?.pause();
  util.cancelAnimFrame(timer);
};
// const handleVideoReset = () => {
//   handleVideoPause();
//   videoElement.value!.currentTime = 0;
//   handleVideoPlay();
// };
const handleSelected = () => {
  console.log('21321312');
  handleVideoPlay();
};
const handleDeselected = () => {
  handleVideoPause();
};
const handleVideoLoadeddata = (e: Event) => {
  const target = e.target as HTMLVideoElement;
  videoElement.value = target;
  target.width = target.videoWidth;
  target.height = target.videoHeight;
  imageSource.value = target;
  imageRef.value?.instance?.applyFilters();
  imageRef.value?.instance?.canvas?.renderAll();
};
/**
 * 初始化video
 */
const initVideo = () => {
  const video = document.createElement('video');
  video.src = src.value;
  video.crossOrigin = 'anonymous';
  video.currentTime = 0.00001;
  video.addEventListener('loadeddata', handleVideoLoadeddata);
};
onMounted(() => {
  initVideo();
});
defineExpose({});
</script>

<style scoped></style>
