<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-24
 * RadioButton.vue
-->
<template>
  <div ref="radioButtonContainerRef" class="mr25px relative">
    <n-space
      :style="{
        height: isShowOrHideTabList && hasTabWrap ? `${tabLineHeight}px` : `auto`
      }"
      class="radio-button-container of-hidden"
      :space-size="spaceSize"
      :wrap-item="false"
    >
      <n-tag
        v-for="item in options"
        :key="item.key"
        :checked="item.key === (checkedKey ? checkedKey : defaultKey)"
        checkable
        :size="size"
        :strong="strong"
        :color="{ color: '#fff' }"
        @click="handleChecked(item)"
      >
        {{ item.label }}
        <template v-if="item.icon" #avatar>
          <Icon :icon="item.icon"></Icon>
        </template>
      </n-tag>
    </n-space>
    <Icon
      v-if="hasTabWrap"
      icon="material-symbols:keyboard-arrow-up"
      class="absolute-rt right--30px text-30px cursor-pointer transition-base select-none"
      :class="{ 'rotate--180': isShowOrHideTabList }"
      @click="handleShowOrHideTabs"
    />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useElementSize, useTimeoutFn } from '@vueuse/core';
import type { SecondMenuOptions } from '#/packages.d';
defineOptions({ name: 'RadioButtonGroup' });
interface Props {
  options: SecondMenuOptions[] | [];
  size?: 'small' | 'medium' | 'large';
  strong?: boolean;
  defaultKey?: string;
  spaceSize?: number;
}
interface Emits {
  (e: 'checked', tItem: SecondMenuOptions): void;
}
const emits = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  strong: false,
  defaultKey: '',
  spaceSize: 10
});
const { options, defaultKey } = toRefs(props);
const radioButtonContainerRef = ref<HTMLElement | null>(null);
const checkedKey = ref('');
const hasTabWrap = ref<boolean>(false); // 换行状态
const isShowOrHideTabList = ref<boolean>(false); // 是否显示或隐藏tab列表
const { width: containerWidth } = useElementSize(radioButtonContainerRef, undefined, {
  box: 'border-box'
});
const tabLineHeight = ref<number>(0);
const handleChecked = (item: SecondMenuOptions) => {
  if (checkedKey.value !== item.key) {
    checkedKey.value = item.key;
    emits('checked', item);
  }
};
const handleShowOrHideTabs = () => {
  isShowOrHideTabList.value = !isShowOrHideTabList.value;
};
/**
 * 检查标签是否换行
 * @return {number[]} 换行index
 */
const checkTagWrap = (): void => {
  const containerEl = document.querySelector('.radio-button-container');
  const nTagElements = document.querySelectorAll('.radio-button-container>div');
  const containerTop = containerEl?.getBoundingClientRect().top;
  for (let i = 0; i < Array.from(nTagElements).length; i += 1) {
    const top = nTagElements[i].getBoundingClientRect().top;
    const height = nTagElements[i].getBoundingClientRect().height;
    if (top > containerTop!) {
      hasTabWrap.value = true;
      !tabLineHeight.value && height && (tabLineHeight.value = height);
      return;
    }
  }
  hasTabWrap.value = false;
};
watch(
  () => containerWidth.value,
  () => {
    useTimeoutFn(() => {
      options.value.length && checkTagWrap();
    }, 30);
  },
  {
    immediate: true,
    flush: 'post'
  }
);
</script>
