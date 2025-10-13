<script setup lang="ts">
import { useDeviceType } from '@/hooks'
import { useGlobalState } from '@/store/globalState.ts'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

const Logo = defineAsyncComponent(() => import('@/layout/components/Logo.vue'))
const Menu = defineAsyncComponent(() => import('@/layout/components/menu/index.vue'))

const globalState = useGlobalState()
const { collapsed } = storeToRefs(globalState)

const { isDesktop } = useDeviceType()
const visible = ref(false)

function ontoggle() {
  if (isDesktop.value) {
    collapsed.value = !collapsed.value
  }
  else {
    visible.value = !visible.value
  }
}
</script>

<template>
  <a-button
    type="text"
    class="mr-4"
    @click="ontoggle"
  >
    <template v-if="!collapsed" #icon>
      <MenuFoldOutlined />
    </template>
    <template v-else #icon>
      <MenuUnfoldOutlined />
    </template>
  </a-button>

  <a-drawer
    v-model:open="visible" :width="250" placement="left" :closable="false" :footer="false" :render-to-body="false"
  >
    <Logo :collapsed="false" />
    <Menu class="menu w-full" @select="visible = false" />
  </a-drawer>
</template>

<style scoped>

</style>
