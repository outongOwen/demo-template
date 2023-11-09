<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-11
 * configurationBody.vue
-->
<template>
  <Transition>
    <div v-if="globalStore.getTestSelect" class="wh-full relative">
      <component :is="AudioConfig" />
      <div class="absolute-rt right-3px top-3px select-unset" @click.stop="handleCloseConfiguration">
        <n-button tertiary text size="tiny">
          <template #icon>
            <n-icon :size="25">
              <icon-ic:sharp-close />
            </n-icon>
          </template>
        </n-button>
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
