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
        height: isShowOrHideTabList && hasTabWrap ? `${lineHeight}px` : `auto`
      }"
      class="radio-button-container of-hidden"
      :class="{
        'radio-button--dark': theme === 'dark'
      }"
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
      v-if="options.length && hasTabWrap"
      icon="material-symbols:keyboard-arrow-up"
      class="absolute-rt right--30px text-30px cursor-pointer transition-base select-none"
      :class="{ 'rotate--180': isShowOrHideTabList }"
      @click="handleShowOrHideTabs"
    />
  </div>
  <n-divider v-if="bottomDivider" class="my10px!" />
</template>

<script lang="ts" setup>
import { useVModel, useResizeObserver } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import type { SecondMenuOptions } from '#/packages.d';
defineOptions({ name: 'RadioButtonGroup' });
export interface RadioButtonGroupOption extends SecondMenuOptions {
  renderComponent?: Component | VNode | null | undefined;
}
interface Props {
  options: RadioButtonGroupOption[] | [];
  value: string | number | null;
  size?: 'small' | 'medium' | 'large';
  strong?: boolean;
  defaultKey?: string | number | null;
  spaceSize?: number;
  keyField?: string;
  theme?: 'default' | 'dark';
  bottomDivider?: boolean;
}
interface Emits {
  (e: 'change', key: string | number | null, option: RadioButtonGroupOption): void;
  (e: 'update:value', key: string | number | null): void;
}
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  strong: false,
  defaultKey: '',
  spaceSize: 10,
  keyField: 'key',
  value: null,
  theme: 'default',
  bottomDivider: false
});
const { options, defaultKey, keyField } = toRefs(props);
const valueVModel = useVModel(props, 'value', emit);
const radioButtonContainerRef = ref<HTMLElement | null>();
const hasTabWrap = ref<boolean>(false); // 换行状态
const isShowOrHideTabList = ref<boolean>(false); // 是否显示或隐藏tab列表
const lineHeight = ref<number>(0);
const handleChecked = (key: string | number | null, option: RadioButtonGroupOption) => {
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
  const tagNodeList = radioButtonContainerRef.value!.querySelectorAll('.radio-button-container>.n-tag');
  const tagList = Array.from(tagNodeList) as HTMLElement[];
  const tagLineHeight = tagList[0]?.clientHeight;
  const isWrapped = tagList.some(li => {
    return li.offsetTop !== tagList[0].offsetTop;
  });
  hasTabWrap.value = isWrapped;
  !lineHeight.value && tagLineHeight && (lineHeight.value = tagLineHeight);
};
useResizeObserver(radioButtonContainerRef, () => {
  nextTick(() => {
    options.value.length && checkTagWrap();
  });
});
</script>
<style scoped lang="scss">
:deep(.radio-button--dark) {
  .n-tag--checked {
    @apply dark:important-bg-[rgba(25,25,25)] important-text-#fff important-bg-primary;
  }
}
</style>
