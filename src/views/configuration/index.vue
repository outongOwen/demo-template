<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <global-configuration>
    <Transition>
      <div v-if="globalStore.getTestSelect" class="wh-full relative">
        <component :is="UseConfig" />
        <div class="absolute-rt right-3px top-3px select-unset" @click.stop.passive="handleCloseConfiguration">
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
  </global-configuration>
</template>

<script setup lang="ts">
import { GlobalConfiguration } from '@/layouts';
import { useGlobalStore } from '@/store';
// import type { TabsOptions } from '@/components/custom/BetterTabs.vue';
import { VideoConfig, AudioConfig, ImageConfig } from '@/packages/views/index';
defineOptions({ name: 'ConfigurationModules' });
interface Props {
  activeType: any;
}
const props = defineProps<Props>();
const componentMap: Record<string, Component> = {
  video: VideoConfig,
  music: AudioConfig,
  picture: ImageConfig
};
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

<style scoped></style>
