<template>
  <div class="flex-col items-center">
    <div class="flex flex-wrap">
        <span
          class="w-65px h-26px lh-26px m-x-10px m-b-10px text-center b-1 border-rd-3px position-relative overflow-hidden"
          :class="{'b-#1890FF':true,'c-#1890FF':true,'bg-#1890FF':false,'c-#FFFFFF':false}"
          v-for="rate in cutImgTab" :key="rate.class">
          {{rate.class}}
          <span class="position-absolute w-20px h-20px right--10px top--10px rotate-45 bg-#52c41a">
            <Icon
              icon="mdi:success"
              class="position-absolute left-5px bottom-0 icon text-10px c-#fff rotate-315"
            />
          </span>
        </span>
    </div>
    <n-carousel autoplay show-arrow class="w-350px h-170px">
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
      >
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
      >
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
      >
      <img
        class="carousel-img"
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
      >
    </n-carousel>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
defineOptions({name: "coverImage"})
const cutImgTab = [
    { class: 'H169', has: false, index: 0 },
    { class: 'H32', has: false, index: 1 },
    { class: 'V23', has: false, index: 2 },
    { class: 'V34', has: false, index: 3 },
    { class: 'S11', has: false, index: 4 },
    { class: 'V916', has: false, index: 5 },
  ]
</script>

<style scoped>

</style>
