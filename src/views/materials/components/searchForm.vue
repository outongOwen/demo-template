<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * searchForm.vue
-->
<template>
  <n-el tag="div" class="b-b-1px b-color-[var(--border-color)] transition-all">
    <n-form ref="formRef" :model="model" size="small" label-placement="top" :show-label="false" inline>
      <n-grid cols="1 400:2 700:6" :x-gap="5">
        <n-form-item-gi path="inputValue">
          <n-input v-model:value="model.inputValue" placeholder="关键字搜索" />
        </n-form-item-gi>
        <n-form-item-gi label="Select" path="selectValue">
          <n-select v-model:value="model.selectValue" placeholder="一级" :options="generalOptions()" />
        </n-form-item-gi>
        <n-form-item-gi label="MultipleSelect" path="multipleSelectValue">
          <n-select v-model:value="model.multipleSelectValue" placeholder="二级" :options="generalOptions()" />
        </n-form-item-gi>
        <n-form-item-gi label="MultipleSelect" path="multipleSelectValue">
          <n-select v-model:value="model.multipleSelectValue" placeholder="三级" :options="generalOptions()" />
        </n-form-item-gi>
        <n-form-item-gi label="MultipleSelect" span="2" path="multipleSelectValue">
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
const model = ref({
  inputValue: null,
  textareaValue: null,
  selectValue: null,
  multipleSelectValue: [],
  datetimeValue: 0
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
