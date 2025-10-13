<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Outlet = defineAsyncComponent(() => import('./components/Outlet.vue'))
</script>

<template>
  <a-layout class="w-full h-full">
    <Outlet />
  </a-layout>
</template>

<style scoped></style>
