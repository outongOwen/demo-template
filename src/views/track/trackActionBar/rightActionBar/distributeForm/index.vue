<template>
  <n-modal
    v-model:show="showModal"
    :z-index="2500"
    preset="dialog"
    :show-icon="false"
    :mask-closable="false"
    style="width: 1080px"
    :block-scroll="false"
  >
    <template #header>
      <div class="text-18px h-30px flex items-center justify-between">视频分发</div>
    </template>
    <n-divider />
    <n-scrollbar class="max-h-70vh p-r-20px">
      <div class="flex justify-start m-b-20px">
        <div class="w-120px p-r-20px text-right">是否分发：</div>
        <n-switch v-model:value="formData.isDistribution" />
      </div>
      <platformItem></platformItem>
      <mapInitForm></mapInitForm>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { primaryClassifyPri, totalStrategyPri } from './hooks/provide';
import platformItem from './components/platformItem.vue';
import mapInitForm from './components/mapInitForm.vue';
import { getProvideFormData } from './hooks/index';
defineOptions({ name: 'MainForm' });
const formData = ref<{ [key: string]: any }>({
  platformListValue: []
});
const totalStrategyIdList = ref([]);
const primaryClassifyData = ref([]);
const { provideFormData } = getProvideFormData();
provideFormData(formData);
const { provideTotalStrategy } = totalStrategyPri();
provideTotalStrategy(totalStrategyIdList);
const { providePrimaryClassify } = primaryClassifyPri();
providePrimaryClassify(primaryClassifyData);
const showModal = ref(false);
onMounted(() => {
  showModal.value = true;
});
</script>

<style scoped></style>
