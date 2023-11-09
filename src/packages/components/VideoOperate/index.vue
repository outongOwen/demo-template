<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * soundEffectSetting.vue
-->
<template>
  <n-grid cols="6">
    <n-gi><div>图片处理</div></n-gi>
    <n-gi :span="5">
      <n-button secondary strong>
        <template #icon>
          <n-icon>
            <Icon icon="ImageSearchRound" />
          </n-icon>
        </template>
        抽图
      </n-button>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'VideoOperate' });
// interface Props {
//   materialData: {
//     volume: number;
//     enterTime: number;
//     leaveTime: number;
//     speed: number;
//   };
// }
// const props = defineProps<Props>();
// const { materialData } = toRefs(props);
// const formatCenter = (value: string): string => {
//   return `${parseFloat(value).toFixed(0)}`;
// };
// const handleUpdateValue = (value: number | null, key: any) => {
//   console.log(value);
//   console.log(key);
// };
</script>

<style scoped></style>
