<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * SliderMenu.vue
-->
<template>
  <div
    ref="sliderMenuContainerRef"
    class="relative h100% py-10px"
    @mouseenter="isMouseEnter = true"
    @mouseleave="isMouseEnter = false"
  >
    <div
      v-show="!isShowBackTopBtn && isShowScroll"
      class="absolute w100% h65px top-0 cursor-pointer flex-center bg-gradient-to-b from-[rgba(40,40,40)] from-0% to-100% z9 transition-all duration-300"
      @click="handleBackTop"
    >
      <icon-ph:caret-circle-up-fill v-show="!isMouseEnter" class="text-35px" />
    </div>
    <custom-scroll-bar ref="scrollRef" trigger="none" :is-show-scroll-bar="false" @scroll="handleScroll">
      <n-menu
        v-model:value="activeKey"
        :options="menuOptions"
        :icon-size="25"
        :indent="0"
        :root-indent="0"
        @update:value="handleUpdateValue"
      />
    </custom-scroll-bar>
    <div
      v-show="!isShowBackBottomBtn && isShowScroll"
      class="absolute w100% h65px bottom-0 flex-center z9 cursor-pointer bg-gradient-to-t from-[rgba(40,40,40)] from-0% to-100%"
      @click="handleBackBottom"
    >
      <icon-ph:caret-circle-down-fill v-show="!isMouseEnter" class="text-35px transition-all" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMouseInElement } from '@vueuse/core';
import type { ScrollReturnOption } from '@/components/common/CustomScrollBar.vue';
import CustomScrollBar from '@/components/common/CustomScrollBar.vue';
import type { ExtendMenuOptions } from '#/packages.d';
interface Props {
  menuOptions: ExtendMenuOptions[];
  defaultMenuKey?: string | number | null;
}
interface Emits {
  (e: 'selectMenuOption', key: string | number | null, item: ExtendMenuOptions): void;
}

const props = withDefaults(defineProps<Props>(), {
  defaultMenuKey: null
});
const emit = defineEmits<Emits>();
const { menuOptions } = toRefs(props);
const activeKey = ref<string | number | null>(props.defaultMenuKey);
const scrollRef = ref<InstanceType<typeof CustomScrollBar> | null>(null);
const sliderMenuContainerRef = ref<HTMLElement | null>(null);
const isShowBackTopBtn = ref(false);
const isShowBackBottomBtn = ref(false);
const isShowScroll = ref(false);
const { isOutside: isMouseEnter } = useMouseInElement(sliderMenuContainerRef);
const handleScroll = (_e: Event, option: ScrollReturnOption) => {
  isShowBackTopBtn.value = option.arrivedState.top;
  isShowBackBottomBtn.value = option.arrivedState.bottom;
};
const handleBackTop = () => {
  scrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
};
const handleBackBottom = () => {
  scrollRef.value?.scrollToBottom();
};
const handleUpdateValue = (key: string | number, item: ExtendMenuOptions) => {
  emit('selectMenuOption', key, item);
};
onMounted(() => {
  isShowBackTopBtn.value = (scrollRef.value?.scrollOptions as ScrollReturnOption).arrivedState.top;
  isShowBackBottomBtn.value = (scrollRef.value?.scrollOptions as ScrollReturnOption).arrivedState.bottom;
  isShowScroll.value = unref(scrollRef.value?.isScrollbarY)!;
});
</script>
<style scoped lang="scss">
:deep(.n-menu-item) {
  height: 55px;
  padding: 0 10px !important;
  .n-menu-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: 0;
    line-height: unset;
    .n-menu-item-content__icon {
      margin-right: 0 !important;
    }
    .n-menu-item-content-header {
      width: 80%;
      text-align: center;
      padding: 0 5px;
    }
  }
}
</style>
