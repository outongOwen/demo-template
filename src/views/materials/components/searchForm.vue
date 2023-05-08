<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * searchForm.vue
-->
<template>
  <n-el tag="div" class="b-b-1px b-color-[var(--border-color)] transition-all mb-15px">
    <n-form ref="formRef" :model="searchModel" size="small" label-placement="top" :show-label="false" inline>
      <n-grid cols="1 400:2 700:6" :x-gap="5">
        <n-form-item-gi path="inputValue">
          <n-input v-model:value="searchModel.inputValue" placeholder="关键字搜索" />
        </n-form-item-gi>
        <n-form-item-gi label="Select" path="selectValue">
          <n-select v-model:value="searchModel.selectValue" placeholder="一级" :options="generalOptions()" />
        </n-form-item-gi>
        <n-form-item-gi label="一级" path="multipleSelectValue">
          <n-select v-model:value="searchModel.multipleSelectValue" placeholder="二级" :options="generalOptions()" />
        </n-form-item-gi>
        <n-form-item-gi label="二级" path="multipleSelectValue2">
          <n-select v-model:value="searchModel.multipleSelectValue2" placeholder="三级" :options="generalOptions()" />
        </n-form-item-gi>
        <n-form-item-gi label="三级" span="2" path="multipleSelectValue">
          <n-space justify="end" :wrap-item="false" class="w100%">
            <n-button> 重置 </n-button>
            <n-button type="primary" secondary> 搜索 </n-button>
            <n-button type="primary"> 只看我 </n-button>
          </n-space>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-el>
</template>

<script setup lang="ts">
defineOptions({ name: 'FromContainer' });
// interface Props {
//   value: Record<string, any>;
// }
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
</script>

<style scoped lang="scss">
:deep(.n-form-item) {
  .n-form-item-feedback-wrapper {
    @apply important-min-h15px line-height-unset;
  }
}
</style>
