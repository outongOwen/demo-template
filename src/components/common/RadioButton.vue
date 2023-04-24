<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-24
 * RadioButton.vue
-->
<template>
  <div class="w100% relative">
    <n-space
      ref="radioButtonContainerRef"
      :style="{ height: isShowOrHideTabList && hasTabWrap ? `${tabLineHeight}px` : 'auto' }"
      class="radio-button-container of-hidden"
      :wrap-item="true"
      :size="20"
    >
      <n-tag
        v-for="item in showOptions"
        :key="item.key"
        :checked="checkedKey === item.key"
        checkable
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
      class="absolute-rt right--10px text-30px cursor-pointer transition-base"
      :class="{ 'rotate--180': isShowOrHideTabList }"
      @click="handleShowOrHideTabs"
    />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useElementSize } from '@vueuse/core';
import type { SecondMenuOptions } from '#/packages.d';
interface Props {
  options: SecondMenuOptions[] | [];
  size?: 'small' | 'medium' | 'large';
  strong?: boolean;
  defaultKey?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  strong: false,
  defaultKey: ''
});
const { options, defaultKey } = toRefs(props);
const radioButtonContainerRef = ref<HTMLElement | null>(null);
const checkedKey = ref(defaultKey.value);
const hasTabWrap = ref<boolean>(false); // 换行状态
const isShowOrHideTabList = ref<boolean>(false); // 是否显示或隐藏tab列表
const { width } = useElementSize(radioButtonContainerRef);
const tabLineHeight = ref<number>(0);
const handleChecked = (item: SecondMenuOptions) => {
  checkedKey.value = item.key;
};
/**
 * 检查标签是否换行
 * @return {number[]} 换行index
 */
const checkTagWrap = (): void => {
  const containerEl = document.querySelector('.radio-button-container');
  const nTagElements = document.querySelectorAll('.radio-button-container>div');
  const containerTop = containerEl?.getBoundingClientRect().top;
  for (let i = 0; i < nTagElements.length; i += 1) {
    const top = nTagElements[i].getBoundingClientRect().top;
    const height = nTagElements[i].getBoundingClientRect().height;
    if (top > containerTop!) {
      hasTabWrap.value = true;
      !tabLineHeight.value && height && (tabLineHeight.value = height);
      return;
    }
  }
  hasTabWrap.value = false;
  isShowOrHideTabList.value = true;
};
const handleShowOrHideTabs = () => {
  isShowOrHideTabList.value = !isShowOrHideTabList.value;
};
const showOptions = ref<SecondMenuOptions[] | []>(options.value);
watch(
  () => width.value,
  () => {
    nextTick(() => {
      checkTagWrap();
    });
  }
);
</script>
