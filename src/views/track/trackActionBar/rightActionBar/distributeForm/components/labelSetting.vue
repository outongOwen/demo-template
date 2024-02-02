<template>
  <n-form ref="formRef" :model="formData" label-placement="left" label-width="120">
    <div id="LabelSetting" class="font-900 c-#1890FF text-16px m-y-10px">
      三级标签
      <span class="c-red">*</span>
    </div>
    <n-grid x-gap="12" :cols="2" class="b-1 b-#ccc b-rd-1 p-10px" :class="{ 'b-red': thirdError }">
      <n-form-item-gi label="自定义">
        <inputToTag form-key="customize" :max-length="20" show-reset @change="changeCustomize"></inputToTag>
      </n-form-item-gi>
      <template v-for="item in thirdLabelsList" :key="item.code">
        <n-form-item-gi :label="item.name">
          <n-select
            v-model:value="customSelValues[item.code]"
            clearable
            filterable
            multiple
            :on-update:value="changeThirdLabels"
            :options="item.options"
            @focus="searchFn(item)"
          ></n-select>
        </n-form-item-gi>
      </template>
    </n-grid>
    <div class="font-900 c-#1890FF text-16px m-y-10px">
      推荐标签
      <span class="c-red">*</span>
    </div>
    <n-grid x-gap="12" :cols="2" class="b-1 b-#ccc b-rd-1" :class="{ 'b-red': recError }">
      <n-form-item-gi class="p-10px" path="recommendation">
        <div>
          <n-button type="primary" size="small" class="m-b-10px" @click="clearRecommend">
            <template #icon>
              <n-icon size="18">
                <Icon icon="zondicons:refresh" />
              </n-icon>
            </template>
            清空推荐标签
          </n-button>
          <n-checkbox-group v-if="communityEnum && communityEnum.categoryOpt" v-model:value="formData.recommendation">
            <n-checkbox
              v-for="item in communityEnum.categoryOpt"
              :key="item.value"
              class="w-25% p-5px"
              :value="item.value"
              :label="item.label"
            />
          </n-checkbox-group>
        </div>
      </n-form-item-gi>
      <n-gi class="b-l-1" :class="{ 'b-red': recError }">
        <div class="p-10px">
          已选标签
          <div class="min-h-50px">
            <template v-for="tag in selectedTag" :key="tag.name">
              <n-tag class="m-5px" closable :type="tag.type === 'sec' ? 'info' : undefined" @close="closeTag(tag)">
                {{ tag.name }}
              </n-tag>
            </template>
          </div>
          二级候选词
          <div class="min-h-50px">
            <template v-for="tag in secHolder" :key="tag.name">
              <n-tag class="m-5px" type="info" @click="selectHolder(tag)">{{ tag.name }}</n-tag>
            </template>
          </div>
          默认候选词
          <div class="min-h-50px">
            <template v-for="tag in baseHolder" :key="tag.name">
              <n-tag class="m-5px" @click="selectHolder(tag)">{{ tag.name }}</n-tag>
            </template>
          </div>
        </div>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { jsonToQuery } from '@/utils';
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';
import { getDistributeEnum } from '@/service/api';
import { communityEnum } from '../hooks/getAllList';
import inputToTag from './spacialFormItem/inputToTag.vue';

defineOptions({ name: 'LabelSetting' });
const thirdLabelsList = ref([]) as Ref<any[]>;
const secHolder = ref<any[]>([]);
const baseHolder = ref<any[]>([]);
const selectedTag = ref<any[]>([]);

const thirdError = ref(false);
const recError = ref(false);
const customSelValues = ref<Record<string, any>>({});
const formRef = ref();
const { injectFormData } = getProvideFormData();
const formData = injectFormData();
const clearRecommend = () => {
  formData.value.recommendation = [];
};
const selectHolder = tag => {
  const list = tag.type === 'sec' ? secHolder.value : baseHolder.value;
  const index = list.findIndex(v => v.name === tag.name);
  list.splice(index, 1);
  if (selectedTag.value.length) {
    recError.value = false;
  }
  selectedTag.value.push(tag);
};
const closeTag = tag => {
  const index = selectedTag.value.findIndex(v => v.code === tag.code);
  selectedTag.value.splice(index, 1);
  if (tag.type === 'sec') {
    secHolder.value.push(tag);
  } else {
    baseHolder.value.push(tag);
  }
  if (!selectedTag.value.length) {
    recError.value = true;
  }
};
const getThirdLabels = async () => {
  const parmStr: any = {
    labelRootCode: formData.value.category
  };
  if (formData.value.secondClassCode === '1003') {
    parmStr.secondClassCode = formData.value.secondClassCode.join(',');
  }
  const params = {
    parmStr: jsonToQuery(parmStr),
    urlCode: formData.value.platformListValue.includes('-3') ? 'cmam_queryThirdLabels' : 'queryThirdLabels'
  };
  const data = await getDistributeEnum(params);
  data.forEach(v => {
    customSelValues.value[v.code] = '';
  });
  thirdLabelsList.value = data || [];
};
const searchFn = async (item: any) => {
  if (!item || item.options) return;
  const parmStr: any = {
    labelPId: item.code,
    keywords: ''
  };
  if (formData.value.category === '1003') {
    parmStr.secondClassCode = formData.value.secondClassCode.join(',');
  }
  const params = {
    parmStr: jsonToQuery(parmStr),
    urlCode: formData.value.platformListValue.includes('-3') ? 'cmam_queryThirdSublabels' : 'queryThirdSublabels'
  };
  const data = await getDistributeEnum(params);
  // eslint-disable-next-line
  item.options = data.map((v: any)=>({label: v.name,value: v.code}))
  Promise.resolve();
};
const setCustom = (key, value) => {
  setTimeout(async () => {
    if (thirdLabelsList.value.length && Object.hasOwn(customSelValues.value, key)) {
      const item = thirdLabelsList.value.find(v => v.code === key);
      if (item) {
        await searchFn(item);
        const arr: any[] = [];
        value.split(',').forEach((v: any) => {
          const opt = item.options.find((vv: any) => vv.label === v);
          arr.push(opt.value);
        });
        nextTick(() => {
          customSelValues.value[key] = arr;
        });
      }
    } else {
      setCustom(key, value);
    }
  }, 200);
};
const setTags = tagNameList => {
  setTimeout(() => {
    if (secHolder.value.length || baseHolder.value.length) {
      tagNameList.split(',').forEach(tagName => {
        const item = secHolder.value.find(v => v.name === tagName) || baseHolder.value.find(v => v.name === tagName);
        item && nextTick(() => selectHolder(item));
      });
    } else {
      setTags(tagNameList);
    }
  }, 200);
};
const setTemplateData = data => {
  if (!data.newKeywords) return;
  const obj = JSON.parse(data.newKeywords);
  Object.keys(obj).forEach(v => {
    if (v === 'customize') {
      customSelValues.value = obj[v].split(',');
    } else {
      setCustom(v, obj[v]);
    }
  });
  thirdError.value = false;
  if (data.recommendation) {
    setTags(data.recommendation);
    recError.value = false;
  }
};
const changeCustomize = (flag: boolean) => {
  thirdError.value = !flag;
};
const changeThirdLabels = val => {
  if (val && val.length) {
    thirdError.value = true;
  } else {
    const list = Object.keys(customSelValues.value);
    thirdError.value = Boolean(list.find(v => customSelValues.value[v]));
  }
};
const validate = callback =>
  new Promise((resolve, reject) => {
    const list = Object.keys(customSelValues.value);
    const flag = list.find(v => customSelValues.value[v]);
    if ((formData.value.customize || flag) && formData.value.recommendation && selectedTag.value.length) {
      callback(undefined);
      resolve(undefined);
    } else if (!(formData.value.customize || flag)) {
      thirdError.value = true;
      callback(true);
      reject(new Error('custom'));
    } else {
      recError.value = true;
      callback(true);
      reject(new Error('recommendation'));
    }
  });
const restoreValidation = () => formRef.value.restoreValidation();

defineExpose({ setTemplateData, validate, restoreValidation, comName: 'LabelSetting' });
// 推荐标签一级分类
watch(
  () => formData.value.recommendation,
  async (val: any[]) => {
    selectedTag.value = [];
    const parmStr = jsonToQuery({ displayTypes: val.join(','), itemType: '3' });
    const data: any = await getDistributeEnum({
      parmStr,
      urlCode: formData.value.platformListValue.includes('-3') ? 'cmam_get_recomm' : 'get_recomm'
    });
    secHolder.value = data.recommList.map(v => ({ code: v.itemCode, name: v.itemName, type: 'sec' }));
    const hold = data.recommList.find(v => v.mappings);
    baseHolder.value = hold ? hold.mappings.map(v => ({ code: v.id, name: v.name, type: 'base' })) : [];
  },
  { deep: true }
);
// 二级分类
watch(
  () => formData.value.secondClassCode,
  (val: string) => {
    if (formData.value.category === '1003') {
      if (!val || !val.length) {
        thirdLabelsList.value = [];
        return;
      }
      getThirdLabels();
    }
  }
);
// 一级分类
watch(
  () => formData.value.category,
  (val: string) => {
    formData.value.recommendation = [formData.value.category];
    if (!val || val === '1003') {
      thirdLabelsList.value = [];
      return;
    }
    getThirdLabels();
  }
);
</script>

<style scoped></style>
