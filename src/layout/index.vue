<script setup lang="ts">
import { App } from 'ant-design-vue'
import { antdUtils } from '@/utils/antUtils.ts'

const { message, modal, notification } = App.useApp()

const route = useRoute()

const HomeLayout = defineAsyncComponent(() => import('@/layout/HomeLayout.vue'))
const FullLayout = defineAsyncComponent(() => import('@/layout/FullLayout.vue'))

const layout = computed(() => {
  return ['/login', '/register'].includes(route.path) ? FullLayout : HomeLayout
})

// 全局注册包裹组件，必须在ConfigProvider子组件使用，在App.vue中使用无效
onMounted(() => {
  antdUtils.setMessageInstance(message)
  antdUtils.setNotificationInstance(notification)
  antdUtils.setModalInstance(modal)
})
</script>

<template>
  <component :is="layout" />
</template>

<style scoped></style>
