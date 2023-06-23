<!--
 * @abstract:装饰素材
 * @author: owenTong
 * @since: 2023-05-29
 * decorationMaterial.vue
-->
<template>
  <div class="container">{{ options }}</div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DecorationMaterial' });
interface Props {
  options: GlobalMenuOptions.ExtendMenuOptions;
}
const props = defineProps<Props>();
const { options } = toRefs(props);
</script>

<style scoped></style>
