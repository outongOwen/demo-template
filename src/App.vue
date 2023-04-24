<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full of-hidden"
  >
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui';
import { useThemeStore, subscribeStore } from '@/store';

const theme = useThemeStore();
subscribeStore();
</script>
<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar(8px, #942c2c);
}

.dark #__SCROLL_EL_ID__ {
  @include scrollbar(8px, #555);
}
</style>
