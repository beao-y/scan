<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineAsyncComponent } from 'vue'
import { useThemeStore } from '@/store/themeState.ts'

const Layout = defineAsyncComponent(() => import('@/layout/index.vue'))
const Application = defineAsyncComponent(() => import('@/layout/Application.vue'))

const themeStore = useThemeStore()
const { clientHeight } = storeToRefs((themeStore))

onMounted(() => {
  // 监听页面的高度
  clientHeight.value = document.documentElement.clientHeight

  window.onresize = () => {
    clientHeight.value = document.documentElement.clientHeight
  }
})
</script>

<template>
  <a-config-provider :theme="themeStore.themeConfig">
    <Application>
      <a-app class="w-full h-full">
        <Layout />
      </a-app>
    </Application>
  </a-config-provider>
</template>

<style scoped></style>
