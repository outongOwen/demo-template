<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-11
 * configurationBody.vue
-->
<template>
  <Transition>
    <div class="wh-full relative">
      <component :is="AudioConfig" />
      <div class="absolute-rt right-10px top-5px cursor-pointer select-unset" @click.stop="handleCloseConfiguration">
        <icon-ic:sharp-close class="text-20px" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/store';
// import type { TabsOptions } from '@/components/custom/BetterTabs.vue';
import AudioConfig from '@/packages/views/Audio/config/index.vue';
defineOptions({ name: 'ConfigurationBody' });
const globalStore = useGlobalStore();
const handleCloseConfiguration = () => {
  globalStore.setTestSelect(false);
};
</script>
