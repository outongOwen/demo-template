<template>
  <div
    class="wh-full dark:bg-dark"
    :style="{ minHeight: ` ${theme.layoutMinHeight}px`, minWidth: `${theme.layoutMinWidth}px` }"
  >
    <div class="w100%" :style="{ height: ` ${theme.header.height}px` }">
      <slot name="headerArea"></slot>
    </div>
    <div class="layout-divider w100%"></div>
    <div :style="`height: calc(100% - (${theme.header.height + 5}px))`" class="flex w100%">
      <div :style="{ width: ` ${theme.sliderMenu.width}px` }">
        <slot name="sliderMenu"></slot>
      </div>
      <div class="layout-divider h100%"></div>
      <splitpanes
        horizontal
        :style="`width: calc(100% - (${theme.sliderMenu.width + 5}px));`"
        :dbl-click-splitter="false"
      >
        <pane>
          <splitpanes>
            <pane class="min-w-340px" min-size="20" max-size="70">
              <div class="wh-full relative">
                <slot name="centerLeftArea"></slot>
              </div>
            </pane>
            <pane class="min-w-450px">
              <slot name="centerRightArea"></slot>
            </pane>
          </splitpanes>
        </pane>
        <pane max-size="70" min-size="20">
          <slot name="trackArea"></slot>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import { useThemeStore } from '@/store';
const theme = useThemeStore();
defineOptions({ name: 'GlobalLayout' });
</script>
