<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-16
 * Video.vue
-->
<template>
  <Image
    ref="imageRef"
    v-bind="$attrs"
    :image-source="imageSource"
    :config="imageConfig"
    @selected="handleSelected"
    @deselected="handleDeselected"
  />
</template>

<script setup lang="ts">
import { omit } from 'lodash';
import { getFilterBackend, util } from 'fabric';
import type { WebGLFilterBackend } from 'fabric';
import { useEventListener, reactiveComputed } from '@vueuse/core';
import { Image } from '@/plugins/fabricVue';
import type { ImageInst, FImageProps } from '@/plugins/fabricVue';
defineOptions({ name: 'FabricVideo' });
export interface VideoInst {
  context: HTMLVideoElement;
  imageRef: ImageInst;
}
interface Props {
  src: string;
  config: FImageProps;

  /**
   * @abstract `fitMode` 是一个可选属性，用于确定应如何缩放视频以适应组件的尺寸。它可以具有以下三个值之一：“包含”、“填充”或“无”。
   * @default 'contain'
   * @description 'contain':等比例缩放; fill:平铺; none:不缩放，原始尺寸，超出部分裁剪
   */
  fitMode?: 'contain' | 'fill' | 'none';
}
const props = withDefaults(defineProps<Props>(), {
  fitMode: 'contain'
});
const { src, config, fitMode } = toRefs(props);
const imageRef = ref<ImageInst>();
const videoConfig = reactive<FImageProps>({});
const imageConfig = reactiveComputed((): FImageProps => {
  if (fitMode.value === 'none') {
    return {
      ...config.value,
      ...videoConfig
    };
  }
  return {
    ...omit(config.value, ['width', 'height', 'scaleX', 'scaleY']),
    ...videoConfig
  };
});
const videoElement = document.createElement('video');
const imageSource = shallowRef<HTMLVideoElement | null>(null);
const applyToVideoByFitMode = (videoWidth: number, videoHeight: number) => {
  const videoFit = fitMode.value;
  if (videoFit === 'contain') {
    let scale = 1;
    if (config.value.width / config.value.height > videoWidth / videoHeight) {
      scale = config.value.width / videoWidth;
    } else {
      scale = config.value.height / videoHeight;
    }
    videoConfig.scaleX = scale;
    videoConfig.scaleY = scale;
  }
  if (videoFit === 'fill') {
    const scaleX = config.value.width / videoWidth;
    const scaleY = config.value.height / videoHeight;
    videoConfig.scaleX = scaleX;
    videoConfig.scaleY = scaleY;
    config.value.scaleX = scaleX;
    config.value.scaleY = scaleY;
    config.value.width = videoWidth * scaleX;
    config.value.height = videoHeight * scaleY;
  }
};
let animFrameTimer = 0;
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
    animFrameTimer = util.requestAnimFrame(render);
  };
  animFrameTimer = util.requestAnimFrame(render);
};
const handleVideoPlay = () => {
  imageSource.value?.play();
  animationRender();
};
const handleVideoPause = () => {
  imageSource.value?.pause();
  util.cancelAnimFrame(animFrameTimer);
  animFrameTimer = 0;
};
const handleSelected = () => {
  handleVideoPlay();
};
const handleDeselected = () => {
  handleVideoPause();
};
const handleVideoLoadeddata = (e: Event) => {
  const target = e.target as HTMLVideoElement;
  target.width = target.videoWidth;
  target.height = target.videoHeight;
  imageSource.value = target;
  applyToVideoByFitMode(target.videoWidth, target.videoHeight);
};
const handleVideoCanplay = () => {
  imageRef.value?.instance?.canvas?.requestRenderAll();
};
/**
 * 初始化video
 */
const initVideo = () => {
  videoElement.src = src.value;
  videoElement.crossOrigin = 'anonymous';
  videoElement.currentTime = 0.00001;
  imageSource.value = null;
};
/**
 * 监听video事件
 */
useEventListener(videoElement, 'loadeddata', handleVideoLoadeddata);
useEventListener(videoElement, 'canplay', handleVideoCanplay);
// useEventListener(videoElement, 'seeked', handleVideoSeeked);
useEventListener(videoElement, 'error', (e) => {
  console.error(e);
});
watch(src, (srcValue) => {
  if (srcValue && imageSource.value) {
    imageRef.value?.instance.canvas?.discardActiveObject();
    handleVideoPause();
    initVideo();
  }
});
onMounted(() => {
  initVideo();
});
defineExpose<VideoInst>({
  context: videoElement,
  imageRef: toRef(imageRef, 'value') as unknown as ImageInst
});
</script>

<style scoped></style>
