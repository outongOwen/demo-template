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
import { VideoConfig, AudioConfig, ImageConfig } from '@/packages/views/index';

const componentMap: Record<string, Component> = {
  video: VideoConfig,
  music: AudioConfig,
  picture: ImageConfig
};
defineOptions({ name: 'ConfigurationBody' });

const props = defineProps(['activeType']);
let UseConfig = {};
watchEffect(() => {
  const { activeType } = props;
  if (activeType) {
    const name = activeType.key.toLowerCase();
    UseConfig = componentMap[name];
  }
});
const globalStore = useGlobalStore();
const handleCloseConfiguration = () => {
  globalStore.setTestSelect(false);
};
</script>
