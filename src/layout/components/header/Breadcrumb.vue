<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'

import { useGlobalState } from '@/store/globalState.ts'

const route = useRoute()
const router = useRouter()
const { permissions } = useGlobalState()

let home: RouteRecordRaw | null = null
function getHome() {
  if (!home) {
    home = permissions.find(item => item.path === '/home') as RouteRecordRaw
  }
}

const breadcrumbList = ref<RouteRecordRaw[]>([])

function getBreadcrumbs(path: string | undefined) {
  const currentRoute = permissions.find(item => item.path === path)
  if (!currentRoute)
    return []

  const parentBreadcrumbs = getBreadcrumbs(currentRoute.parentPath)
  return [...parentBreadcrumbs, currentRoute]
}

watchEffect(() => {
  getHome()
  breadcrumbList.value = getBreadcrumbs(route.path)
  if (home && route.path !== '/home') {
    breadcrumbList.value.unshift(home)
  }
})

// 路由跳转
function handleLink(item: RouteRecordRaw) {
  const { redirect, path } = item
  if (redirect) {
    return router.push(redirect as string)
  }
  router.push(path)
}
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      <span
        v-if="index === breadcrumbList.length - 1"
        class="p-1"
      >{{ item.name }}</span>
      <span v-else class="breadcrumb" @click="handleLink(item)">{{ item.name }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style lang="scss" scoped>
.breadcrumb {
  @apply cursor-pointer p-1 rounded;
  &:hover{
    background-color: var(--ant-color-bg-layout);
  }

}
</style>
