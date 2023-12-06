<!--
 * @abstract:音频素材
 * @author: owenTong
 * @since: 2023-05-29
 * audioMaterial.vue
-->
<template>
  <global-material :show-header="options?.areaConfig?.secondMenu && options?.areaConfig?.searchForm">
    <template v-if="options?.areaConfig?.secondMenu" #second-menu>
      <second-menu-radio-button
        v-model:value="curSecondMenuKey"
        :options="secondMenuOptions"
        :key-field="keyField"
        @change="handleSecondChecked"
      />
    </template>
    <template v-if="options?.areaConfig?.searchForm" #search-form>
      <audio-search-form
        v-model:formModel="searchFormModel"
        :hid-type="hidType"
        @search="handleSearch"
        @reset-form="handleResetSearch"
      />
    </template>
    <template v-if="options?.areaConfig?.materialBody" #material-body>
      <material-gird-list
        ref="materialListRef"
        :options="options"
        :render-component="AudioItem"
        :request="requestList"
      />
    </template>
  </global-material>
</template>

<script setup lang="ts">
import { GlobalMaterial } from '@/layouts';
import AudioItem from '@/components/module/materials/materialItem/AudioItem.vue';
import AudioSearchForm from '@/components/module/materials/searchForm/AudioForm.vue';
import SecondMenuRadioButton from '@/components/custom/RadioButtonGroup.vue';
import type { FromModelInst } from '@/components/module/materials/searchForm/AudioForm.vue';
import { getCatalogMediumList } from '@/service/api';
import { MaterialGirdList } from './common';
defineOptions({ name: 'AudioMaterial' });
interface QueryCondition extends FromModelInst {
  id: string;
  materialType?: string;
  elementType?: string;
}
interface Props {
  options: GlobalMenuOptions.ExtendMenuOptions;
}
const props = defineProps<Props>();
const { options } = toRefs(props);
const curSecondMenuKey = ref<string>('');
const hidType = computed(() => {
  let type: string;
  if (curSecondMenuKey.value === '110200') {
    type = 'org';
  } else if (curSecondMenuKey.value === '110300') {
    type = 'music';
  } else {
    type = 'effect';
  }
  return type;
});
const searchFormModel = ref<FromModelInst>({
  name: '',
  firstOrgId: null,
  secondOrgId: null,
  userIdFromWeb: Number(new URLSearchParams(window?.location?.search)?.get('userId')),
  elementTag: null
});
const materialListRef = ref<InstanceType<typeof MaterialGirdList> | null>(null);
const keyField = ref<string>('id');

const secondMenuOptions = computed((): GlobalMenuOptions.SecondMenuOptions[] => {
  return options.value?.secondMenuOptions ? options.value?.secondMenuOptions : [];
});
const queryCondition = computed((): QueryCondition => {
  const params: QueryCondition = {
    ...searchFormModel.value,
    ...{
      id: curSecondMenuKey.value
    }
  };
  if (curSecondMenuKey.value === '110200') {
    params.materialType = '2';
  } else if (curSecondMenuKey.value === '110300') {
    params.elementType = '1';
  } else {
    params.elementType = '2';
  }
  return params;
});
watchEffect(() => {
  curSecondMenuKey.value = secondMenuOptions.value.length ? (secondMenuOptions.value[0][keyField.value] as string) : '';
});
const handleSecondChecked = () => {
  materialListRef.value?.refreshList();
};
const handleSearch = (_value: FromModelInst, type?: string) => {
  type === 'onlyMe' &&
    (searchFormModel.value.userIdFromWeb = Number(new URLSearchParams(window?.location?.search)?.get('userId')));
  materialListRef.value?.refreshList();
};
const handleResetSearch = () => {
  searchFormModel.value.userIdFromWeb = Number(new URLSearchParams(window?.location?.search)?.get('userId'));
  materialListRef.value?.refreshList();
};
const requestList = async (offset: number, pageSize: number): Promise<any> => {
  try {
    const result = await getCatalogMediumList({
      page: offset,
      rows: pageSize,
      ...queryCondition.value
    });
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};
</script>
