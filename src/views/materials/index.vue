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
import {
  VideoMaterial,
  AudioMaterial,
  ImageMaterial,
  TransparentMaterial,
  DecorationMaterial,
  TextMaterial,
  SubtitleMaterial
} from './components';
defineOptions({ name: 'MaterialsModules' });
interface Props {
  menuOptions: GlobalMenuOptions.ExtendMenuOptions;
}
const props = defineProps<Props>();
const { menuOptions } = toRefs(props);
const componentMap: Record<string, Component> = {
  image: ImageMaterial,
  video: VideoMaterial,
  audio: AudioMaterial,
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
watchEffect(() => {
  const { key } = menuOptions.value;
  const isExist = keepAliveIncludes.value.some(item => {
    return item === `${key}Material`;
  });
  key && !isExist && menuOptions.value.isKeepAlive && keepAliveIncludes.value.push(`${key}Material`);
});
</script>
