<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-21
 * trackAactionBar.vue
-->
<template>
  <div class="h-full flex justify-between items-center">
    <left-action-bar />
    <right-action-bar />
  </div>
</template>

<script setup lang="ts">
import LeftActionBar from './leftActionBar.vue';
import RightActionBar from './rightActionBar.vue';
</script>
