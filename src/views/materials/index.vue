<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * index.vue
-->
<template>
  <keep-alive :include="keepAliveIncludes">
    <component :is="renderComponent" :options="menuOptions" />
  </keep-alive>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { getFirstOrgInfo, getUserBindList } from '@/service/api';
import {
  VideoMaterial,
  AudioMaterial,
  ImageMaterial,
  TransparentMaterial,
  DecorationMaterial,
  TextMaterial,
  SubtitleMaterial
} from './components';
import { provideFirstOrgList, provideFullUserList } from './hooks/index';
defineOptions({ name: 'MaterialsModules' });
interface Props {
  menuOptions: GlobalMenuOptions.ExtendMenuOptions;
}
const props = defineProps<Props>();
const { menuOptions } = toRefs(props);
const componentMap: Record<string, Component> = {
  picture: ImageMaterial,
  video: VideoMaterial,
  music: AudioMaterial,
  text: TextMaterial,
  subtitle: SubtitleMaterial,
  decoration: DecorationMaterial,
  transparent: TransparentMaterial
};
const keepAliveIncludes = ref<(string | RegExp)[]>([]);
const menuType = computed((): string | number => {
  return menuOptions.value.key!;
});
const renderComponent = computed((): Component => {
  const menuTypeLowerCase = String(menuType.value).toLowerCase();
  const component = componentMap[menuTypeLowerCase];
  return component;
});
const OrgList = ref([]) as Ref<CascaderOption[]>;
const UserList = ref([]) as Ref<CascaderOption[]>;

const { provideFirstOrgContext } = provideFirstOrgList();
const { provideFullUserContext } = provideFullUserList();
onBeforeMount(async () => {
  try {
    const res = await getFirstOrgInfo({ page: 1, rows: 999 });
    res.content.forEach((v: any) => {
      v.isLeaf = false;
      v.depth = 1;
    });
    OrgList.value = res.content;
    UserList.value = await getUserBindList();
  } catch (e) {
    console.log(e);
  }
});
provideFirstOrgContext(OrgList);
provideFullUserContext(UserList);
watchEffect(() => {
  const { key } = menuOptions.value;
  const isExist = keepAliveIncludes.value.some(item => {
    return item === `${key}Material`;
  });
  key && !isExist && menuOptions.value.isKeepAlive && keepAliveIncludes.value.push(`${key}Material`);
});
</script>
