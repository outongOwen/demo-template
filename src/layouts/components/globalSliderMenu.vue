<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * SliderMenu.vue
-->
<template>
  <div ref="sliderMenuContainerRef" class="relative wh-full py-10px">
    <div
      v-show="!isShowBackTopBtn && isShowScroll"
      class="absolute w100% h65px top-0 cursor-pointer flex-center bg-gradient-to-b from-[rgba(40,40,40)] from-0% to-100% z9 transition-all duration-300"
      @click="handleBackTop"
    >
      <icon-ph:caret-circle-up-fill v-if="!isMouseEnter" class="text-35px" />
    </div>
    <better-scroll-bar ref="scrollRef" trigger="none" :is-show-scroll-bar="false" @scroll="handleScroll">
      <n-menu
        v-model:value="activeKey"
        :options="menuOptions"
        :icon-size="25"
        :indent="0"
        :root-indent="0"
        @update:value="handleUpdateValue"
      />
    </better-scroll-bar>
    <div
      v-show="!isShowBackBottomBtn && isShowScroll"
      class="absolute w100% h65px bottom-0 flex-center z9 cursor-pointer bg-gradient-to-t from-[rgba(40,40,40)] from-0% to-100%"
      @click="handleBackBottom"
    >
      <icon-ph:caret-circle-down-fill v-if="!isMouseEnter" class="text-35px transition-all" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMouseInElement, watchOnce } from '@vueuse/core';
import type { ScrollReturnOption } from '@/components/custom/BetterScrollBar.vue';
import BetterScrollBar from '@/components/custom/BetterScrollBar.vue';
defineOptions({ name: 'SliderMenuLayout' });
interface Props {
  menuOptions: GlobalMenuOptions.ExtendMenuOptions[];
  defaultMenuKey?: string | number | null;
}
interface Emits {
  (e: 'selectMenuOption', key: string | number | null, item: GlobalMenuOptions.ExtendMenuOptions): void;
}

const props = withDefaults(defineProps<Props>(), {
  defaultMenuKey: null
});
const emit = defineEmits<Emits>();
const { menuOptions, defaultMenuKey } = toRefs(props);
const activeKey = ref<string | number | null>();
const scrollRef = ref<InstanceType<typeof BetterScrollBar> | null>(null);
const sliderMenuContainerRef = ref<HTMLElement | null>();
const isShowBackTopBtn = ref(false);
const isShowBackBottomBtn = ref(false);
const isShowScroll = ref(false);
const { isOutside: isMouseEnter } = useMouseInElement(sliderMenuContainerRef);
const handleScroll = (_e: Event, option: ScrollReturnOption): void => {
  isShowBackTopBtn.value = option.arrivedState.top;
  isShowBackBottomBtn.value = option.arrivedState.bottom;
};
const handleBackTop = (): void => {
  scrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
};
const handleBackBottom = (): void => {
  scrollRef.value?.scrollToBottom();
};
const handleUpdateValue = (key: string, item: any): void => {
  emit('selectMenuOption', key, item);
};
watchOnce(defaultMenuKey, key => {
  if (key) {
    activeKey.value = key;
    nextTick(() => {
      isShowBackTopBtn.value = (scrollRef.value?.scrollOptions as ScrollReturnOption).arrivedState.top;
      isShowBackBottomBtn.value = (scrollRef.value?.scrollOptions as ScrollReturnOption).arrivedState.bottom;
      isShowScroll.value = scrollRef.value!.isScrollbarY;
    });
  }
});
</script>
<style scoped lang="scss">
:deep(.n-menu-item) {
  @apply h55px  box-border;
  .n-menu-item-content {
    @apply flex-center flex-col pr-0 line-height-unset;
    .n-menu-item-content__icon {
      @apply important-mr-0;
    }
    .n-menu-item-content-header {
      @apply w80% text-center px-5px;
    }
  }
  .n-menu-item-content::before {
    @apply left-10px right-10px;
  }
}
</style>
