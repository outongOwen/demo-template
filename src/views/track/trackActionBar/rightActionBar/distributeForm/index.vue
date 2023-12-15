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
      <platformItem ref="platformRef" @setTemplateData="setTemplateFn"></platformItem>
      <associatedVideo v-show="isMediaLong" ref="associatedVideoRef"></associatedVideo>
      <mapInitForm v-show="!isMediaLong" ref="mapInitFormRef"></mapInitForm>
      <strategyItem ref="strategyRef"></strategyItem>
      <outputSetting ref="outputRef"></outputSetting>
      <labelSetting ref="labelRef"></labelSetting>
      <vrSetting ref="vrSettingRef"></vrSetting>
    </n-scrollbar>
    <template #action>
      <div class="w-100% flex justify-between">
        <n-select v-model="formData.keepRatio" class="w-20%" :options="ratioArr"></n-select>
        <div class="flex flex-items-center">
          <n-button
            strong
            secondary
            circle
            :type="clearData ? 'primary' : undefined"
            class="m-x-10px"
            @click="clearDataChange"
          >
            <template #icon>
              <n-icon>
                <Icon :class="{ 'c-#fff': !clearData }" icon="ep:success-filled" />
              </n-icon>
            </template>
          </n-button>
          分发后清空编目
          <n-button strong secondary circle type="primary" class="m-x-10px" @click="submitForm">
            <template #icon>
              <n-icon><Icon icon="bi:send-fill" /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { primaryClassifyPri, totalStrategyPri } from './hooks/provide';
import platformItem from './components/platformItem.vue';
import associatedVideo from './components/associatedVideo.vue';
import mapInitForm from './components/mapInitForm.vue';
import strategyItem from './components/strategyItem.vue';
import outputSetting from './components/outputSetting.vue';
import labelSetting from './components/labelSetting.vue';
import vrSetting from './components/vrSetting.vue';
import { getProvideFormData } from './hooks/index';
import { getDefaultEnumCodeValue, setDefaultEnumCodeValue, setTemplateData } from './hooks/dataOperation';
defineOptions({ name: 'MainForm' });

const platformRef = ref();
const associatedVideoRef = ref();
const mapInitFormRef = ref();
const strategyRef = ref();
const outputRef = ref();
const labelRef = ref();
const vrSettingRef = ref();

// 分辨率选择
const ratioArr = [
  {
    value: '480p',
    label: '480p'
  },
  {
    value: '540p',
    label: '540p'
  },
  {
    value: '720p',
    label: '720p'
  },
  {
    value: '1080p',
    label: '1080p'
  },
  {
    value: '4K',
    label: '4K'
  }
];
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
const clearData = ref(false);
const isMediaLong = computed(() => formData.value.platformListValue.includes('-2'));
const clearDataChange = () => {
  clearData.value = !clearData.value;
};
const setTemplateFn = data => {
  setTemplateData(formData, data, labelRef);
};

const submitForm = () => {
  const refList = [platformRef, associatedVideoRef, mapInitFormRef, strategyRef, outputRef, labelRef, vrSettingRef];
  let flag = true;
  refList.forEach((v: any) => {
    flag = v.value.validate();
    if (!flag) throw new Error(`${v.name}ValidateError`);
  });
};

// 一级分类
watch(
  () => formData.value.platformListValue,
  () => {
    setDefaultEnumCodeValue(formData);
  },
  { deep: true }
);

onMounted(async () => {
  showModal.value = true;
  await getDefaultEnumCodeValue();
  setDefaultEnumCodeValue(formData);
});
</script>

<style scoped></style>
