<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * index.vue
-->
<template>
  <Transition>
    <global-material :show-header="menuOptions?.areaConfig?.secondMenu && menuOptions?.areaConfig?.searchForm">
      <template v-if="menuOptions?.areaConfig?.secondMenu" #second-menu>
        <second-menu
          v-model:value="curSecondMenuKey"
          :options="secondMenuOptions"
          :key-field="keyField"
          @change="handleSecondChecked"
        />
      </template>
      <template v-if="menuOptions?.areaConfig?.searchForm" #search-form>
        <search-form v-model:value="searchFormModel" @search="handleSearch" />
      </template>
      <template v-if="menuOptions?.areaConfig?.materialBody" #material-body>
        <material-body
          ref="materialBodyRef"
          :key="comKey"
          :query-condition="queryCondition"
          :list-config="listSchema"
          :menu-type="menuType"
        />
        <!-- :query-condition="queryCondition" @refresh="handleRefresh" -->
      </template>
    </global-material>
  </Transition>
</template>

<script setup lang="ts">
import GlobalMaterial from '@/layouts/common/globalMaterial.vue';
import SearchForm from './components/searchForm.vue';
import SecondMenu from './components/secondMenu.vue';
import MaterialBody from './components/materialBody.vue';
import type { ExtendMenuOptions, SecondMenuOptions, ListSchema } from '#/packages.d';
defineOptions({ name: 'Materials' });
interface Props {
  menuOptions: ExtendMenuOptions;
}
const props = defineProps<Props>();
const { menuOptions } = toRefs(props);

const searchFormModel = reactive<Record<string, any>>({});
const keyField = ref<string>('key');
const curSecondMenuKey = ref<string>('');
const secondMenuOptions = computed((): SecondMenuOptions[] => {
  return menuOptions.value?.secondMenuOptions ? menuOptions.value?.secondMenuOptions : [];
});
const menuType = computed((): string | number => {
  return menuOptions.value.key!;
});
const comKey = computed((): string | number => {
  return String(menuOptions.value.key!) + curSecondMenuKey.value;
});
const listSchema = computed((): ListSchema => {
  return menuOptions.value.listSchema!;
});
const queryCondition = computed((): Record<string, unknown> => {
  searchFormModel.key = curSecondMenuKey.value;
  return searchFormModel;
});
watchEffect(() => {
  curSecondMenuKey.value = secondMenuOptions.value.length ? (secondMenuOptions.value[0][keyField.value] as string) : '';
});
const handleSecondChecked = (key: string | number | null, option: SecondMenuOptions) => {
  console.log(curSecondMenuKey.value, 'curSecondMenuKeycurSecondMenuKey');
  console.log(key, option, 'radioItemradioItem');
};
const handleSearch = () => {};
</script>
