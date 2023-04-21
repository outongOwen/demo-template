<template>
  <n-space>
    <n-button @click="switchTheme('light')"> 亮色主题 </n-button>
    <n-button @click="switchTheme('dark')"> 黑色主题 </n-button>
  </n-space>
  <splitpanes class="wh-full" horizontal>
    <pane>
      <splitpanes>
        <pane min-size="30" max-size="70">2</pane>
        <pane>3</pane>
      </splitpanes>
    </pane>
    <pane max-size="65" min-size="30">5</pane>
  </splitpanes>
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import { useThemeStore } from '@/store';
defineOptions({ name: 'EditorLayout' });
const themeStore = useThemeStore();
const switchTheme = (theme: string) => {
  themeStore.setDarkMode(theme === 'dark');
};
</script>

<style lang="scss"></style>
