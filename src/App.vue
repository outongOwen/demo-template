<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      <div>123213213</div>
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
const a = document.createElement('div');
const b = '12323';
a.innerHTML = '123123123';
document.body.appendChild(a);
console.log(a);
</script>
<style scoped></style>
