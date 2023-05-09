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
      <materials v-if="currentMenuOption" :menu-options="currentMenuOption" />
    </template>
    <template #centerRightArea>画布</template>
    <template #trackArea>轨道</template>
  </main-layout>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { sliderMenuOptions } from '@/settings';
import Header from '@/views/header/index.vue';
import materials from '@/views/materials/index.vue';
import MainLayout from './layoutSlot.vue';
import { getMaterialAuthList } from './mock';
import type { ExtendMenuOptions } from '#/packages.d';
defineOptions({ name: 'EditorLayout' });
const defaultMenuKey = ref<string | number | null>(null);
const currentMenuOption = ref<ExtendMenuOptions | null>();
const sliderMenuOptionsAuthList = reactive<ExtendMenuOptions[]>([]);
/**
 * @abstract 权限过滤
 */
const sliderMenuOptionsAuthFilter = async () => {
  try {
    const authList = await getMaterialAuthList();
    const authMenuOptions = sliderMenuOptions.filter(item => {
      return authList.some(auth => {
        return auth.type === item.key || item.isLocal;
      });
    });
    sliderMenuOptionsAuthList.push(...authMenuOptions);
  } catch (error) {
    console.log(error);
  }
};
const handleSelectMenuOption = (_key: string | number | null, item: ExtendMenuOptions) => {
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
