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
    <n-scrollbar class="max-h-70vh p-r-20px last">
      <div class="flex justify-start m-b-20px">
        <div class="w-120px p-r-20px text-right">是否分发：</div>
        <n-switch v-model:value="formData.isDistribution" />
      </div>
      <platformItem ref="platformRef" @set-template-data="setTemplateFn"></platformItem>
      <notSendForm v-show="onlyFtp || !formData.isDistribution"></notSendForm>
      {{ isMediaLong }}
      <div v-show="formData.isDistribution && !onlyFtp">
        <associatedVideo v-show="isMediaLong" ref="associatedVideoRef"></associatedVideo>
        <mapInitForm v-show="!isMediaLong && !onlyFtp" ref="mapInitFormRef"></mapInitForm>
        <strategyItem v-show="!isMCN && !onlyFtp" ref="strategyRef"></strategyItem>
      </div>
      <outputSetting ref="outputRef"></outputSetting>
      <div v-show="formData.isDistribution && !onlyFtp">
        <labelSetting v-show="!isMCN && !onlyFtp && !isMediaLong" ref="labelRef"></labelSetting>
        <vrSetting v-if="false" ref="vrSettingRef"></vrSetting>
      </div>
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
import { editLongParams, MCNShow } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks/formInitMap';
import { primaryClassifyPri, totalStrategyPri } from './hooks/provide';
import platformItem from './components/platformItem.vue';
import associatedVideo from './components/associatedVideo.vue';
import notSendForm from './components/notSendForm.vue';
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
  isDistribution: true,
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
const mediaCode = ['1', '2'];
const notFtp = ['-1', '-2', '-3', '1', '2'];
const isMediaLong = computed(() => formData.value.platformListValue.includes('-2'));
const isMCN = computed(() => Boolean(mediaCode.find(v => formData.value.platformListValue.includes(v))));
const onlyFtp = computed(() => !notFtp.find(v => formData.value.platformListValue.includes(v)));
const clearDataChange = () => {
  clearData.value = !clearData.value;
};
const setTemplateFn = data => {
  let refList = [mapInitFormRef, strategyRef, labelRef];
  if (isMediaLong.value) {
    refList = [associatedVideoRef, strategyRef];
  } else if (isMCN.value) {
    refList = [mapInitFormRef];
  }
  refList.forEach(v => {
    v.value.restoreValidation();
  });
  setTemplateData(formData, data, labelRef);
};
const emit = defineEmits(['submitData']);
const submitForm = async () => {
  const catalog: any = {};
  let id = '';
  if (onlyFtp.value || !formData.value.isDistribution) {
    catalog.title = formData.value.title;
    catalog.fps = formData.value.fps;
    catalog.bitrate = formData.value.bitrate;
  } else if (isMCN.value) {
    mapInitFormRef.value.validate((flag: boolean) => {
      if (flag) {
        MCNShow.forEach((key: string) => {
          catalog[key] = formData[key];
        });
      } else {
        id = 'MapInitForm';
      }
    });
  } else if (isMediaLong.value) {
    const refList = [associatedVideoRef, strategyRef];
    refList.forEach(v => {
      v.value.validate(flag => {
        if (flag) {
          id = v.value.comName;
        }
      });
    });
    if (!id) {
      editLongParams.forEach((key: string) => {
        catalog[key] = formData.value[key];
      });
    }
  } else {
    const refList = [mapInitFormRef, strategyRef, labelRef];
    refList.forEach(v => {
      v.value.validate(flag => {
        if (flag) {
          id = v.value.comName;
        }
      });
    });
    if (!id) {
      const list = Object.keys(formData.value);
      list.forEach(key => {
        formData.value[key] && (catalog[key] = formData.value[key]);
      });
    }
  }
  if (id) {
    const dom = document.getElementById(id);
    // 定位代码
    dom &&
      dom.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });
    return;
  }
  emit('submitData', {
    taskId: '',
    extend: '',
    catalog,
    coverPaths: '',
    imgIds: '',
    srtList: ''
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
const open = () => {
  showModal.value = true;
};
defineExpose({
  open
});
onMounted(async () => {
  open();
  await getDefaultEnumCodeValue();
  setDefaultEnumCodeValue(formData);
});
</script>

<style scoped></style>
