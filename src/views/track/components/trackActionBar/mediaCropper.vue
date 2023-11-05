<template>
  <div>
    <n-modal :close-on-esc="false" :mask-closable="false" v-model:show="showModal">
      <div class="bg-dark">
        <div class="h-40px text-center lh-40px">裁剪</div>
        <n-divider class="important-m-0" />
        <n-space :wrap="false" class="important-gap-0">
          <Cropper
            ref="cropperRef"
            :media-info="mediaInfo"
            :crop-info="cropInfo"
            @updateCropInfo="updateCropInfo"
            @getMediaScale="getMediaScale"
          ></Cropper>
          <n-divider :vertical="true" class="important-m-0 important-h-100%" />
          <n-space vertical class="w-282px p-24px">
            <div>
              <span class="w-60px">比例：</span>
              <n-select size="small" v-model:value="cropInfo.ratio" :options="ratioOptions" />
            </div>
            <div>
              <span class="w-50px flex-shrink-0">位置：</span>
              <n-space :wrap="false">
                <n-input-number
                  v-model:value="cropInfo.left"
                  size="small"
                  :max="mediaInfo.originWidth"
                  min="0"
                  @update:value="handleUpdate('X')"
                >
                  <template #suffix>X</template>
                </n-input-number>
                <n-input-number
                  v-model:value="cropInfo.top"
                  size="small"
                  :max="mediaInfo.originHeight"
                  min="0"
                  @update:value="handleUpdate('Y')"
                >
                  <template #suffix>Y</template>
                </n-input-number>
              </n-space>
            </div>
            <div>
              <span class="w-60px">尺寸：</span>
              <n-space :wrap="false">
                <n-input-number
                  v-model:value="cropInfo.width"
                  size="small"
                  :max="mediaInfo.originWidth"
                  :min="limitSize.minWidth"
                  @update:value="handleUpdate('W')"
                >
                  <template #suffix>W</template>
                </n-input-number>
                <n-input-number
                  v-model:value="cropInfo.height"
                  size="small"
                  :max="mediaInfo.originHeight"
                  :min="limitSize.minHeight"
                  @update:value="handleUpdate('H')"
                >
                  <template #suffix>H</template>
                </n-input-number>
              </n-space>
            </div>
          </n-space>
        </n-space>
        <n-divider class="important-m-0" />
        <n-space justify="space-between" align="center" class="px-24px py-10px">
          <n-popover trigger="hover">
            <template #trigger>
              <n-checkbox size="small" label="同步更新预览区比例" />
            </template>
            <span>自动调整预览区域的比例，让裁剪后的画面铺满预览区</span>
          </n-popover>

          <n-space>
            <n-button @click="cancel">取消</n-button>
            <n-button @click="confirm">确定</n-button>
          </n-space>
        </n-space>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
// TODO  元素层级问题；裁剪准确度问题
import { useMessage } from 'naive-ui';
import Cropper from '@/components/module/cropper/index.vue';
import { LIMIT_SIZE } from '@/components/module/cropper/consts.js';
defineOptions({
  name: 'MediaCropper'
});
interface Props {
  showModal?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showModal: false
});
const { showModal } = toRefs(props);
const cropperRef = ref();
const mediaInfo = reactive({
  presetRatio: 1,
  type: 'video',
  width: 854, // 预览视频或者图片宽高，图片不做预处理，所以对图片来说是真实的宽高
  height: 480,
  url: 'http://video.mam.miguvideo.com/mnt2/clipcloud/wylocal/trans/2023/10/12/15/46/mgclip_652796bbc087b0021ef6789e_20231012154612_1.mp4',
  originWidth: 1280, // 真实视频的宽高
  originHeight: 720,
  cropX: 100,
  cropY: 0,
  cropW: 100,
  cropH: 100,
  duration: 1000
  // type: 'image',
  // width: 160, // 预览视频或者图片宽高，图片不做预处理，所以对图片来说是真实的宽高
  // height: 240,
  // url: 'http://36.155.98.104:18901/mnt2/clipcloud/imageability/2021/12/09/7777776668/16390284484791.s.jpeg'
  // url: 'http://36.155.98.104:18901/mnt2/clipcloud/yunjian/2022/07/06/16/07/9e09c26002c543dea75bae1bf363d78anyp6j.jpg'
});
// 原视频相对于预览视频的缩放比
const mediaSourceScale = mediaInfo.width / mediaInfo.originWidth;
const ratioOptions = [
  { value: 21 / 9, label: '21:9' },
  { value: 16 / 9, label: '16:9' },
  { value: 4 / 3, label: '4:3' },
  { value: 1, label: '1:1' },
  { value: 3 / 4, label: '3:4' },
  { value: 9 / 16, label: '9:16' },
  { value: '', label: '自由' }
];
const cropInfo = ref({
  // 裁剪信息，这里坐标计算需要考虑三个因素。首先前端预览是低码的，原视频是高码的，比如视频是1920*1080， 预览视频是854*480；然后放到画布中，是800*450；首先，预览视频需要在画布中做一次缩放，然后裁剪的时候时候，其实是计算的canvas的宽高，由于画布根据元素进行适应比例。所以得到画布的裁剪区域大小根据画布/原始素材 宽高比，得到输出裁剪的大小。然后还要根据 画布裁剪区域大小/预览视频 宽高比，得到需要crop的信息，给播放器那里的画布。
  left: 0,
  top: 0,
  width: 100,
  height: 100,
  ratio: 0
});
const limitSize = reactive({
  minWidth: 100,
  minHeight: 100,
  maxWidth: 200,
  maxHeight: 200
});
const canvasCropInfo = ref({
  left: 0,
  top: 0,
  width: 100,
  height: 100,
  ratio: 3 / 4
});
const mediaScaleInCanvas = ref(1);
cropInfo.value.ratio = mediaInfo.presetRatio;
const updateCropInfo = (val: { left: any; top: any; width: any; height: any }) => {
  canvasCropInfo.value = { ...canvasCropInfo.value, ...val, ratio: cropInfo.value.ratio };
  let { left, top, width, height } = val;
  left = left < 0 ? 0 : Math.round(left / (mediaScaleInCanvas.value * mediaSourceScale));
  top = top < 0 ? 0 : Math.round(top / (mediaScaleInCanvas.value * mediaSourceScale));
  width =
    width / mediaScaleInCanvas.value >= mediaInfo.width
      ? mediaInfo.originWidth
      : Math.ceil(width / (mediaScaleInCanvas.value * mediaSourceScale));
  height =
    height / mediaScaleInCanvas.value >= mediaInfo.height
      ? mediaInfo.originHeight
      : Math.ceil(height / (mediaScaleInCanvas.value * mediaSourceScale));

  const pos = {
    left,
    top,
    width,
    height
  };
  cropInfo.value = { ...cropInfo.value, ...pos };
};

const message = useMessage();
const emit = defineEmits(['update:showModal']);

interface PosType {
  left: number;
  top: number;
  width: number;
  height: number;
}
const caclCropInfo = (type: any, val: PosType): PosType => {
  switch (type) {
    case 'X':
      if (val.left + val.width > mediaInfo.originWidth) {
        cropInfo.value.left = mediaInfo.originWidth - val.width;
      }
      break;
    case 'Y':
      if (val.top + val.height > mediaInfo.originHeight) {
        cropInfo.value.top = mediaInfo.originHeight - val.height;
      }
      break;
    case 'W':
      if (val.left + val.width > mediaInfo.originWidth) {
        cropInfo.value.width = mediaInfo.originWidth - val.left;
      } else if (val.width > limitSize.maxWidth) {
        cropInfo.value.width = limitSize.maxWidth;
      }
      if (cropInfo.value?.ratio) {
        // 判断是否有比例，如果有，需要对H做等比缩放
        cropInfo.value.height = cropInfo.value.width / cropInfo.value.ratio;
      }
      break;
    case 'H':
    default:
      if (val.top + val.height > mediaInfo.originHeight) {
        cropInfo.value.height = mediaInfo.originHeight - val.top;
      } else if (val.height > limitSize.maxHeight) {
        cropInfo.value.height = limitSize.maxHeight;
      }
      if (cropInfo.value?.ratio) {
        // 判断是否有比例，如果有，需要对H做等比缩放
        cropInfo.value.width = cropInfo.value.height * cropInfo.value.ratio;
      }
      break;
  }
  return val;
};
const handleUpdate = (type: any) => {
  const { left, top, width, height } = caclCropInfo(type, cropInfo.value);
  // 根据选择的比例，计算宽高和坐标是否符合。
  cropperRef.value.setCropzoneRectByPosition({
    left: left * mediaScaleInCanvas.value * mediaSourceScale,
    top: top * mediaScaleInCanvas.value * mediaSourceScale,
    width: width * mediaScaleInCanvas.value * mediaSourceScale,
    height: height * mediaScaleInCanvas.value * mediaSourceScale
  });
};

const getMediaScale = (scaleX: any) => {
  mediaScaleInCanvas.value = scaleX;
};
const calcLimitMax = (ratio: number) => {
  if (!ratio) {
    limitSize.maxWidth = mediaInfo.originWidth;
    limitSize.maxHeight = mediaInfo.originHeight;
  }
  if (ratio > mediaInfo.originWidth / mediaInfo.originHeight) {
    limitSize.maxWidth = mediaInfo.originWidth;
    limitSize.maxHeight = limitSize.maxWidth / ratio;
  } else {
    limitSize.maxHeight = mediaInfo.originHeight;
    limitSize.maxWidth = limitSize.maxHeight * ratio;
  }
};
const caclLimitMin = (ratio: number) => {
  const min = Math.min(mediaInfo.originWidth, mediaInfo.originHeight);
  if (ratio) {
    if (ratio > 1) {
      limitSize.minHeight = min * LIMIT_SIZE.limitPercent;
      limitSize.minWidth = limitSize.minHeight * ratio;
    } else {
      limitSize.minWidth = min * LIMIT_SIZE.limitPercent;
      limitSize.minHeight = limitSize.minWidth / ratio;
    }
  } else {
    limitSize.minWidth = min * LIMIT_SIZE;
    limitSize.minHeight = min * LIMIT_SIZE;
  }
  limitSize.minWidth = Math.floor(limitSize.minWidth);
  limitSize.minHeight = Math.floor(limitSize.minHeight);
};

watch(
  () => cropInfo.value.ratio,
  (val: any) => {
    caclLimitMin(val);
    calcLimitMax(val);
  },
  { immediate: true }
);
const cancel = () => {
  emit('update:showModal', false);
};
const confirm = () => {
  message.success('获取crop信息及宽高比');
  console.log(
    `真实裁剪的信息：${JSON.stringify(cropInfo.value)}`,
    `画布中预览视频裁剪的信息：${JSON.stringify(canvasCropInfo.value)}`
  );
  emit('update:showModal', false);
};
</script>

<style scoped></style>
