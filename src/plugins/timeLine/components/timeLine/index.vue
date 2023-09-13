<!--
 * @Description: TimeLine
 * @abstract: 时间线编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div class="timeLine-editor">
    <!-- <TimeLineRule /> -->
    <TimeLineCursor />
    <!-- <TimeLineEditorArea v-bind="$attrs" /> -->
  </div>
</template>
<script lang="ts">
export default {
  name: 'TimeLine'
};
</script>
<script setup lang="ts">
// import TimeLineRule from '../timeLineRule/index.vue';
// import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
</script>
<style lang="scss" scoped>
.timeLine-editor {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
