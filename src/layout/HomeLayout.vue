<script setup lang="ts">
import { theme } from 'ant-design-vue'
import { useDeviceType } from '@/hooks'
import { useGlobalState } from '@/store/globalState.ts'

const Outlet = defineAsyncComponent(() => import('./components/Outlet.vue'))
const Logo = defineAsyncComponent(() => import('./components/Logo.vue'))
const Menu = defineAsyncComponent(() => import('./components/menu/index.vue'))
const Header = defineAsyncComponent(() => import('./components/header/index.vue'))

const globalState = useGlobalState()
const { collapsed } = storeToRefs(globalState)
const { useToken } = theme
const { token } = useToken()
const { isTablet, isMobile } = useDeviceType()

const isCollapsed = computed(() => {
  return isTablet.value ? true : collapsed.value
})
</script>

<template>
  <a-layout class="w-full h-full">
    <a-layout-sider
      v-if="!isMobile"
      v-model:collapsed="isCollapsed"
      class="mr-4 rounded-2xl"
      collapsible
      :trigger="null"
      theme="light"
      :width="240"
    >
      <Logo :collapsed="isCollapsed" />
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="rounded-2xl" :style="{ backgroundColor: token.colorBgElevated, padding: '0 20px' }">
        <Header />
      </a-layout-header>
      <div class="flex-1 rounded-2xl mt-4 py-4 overflow-hidden" :style="{ backgroundColor: token.colorBgElevated }">
        <div class="px-6 overflow-y-auto overflow-x-hidden w-full h-full">
          <Outlet />
        </div>
      </div>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="scss">
</style>
