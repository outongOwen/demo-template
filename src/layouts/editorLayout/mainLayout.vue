<template>
  <div
    class="wh-full dark:bg-dark"
    :style="{ minHeight: ` ${theme.layoutMinHeight}px`, minWidth: `${theme.layoutMinWidth}px` }"
  >
    <div class="w100%" :style="{ height: ` ${theme.header.height}px` }">
      <slot name="headerArea"></slot>
    </div>
    <div class="layout-divider w100%"></div>
    <div :style="`height: calc(100% - (${theme.header.height + 5}px))`" class="flex">
      <div :style="{ width: ` ${theme.sliderMenu.width}px` }" class="h100%">
        <slot name="sliderMenu"></slot>
      </div>
      <div class="layout-divider h100%"></div>
      <div :style="`width: calc(100% - (${theme.sliderMenu.width + 5}px))`">
        <splitpanes horizontal>
          <pane>
            <splitpanes>
              <pane min-size="30" max-size="70">
                <slot name="centerLeftArea"></slot>
              </pane>
              <pane>
                <slot name="centerRightArea"></slot>
              </pane>
            </splitpanes>
          </pane>
          <pane max-size="65" min-size="30">
            <slot name="trackArea"></slot>
          </pane>
        </splitpanes>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import { useThemeStore } from '@/store';
const theme = useThemeStore();
defineOptions({ name: 'MainLayout' });
</script>
