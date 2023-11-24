<!--
 * @Description:视频素材
 * @author: owenTong
 * @since: 2023-04-23
 * index.vue
-->
<template>
  <div class="text-box p-20px">
    <div class="hover-box w-160px h-90px lh-90px border-rd-8px">
      字幕
      <Icon
        icon="gridicons:add-outline"
        class="icon text-26px"
        :style="{ color: '#096dd9', fontSize: '26px' }"
        @click.stop="doSomeThing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'TextMaterial' });
const doSomeThing = () => {}
</script>

<style scoped>
.hover-box {
  background: #000000;
  text-align: center;
  font-size: 18px;
}
.hover-box:hover {
  border: 1px solid #096dd9;
  position: relative;
}
.hover-box > .icon {
  display: none;
}
.hover-box:hover > .icon {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
