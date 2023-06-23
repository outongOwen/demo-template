<!--
 * @Description: 文本素材
 * @author: owenTong
 * @since: 2023-05-29
 * textMaterial.vue
-->
<template>
  <div class="container">{{ options }}</div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TextMaterial' });
interface Props {
  options: GlobalMenuOptions.ExtendMenuOptions;
}
const props = defineProps<Props>();
const { options } = toRefs(props);
</script>

<style scoped></style>
