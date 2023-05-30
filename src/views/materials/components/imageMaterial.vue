<!--
 * @Description: 图片素材
 * @author: owenTong
 * @since: 2023-05-29
 * imageMaterial.vue
-->
<template>
  <div class="container">{{ options }}</div>
</template>

<script setup lang="ts">
import type { ExtendMenuOptions } from '#/packages.d';
defineOptions({ name: 'ImageMaterial' });
interface Props {
  options: ExtendMenuOptions;
}
const props = defineProps<Props>();
const { options } = toRefs(props);
</script>

<style scoped></style>
