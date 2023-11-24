<template>
  <global-layout>
    <template #headerArea>
      <Header />
    </template>
    <template #sliderMenu>
      <global-slider-menu
        :menu-options="sliderMenuOptionsAuthList"
        :default-menu-key="defaultMenuKey"
        @select-menu-option="handleSelectMenuOption"
      />
    </template>
    <template #centerLeftArea>
      <materials v-if="currentMenuOption" :menu-options="currentMenuOption" />
      <Configuration v-if="getTestSelect" :active-type="currentMenuOption" />
    </template>
    <template #centerRightArea>
      <Player />
    </template>
    <template #trackArea>
      <Track />
    </template>
  </global-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash';
import { sliderMenuOptions } from '@/settings';
import { useGlobalStore } from '@/store';
import Header from '@/views/header/index.vue';
import Materials from '@/views/materials/index.vue';
import Player from '@/views/player/index.vue';
import Configuration from '@/views/configuration/index.vue';
import Track from '@/views/track/index.vue';
import { getMenuList } from '@/service/api';
import { GlobalLayout, GlobalSliderMenu } from '@/layouts/components';
defineOptions({ name: 'EditorLayout' });
const globalStore = useGlobalStore();
const { getTestSelect } = storeToRefs(globalStore);
const defaultMenuKey = ref<string | number | null>(null);
const currentMenuOption = ref<GlobalMenuOptions.ExtendMenuOptions | null>();
const sliderMenuOptionsAuthList = ref<GlobalMenuOptions.ExtendMenuOptions[]>([]);

/**
 * @abstract 权限过滤
 */
const sliderMenuOptionsAuthFilter = async () => {
  try {
    const authList = await getMenuList();
    const authMenuOptions = cloneDeep(sliderMenuOptions).filter(item => {
      return authList.some((auth: any) => {
        if (auth.type === item.key && auth?.children?.length) {
          item.secondMenuOptions = auth.children.reduce((pre: GlobalMenuOptions.SecondMenuOptions[], cur: any) => {
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
    // 判断是否具备3v3权限
    let is3V3Auth = false
    authMenuOptions.forEach((item: any) => {
      if (item.id === '100000') {
        is3V3Auth = item.children.some((citem: any) => {
          return citem.id === '100500'
        })
      }
    });
    globalStore.setIs3v3Status(is3V3Auth)
    sliderMenuOptionsAuthList.value = authMenuOptions as any;
  } catch (error) {
    console.log(error);
  }
};
const handleSelectMenuOption = (_key: string | number | null, item: GlobalMenuOptions.ExtendMenuOptions) => {
  globalStore.setTestSelect(false);
  currentMenuOption.value = item;
};
watchEffect(() => {
  if (sliderMenuOptionsAuthList.value.length) {
    defaultMenuKey.value = sliderMenuOptionsAuthList.value[0]?.key ? sliderMenuOptionsAuthList.value[0].key : null;
    currentMenuOption.value = sliderMenuOptionsAuthList.value?.length
      ? cloneDeep(sliderMenuOptionsAuthList.value[0])
      : null;
  }
});
onMounted(() => {
  sliderMenuOptionsAuthFilter();
});
</script>
