<template>
  <main-layout>
    <template #headerArea>
      <Header />
    </template>
    <template #centerLeftArea>
      <materials :first-menu-option="currentMenuOption" />
    </template>
    <template #sliderMenu>
      <SliderMenu
        :menu-options="sliderMenuOptions"
        :default-menu-key="defaultMenuKey"
        @select-menu-option="handleSelectMenuOption"
      />
    </template>
    <template #centerRightArea>画布</template>
    <template #trackArea>轨道</template>
  </main-layout>
</template>

<script setup lang="ts">
import { sliderMenuOptions } from '@/settings';
import Header from '@/views/header/index.vue';
import materials from '@/views/materials/index.vue';
import MainLayout from './mainLayout.vue';
import type { ExtendMenuOptions } from '#/packages.d';
defineOptions({ name: 'EditorLayout' });
const defaultMenuKey = ref<string | number | null>(null);
const currentMenuOption = ref<ExtendMenuOptions | null>(null);
const handleSelectMenuOption = (_key: string | number | null, item: ExtendMenuOptions | null) => {
  currentMenuOption.value = item;
};
watchEffect(() => {
  defaultMenuKey.value = sliderMenuOptions[0]?.key ? sliderMenuOptions[0]?.key : null;
  currentMenuOption.value = sliderMenuOptions?.length ? sliderMenuOptions[0] : null;
});
</script>
