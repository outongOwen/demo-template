<!--
 * @abstract:素材预览
 * @author: owenTong
 * @since: 2023-05-31
 * MaterialPreviewModal.vue
-->
<template>
  <n-modal
    v-model:show="isShowModal"
    :auto-focus="false"
    @after-enter="handleModalAfterEnter"
    @after-leave="handleModalAfterLeave"
  >
    <div
      class="w65vw h30vw min-w-screen-md min-h650px of-hidden rounded-[var(--border-radius)] 2xl:min-w-screen-lg xl:min-w-screen-lg lg:min-w-screen-lg dark:bg-dark bg-white"
    >
      <div class="h100% box-border">
        <div class="px-20px py10px flex">
          <!-- 头部区域 -->
          <div class="flex-center font-500 w100% text-18px">{{ materialData.name || '测试' }}</div>
          <n-button tertiary size="tiny" @click="isShowModal = false">
            <template #icon>
              <n-icon :size="25">
                <icon-ri:close-fill />
              </n-icon>
            </template>
          </n-button>
        </div>
        <n-divider class="m-0!" />
        <div class="w100% h-[calc(100%-48px)] flex p20px box-border">
          <!-- 素材展示区域 -->
          <div class="w-75% h100% relative flex-center relative bg-[rgba(0,0,0,0.6)]">
            <template v-if="playerType === 'video'">
              <div id="preview-container" class="wh-full relative" />
            </template>
            <template v-if="playerType === 'music'">
              <div id="preview-container" class="wh-full relative">
                <canvas ref="musicAnalyzeRef" class="absolute-center z9" />
              </div>
              <div class="absolute-center z9" />
              <icon-mdi:music class="absolute-transform-center text-100px color-[rgba(255,255,255,0.6)]" />
            </template>
            <template v-if="playerType === 'picture' || playerType === 'transparent'">
              <n-image
                :src="materialData.path"
                :preview-src="materialData.path"
                :fallback-src="defaultImg"
                object-fit="contain"
                preview-disabled
                @load="handleImageLoad"
              >
                <template #placeholder>
                  <n-skeleton class="wh-full" />
                </template>
              </n-image>
            </template>
            <n-spin
              v-show="isShowPreviewInfoLoading"
              class="absolute left-0 right-0 top-0 bottom-0 bg-[rgba(0,0,0,0.6)] z-99"
            />
          </div>
          <n-divider vertical class="h100%! mx-20px!" />
          <!-- 素材详情区域 -->
          <div class="w25% h100%">
            <n-descriptions label-placement="left" title="视频信息" size="large" :column="1">
              <n-descriptions-item>
                <template #label>{{ '类型' }}</template>
                视频
              </n-descriptions-item>
              <n-descriptions-item label="分辨率">
                {{ materialData.resolvePower || '' }}
              </n-descriptions-item>
              <n-descriptions-item label="创建人">
                {{ materialData.createName || '' }}
              </n-descriptions-item>
              <n-descriptions-item label="创建时间">
                {{ materialData.updateTime || '' }}
              </n-descriptions-item>
            </n-descriptions>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import Player from 'xgplayer';
import MusicPreset, { Analyze } from 'xgplayer-music';
import Mp4Plugin from 'xgplayer-mp4';
import { useThemeStore } from '@/store';
import defaultImg from '@/assets/default.png'
defineOptions({ name: 'MaterialPreviewModal', inheritAttrs: false });
export type PlayerType = 'video' | 'music' | 'picture' | 'transparent';
interface Props {
  showModal: boolean;
  materialData: any;
  materialType: PlayerType;
}
interface Emits {
  (e: 'update:showModal'): void;
}
const props = withDefaults(defineProps<Props>(), {
  showModal: false
});
const emits = defineEmits<Emits>();
const themeStore = useThemeStore();
const isShowModal = useVModel(props, 'showModal', emits);
const { materialData, materialType } = toRefs(props);
const isShowPreviewInfoLoading = ref<boolean>(true);
const musicAnalyzeRef = ref<HTMLElement | null>();
let xgPlayer: Player;
/**
 * #TODO 临时解决方案，后续需要根据素材类型来判断
 */
const playerType = computed((): PlayerType => {
  // const { materialType } = materialData.value;
  return materialType.value;
});
const createVideoPlayer = () => {
  return new Player({
    id: 'preview-container',
    url: materialData.value.preUrl,
    fluid: true,
    ignores: ['playbackrate', 'cssfullscreen'],
    poster: materialData.value.keyFrameUrl,
    plugins: [Mp4Plugin],
    mp4plugin: {
      maxBufferLength: 30,
      minBufferLength: 10
    },
    commonStyle: {
      // 播放完成部分进度条底色
      playedColor: themeStore.getThemeColor,
      // 进度条滑块样式
      sliderBtnStyle: {
        background: themeStore.getThemeColor
      },
      // 音量颜色
      volumeColor: themeStore.getThemeColor
    },
    videoConfig: {
      crossOrigin: 'anonymous'
    },
    lang: 'zh-cn',
    loop: true,
    isHideTips: true
  });
};
const createMusicPlayer = () => {
  return new Player({
    id: 'preview-container',
    url: materialData.value.sourcePath, // [{ src: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3', name: '林宥嘉·脆弱一分钟', poster: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/poster-small.jpeg' }],
    volume: 0.8,
    mediaType: 'audio',
    presets: ['default', MusicPreset],
    ignores: ['playbackrate', 'MusicPrev', 'MusicNext'],
    fluid: true,
    lang: 'zh-cn',
    controls: {
      initShow: true,
      mode: 'flex'
    },
    isHideTips: true,
    videoConfig: {
      crossOrigin: 'anonymous'
    },
    marginControls: true,
    loop: true,
    commonStyle: {
      // 播放完成部分进度条底色
      playedColor: themeStore.getThemeColor,
      // 进度条滑块样式
      sliderBtnStyle: {
        background: themeStore.getThemeColor
      },
      // 音量颜色
      volumeColor: themeStore.getThemeColor
    }
  });
};
const createAnalyze = () => {
  return new Analyze(xgPlayer, musicAnalyzeRef.value!, {
    bgColor: 'rgba(0,0,0,0.6)',
    stroke: 3,
    colors: [themeStore.getThemeColor],
    mode: 'doubleLine',
    isGradient: true
  });
};
const handleModalAfterEnter = () => {
  if (playerType.value === 'video') {
    xgPlayer = createVideoPlayer();
  }
  if (playerType.value === 'music') {
    xgPlayer = createMusicPlayer();
    createAnalyze();
  }
  if (playerType.value === 'video' || playerType.value === 'music') {
    xgPlayer.once('ready', () => {
      isShowPreviewInfoLoading.value = false;
    });
  }
};
const handleModalAfterLeave = () => {
  isShowPreviewInfoLoading.value = false;
  xgPlayer && xgPlayer.destroy();
};
const handleImageLoad = () => {
  isShowPreviewInfoLoading.value = false;
};
watchEffect(() => {
  isShowPreviewInfoLoading.value = isShowModal.value;
});
</script>

<style scoped lang="scss">
:deep(.n-image) {
  @apply wh-full;
  > img {
    @apply wh-full;
  }
}
</style>
