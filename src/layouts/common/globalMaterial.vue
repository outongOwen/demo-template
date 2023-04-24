<template>
  <div class="flex-col wh-full">
    <header class="flex-col p15px">
      <div class="pb10px">
        <slot name="second-menu"></slot>
      </div>
      <div class="">
        <slot name="search-form"></slot>
      </div>
    </header>
    <div class="p15px">
      <slot name="material-body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
