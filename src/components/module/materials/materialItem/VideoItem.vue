<!--
 * @abstract:视频素材列表项
 * @author: owenTong
 * @since: 2023-05-06
 * imageItem.vue
-->
<template>
  <div :style="{ height: item.height + 'px', width: item.width + 'px' }">
    <div
      class="hover-box w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.3)] h-[calc(100%-20px)] relative flex-center"
      @click="emits('preview', item)"
    >
      <n-popover placement="bottom" trigger="hover">
        <template #trigger>
          <n-image
            :height="item.height - 20"
            :width="item.width"
            :src="item.injected.keyFrameUrl"
            :fallback-src="defaultImg"
            :preview-src="item.injected.preUrl"
            object-fit="contain"
            preview-disabled
          >
            <template #placeholder>
              <n-skeleton class="w-full h-[calc(100%-20px)]" />
            </template>
          </n-image>
        </template>
        <div>
          <p>标题：{{ item.injected.title }}</p>
          <p>时长：{{ formatFrameByTime((item.injected.duration || item.injected.mediaAnalyze.duration) * 1000) }}</p>
          <p>分辨率：{{ item.injected.width }} * {{ item.injected.height }}</p>
          <p>创建人：{{ item.injected.userName }}</p>
        </div>
      </n-popover>
      <text class="absolute-rb pr3px">
        {{ formatFrameByTime(Number(item.injected.programLength) || item.injected.mediaAnalyze?.duration * 1000 || 0 )}}
      </text>
      <Icon
        v-if="preSuccess"
        icon="gridicons:add-outline"
        class="icon text-26px"
        :style="{ color: '#096dd9', fontSize: '26px' }"
        @click.stop="doSomeThing"
      />
      <Icon
        v-if="rePretreatment"
        icon="ic:outline-refresh"
        class="icon text-26px"
        :style="{ color: '#096dd9', fontSize: '26px' }"
        @click.stop="pretreatmentEvent"
      />
    </div>
    <n-text>
      <n-ellipsis class="w100% h20px">
        {{ item.injected.title }}
      </n-ellipsis>
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { formatFrameByTime } from '@/utils';
import {addVideoPretreatment, favoritePretreatment} from "@/service/api";
import defaultImg from '@/assets/default.png'
// interface IntersectionObserverOptions {
//   root?: Element | Document | null | string;
//   rootMargin?: string;
//   threshold?: number | number[];
// }
interface Props {
  item: {
    id: string;
    injected: Record<string, any>;
    height: number;
    width: number;
    columnSpan: number;
  };
}
interface Emits {
  (event: 'preview', material: any): void;
  (event: 'getPreStatus', id: any): void;
}
defineOptions({ name: 'VideoItem' });
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { item } = toRefs(props);

const pretreatmentEvent = async () => {
  const id: any = {
    id: props.item.injected.id,
    extend:  props.item.injected.extend,
  }
  if ( props.item.injected.mediaType) {
    //收藏视频
    await favoritePretreatment({
      favoriteId:  props.item.injected.favoriteId,
    })
  } else {
    await addVideoPretreatment(id)
  }
  let searchStatusId = id.id
  if ( props.item.injected.source == 1) {
    // 如果是拆条打点数据来源
    try {
      searchStatusId = JSON.parse(
        JSON.parse(id.extend).pretreatment
      ).mediaId
    } catch (error) {
      console.log(error)
    }
  }
  props.item.injected.preStatus = 4
  emits('getPreStatus',searchStatusId)
}
const preSuccess = computed(() => {
  // 如果预处理状态preStatus == 5并且有preUrl,判定当前是预处理完成
  return (
    (props.item.injected.preStatus === '5' && props.item.injected.preUrl) ||
    (props.item.injected.statusProduct === '1' && props.item.injected.isDistribution)
  );
});
const rePretreatment = computed(() => {
  // 如果预处理状态preStatus == 5,但是preUrl不存在
  return (
    props.item.injected.preStatus === '1' || (props.item.injected.preStatus === '5' && !props.item.injected.preUrl)
  );
});
const status = ref(false)
const doSomeThing = () => {
  status.value = true
};
</script>
<style scoped>
.hover-box:hover {
  border: 1px solid #096dd9;
  position: relative;
}
.hover-box > .icon {
  display: none;
}
.hover-box:hover > .icon {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
