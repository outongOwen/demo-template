<template>
  <n-modal
    :z-index="2500"
    preset="dialog"
    :showIcon="false"
    v-model:show="showModal"
    :mask-closable="false"
    style="width: 1080px"
    :block-scroll="false">
    <template #header>
      <div class="text-18px h-30px flex items-center justify-between">
        视频分发
      </div>
    </template>
    <div>
      <n-divider />
      <div class="flex justify-start m-b-20px">
        <div class="w-120px p-r-20px text-right">是否分发：</div>
        <n-switch v-model:value="formData.isDistribution" />
      </div>
      <platformItem></platformItem>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import platformItem from './components/platformItem.vue'
import { getProvideFormData } from './hooks/index'
import {getAllEnum} from "./hooks/getAllList";
import {primaryClassifyPri, totalStrategyPri} from "@/views/distributeForm/hooks/provide";
defineOptions({name: "mainForm"})
const formData = ref({
  isDistribution: false,
  platformListValue: [-1],
  childValue: '',
  groupId: '',
  taskId: '',
  videoId: '',
  title: '',
  secondClassCode: [],
});
const totalStrategyIdList = ref([]);
const primaryClassifyData = ref([]);
const { provideFormData } = getProvideFormData()
provideFormData(formData)
const { provideTotalStrategy } = totalStrategyPri()
provideTotalStrategy(totalStrategyIdList)
const { providePrimaryClassify } = primaryClassifyPri()
providePrimaryClassify(primaryClassifyData)
const showModal = ref(false)
const listObject = ref({}) as any[];
const enumOptionsList = ref({}) as any[];
const ListCode: Array<string> = [
  'categoryOpt',
  'assetSource',
  'lang',
  'captionLang',
  'contentFormList',
  'cpIdList',
  'operationFlagList',
  'contentTypeList',
  'watermarkPathList',
  'cpLogoPathList',
]
onMounted(()=>{
  console.log(ListCode)
  getAllEnum({formData,listObject,enumOptionsList})
  showModal.value = true
})
</script>

<style scoped>

</style>
