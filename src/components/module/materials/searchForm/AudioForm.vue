<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * AudioForm.vue
-->
<template>
  <div class="wh-full">
    <div class="px-10px">
      <n-form ref="formRef" :model="searchModel" size="small" label-placement="top" :show-label="false" inline>
        <n-grid cols="1 400:2 700:6" :x-gap="5">
          <n-form-item-gi path="inputValue">
            <n-input v-model:value="searchModel.inputValue" placeholder="关键字搜索" />
          </n-form-item-gi>
          <n-form-item-gi path="selectValue">
            <n-select v-model:value="searchModel.selectValue" placeholder="一级" :options="generalOptions()" />
          </n-form-item-gi>
          <n-form-item-gi path="multipleSelectValue">
            <n-select v-model:value="searchModel.multipleSelectValue" placeholder="二级" :options="generalOptions()" />
          </n-form-item-gi>
          <n-form-item-gi path="multipleSelectValue2">
            <n-select v-model:value="searchModel.multipleSelectValue2" placeholder="三级" :options="generalOptions()" />
          </n-form-item-gi>
          <n-form-item-gi span="2" path="multipleSelectValue">
            <slot name="subButton" :reset-form="resetForm" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
    <n-divider class="mt0px! mb15px!" />
  </div>
</template>

<script setup lang="ts">
import type { FormInst } from 'naive-ui';
defineOptions({ name: 'FromContainer' });
// interface Props {
//   value: Record<string, any>;
// }
const formRef = ref<FormInst>();
const searchModel = ref({
  inputValue: null,
  textareaValue: null,
  selectValue: null,
  multipleSelectValue: null,
  multipleSelectValue2: null
});
const generalOptions = () =>
  ['groode', 'veli good', 'emazing', 'lidiculous'].map(v => ({
    label: v,
    value: v
  }));
const resetForm = () => {
  searchModel.value = {
    inputValue: null,
    textareaValue: null,
    selectValue: null,
    multipleSelectValue: null,
    multipleSelectValue2: null
  };
};
</script>

<style scoped lang="scss">
:deep(.n-form-item) {
  .n-form-item-feedback-wrapper {
    @apply important-min-h15px line-height-unset;
  }
}
</style>
