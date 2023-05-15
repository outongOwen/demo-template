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
        :key="(item[keyField] as string | number | null)!"
        :checked="item[keyField] === (valueVModel ? valueVModel : defaultKey)"
        checkable
        :size="size"
        :strong="strong"
        :color="{ color: '#fff' }"
        @click="handleChecked(item[keyField] as string | number | null, item)"
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
import { useVModel, useElementSize, useTimeoutFn } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import type { SecondMenuOptions } from '#/packages.d';
defineOptions({ name: 'RadioButtonGroup' });
interface Props {
  options: SecondMenuOptions[] | [];
  value: string | number | null;
  size?: 'small' | 'medium' | 'large';
  strong?: boolean;
  defaultKey?: string | number | null;
  spaceSize?: number;
  keyField?: string;
}
interface Emits {
  (e: 'change', key: string | number | null, option: SecondMenuOptions): void;
  (e: 'update:value', key: string | number | null): void;
}
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  strong: false,
  defaultKey: '',
  spaceSize: 10,
  keyField: 'key',
  value: null
});
const { options, defaultKey, keyField } = toRefs(props);
const valueVModel = useVModel(props, 'value', emit);
const radioButtonContainerRef = ref<HTMLElement | null>();
const hasTabWrap = ref<boolean>(false); // 换行状态
const isShowOrHideTabList = ref<boolean>(false); // 是否显示或隐藏tab列表
const { width: containerWidth } = useElementSize(radioButtonContainerRef, undefined, {
  box: 'border-box'
});
const tabLineHeight = ref<number>(0);
const handleChecked = (key: string | number | null, option: SecondMenuOptions) => {
  if (valueVModel.value !== key && option) {
    valueVModel.value = key;
    emit('change', key, option);
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
