<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-21
 * trackAactionBar.vue
-->
<template>
  <div class="h-full flex justify-between items-center">
    <n-space class="!flex-nowrap mr10px" :wrap-item="false">
      <left-action-bar />
    </n-space>
    <n-space class="!flex-nowrap" :wrap-item="false">
      <right-action-bar />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import LeftActionBar from './leftActionBar.vue';
import RightActionBar from './rightActionBar.vue';
defineOptions({
  name: 'TrackActionBar'
});
</script>
