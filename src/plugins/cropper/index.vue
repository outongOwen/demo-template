<template>
  <div id="wrapper" class="dark:bg-dark w-848px h-498px pa-24px">
    <Canvas
      ref="playerCanvasRef"
      :config="{
        selection: true //锁定多选
      }"
      :align-guidelines="{ isOpenAlignGuidelines: false }"
    >
      <FabricVideo v-if="props.mediaInfo.type == 'video'" :src="props.mediaInfo.url" :config="videoConfig" />
      <Image v-if="props.mediaInfo.type == 'image'" :image-source="imageSrc" :config="imageConfig" />
    </Canvas>
  </div>
</template>
<script setup lang="ts">
import { util } from 'fabric';
import type { ImageSource } from 'fabric';
import { Canvas, Image } from '~/src/plugins/fabricVue';
import type { CanvasInst, FImageProps } from '~/src/plugins/fabricVue';
import Cropper from './cropper.js';
defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Cropper'
});
/**
 * props:
 * - 元素的信息 mediaInfo: {
 *  type: 'video' | 'audio'
 *  width: 1080,
 *  height: 720,
 *  duration: 1000ms,
 *  url: 'http://',
 * presetRatio: 1
 * }
 * ui： {
 *  isShowVideoBar: true,
 * isShowCropSize: false,
 * isShowCropBtn: false,
 * }
 * controlUi: {
 * fabric中control的一些属性信息, 默认白色，暂时不提供配置
 * }
 * cropBtnInfo: {
 * cancelBtn: {
 *  img: xx,
 *  cancelEvent: () => {}
 * },
 * confirmBtn: {
 *  img: xx,
 * confirm: () => {}
 * }
 * }
 *
 * 提供一些操作方法：动态设置比例。设置大小；
 * 获取坐标及截图信息。
 */
const props = defineProps({
  mediaInfo: {
    type: Object,
    default: () => {
      return {};
    },
    required: true
  },
  cropInfo: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
const emit = defineEmits(['updateCropInfo', 'getMediaScale']);
const imageSrc = ref<ImageSource>();
const videoConfig = reactive<FImageProps>({
  left: 0,
  top: 0,
  selectable: false,
  evented: false
});
videoConfig.width = props.mediaInfo.width;
videoConfig.height = props.mediaInfo.height;
const imageConfig = reactive<FImageProps>({
  left: 0,
  top: 0,
  selectable: false,
  evented: false,
  layer: 0
});
imageConfig.width = props.mediaInfo.width;
imageConfig.height = props.mediaInfo.height;
const playerCanvasRef = ref<CanvasInst>();
const cropper = ref<any>(null);
const cropzone = ref<any>(null);

const deleteObject = () => {
  console.log(cropper.value.getCropzoneRect());
  console.log(cropper.value.getCroppedImageData(cropper.value.getCropzoneRect()));
};
const setCropzoneRectByPosition = (position: any) => {
  cropper.value && cropper.value.setCropzoneRectByPosition(position);
};
defineExpose({ setCropzoneRectByPosition });
watchEffect(() => {
  // console.log('playerCanvasRef', playerCanvasRef.value?.instance);
  // 创建cropper
  if (playerCanvasRef.value?.instance && !cropper.value) {
    // cropper.value = new Graphics(unref(playerCanvasRef)!.instance, { deleteObject });
    cropper.value = new Cropper(unref(playerCanvasRef)!.instance, { deleteObject });
    cropper.value.start();
    cropzone.value = cropper.value._cropzone;
    cropper.value.setCropzoneRect(props.cropInfo.ratio);
    if (props.mediaInfo.cropW || props.mediaInfo.cropH) {
      setCropzoneRectByPosition({
        width: props.mediaInfo.cropW,
        height: props.mediaInfo.cropH,
        left: props.mediaInfo.cropX,
        top: props.mediaInfo.cropY
      });
    }

    cropzone.value.on('CropzonePosition', (val: any) => {
      emit('updateCropInfo', val);
    });
  }
});
watch(
  () => props.cropInfo.ratio,
  (val: any) => {
    cropper.value && cropper.value.setCropzoneRect(val);
  }
);

const presetCanvasSize = {
  width: 800,
  height: 450
};
onMounted(async () => {
  const dimension = {
    width: 800,
    height: 450
  };
  let mediaScale = 1;
  // eslint-disable-next-line prettier/prettier
  if (
    props.mediaInfo.width / props.mediaInfo.height >
    presetCanvasSize.width / presetCanvasSize.height
  ) {
    mediaScale = presetCanvasSize.width / props.mediaInfo.width;
    dimension.height = props.mediaInfo.height * mediaScale;
  } else {
    mediaScale = presetCanvasSize.height / props.mediaInfo.height;
    dimension.width = props.mediaInfo.width * mediaScale;
  }

  imageConfig.scaleX = mediaScale;
  imageConfig.scaleY = mediaScale;
  emit('getMediaScale', mediaScale);

  unref(playerCanvasRef)!.instance!.setDimensions({
    width: dimension.width,
    height: dimension.height
  });
  try {
    if (props.mediaInfo.type !== 'image') return;
    const imageObject = await util.loadImage(props.mediaInfo.url, {
      crossOrigin: 'anonymous'
    });
    imageSrc.value = imageObject;
  } catch (error) {
    console.log(error);
  }
});
</script>
<style scoped lang="scss">
:deep(.canvas-container) {
  @apply important-h100% important-w100% bg-#1e1e1e;
  .lower-canvas,
  .upper-canvas {
    @apply important-max-h100% important-max-w100% important-w-unset important-h-unset important-absolute-transform-center;
  }
  .lower-canvas {
    @apply bg-black;
  }
}
</style>
