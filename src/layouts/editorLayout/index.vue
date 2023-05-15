<template>
  <main-layout>
    <template #headerArea>
      <Header />
    </template>
    <template #sliderMenu>
      <layout-slider-menu
        :menu-options="sliderMenuOptionsAuthList"
        :default-menu-key="defaultMenuKey"
        @select-menu-option="handleSelectMenuOption"
      />
    </template>
    <template #centerLeftArea>
      <materials v-if="currentMenuOption && !getTestSelect" :menu-options="currentMenuOption" />
      <Configuration v-if="getTestSelect" />
    </template>
    <template #centerRightArea>画布</template>
    <template #trackArea>轨道</template>
  </main-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import { sliderMenuOptions } from '@/settings';
import Header from '@/views/header/index.vue';
import Materials from '@/views/materials/index.vue';
import Configuration from '@/views/configuration/index.vue';
import { getMenuList } from '@/service/api';
import { useGlobalStore } from '~/src/store';
import MainLayout from './layoutSlot.vue';
import type { ExtendMenuOptions, SecondMenuOptions } from '#/packages.d';
defineOptions({ name: 'EditorLayout' });
const globalStore = useGlobalStore();
const { getTestSelect } = storeToRefs(globalStore);
const defaultMenuKey = ref<string | number | null>(null);
const currentMenuOption = ref<ExtendMenuOptions | null>();
const sliderMenuOptionsAuthList = reactive<ExtendMenuOptions[]>([]);
/**
 * @abstract 权限过滤
 */
const sliderMenuOptionsAuthFilter = async () => {
  try {
    const authList = await getMenuList();
    const authMenuOptions = cloneDeep(sliderMenuOptions).filter(item => {
      return authList.some((auth: any) => {
        if (auth.type === item.key && auth?.children?.length) {
          item.secondMenuOptions = auth.children.reduce((pre: SecondMenuOptions[], cur: any) => {
            const { type, name } = cur;
            const option = {
              label: name,
              key: type,
              ...cur
            };
            pre.push(option);
            return pre;
          }, []);
        }
        return (auth.type === item.key && !item.isLocal) || item.isLocal;
      });
    });
    sliderMenuOptionsAuthList.push(...authMenuOptions);
  } catch (error) {
    console.log(error);
  }
};
const handleSelectMenuOption = (_key: string | number | null, item: ExtendMenuOptions) => {
  globalStore.setTestSelect(false);
  currentMenuOption.value = item;
};
watchEffect(() => {
  if (sliderMenuOptionsAuthList.length) {
    defaultMenuKey.value = sliderMenuOptionsAuthList[0]?.key ? sliderMenuOptionsAuthList[0].key : null;
    currentMenuOption.value = sliderMenuOptionsAuthList?.length ? cloneDeep(sliderMenuOptionsAuthList[0]) : null;
  }
});
onMounted(() => {
  sliderMenuOptionsAuthFilter();
});
</script>
