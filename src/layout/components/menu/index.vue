<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue'
import type { VueElement } from 'vue'
import { useGlobalState } from '@/store/globalState.ts'
import { buildRouteTree } from '@/utils/common.ts'
import * as Icon from '@ant-design/icons-vue'
import { h, onMounted, reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const antIcon: { [key: string]: any } = Icon

const router = useRouter()
const route = useRoute()

interface MenuItem {
  label: VueElement | string
  key: string
  icon?: any
  children?: MenuItem[]
  type?: 'group'
}

const selectedKeys = ref<string[]>(['/home'])

const menuList = reactive({
  items: [] as MenuItem[],
})

const { permissions } = useGlobalState()

// 处理成antMenu所需要的格式
function setMenu(list: IRouteType[]): MenuItem[] {
  return list
    .filter((item: IRouteType) => item.hide !== 1) // 过滤掉 hide === 1 的项
    .map((item: IRouteType) => {
      return {
        key: item.path,
        icon: item.icon ? h(antIcon[item.icon.split('-')[1]]) : null,
        label: item.name,
        children: item.children ? setMenu(item.children) : undefined, // 递归处理子菜单
      } as unknown as MenuItem
    })
}

const handleMenu: MenuProps['onClick'] = (e) => {
  router.push(e.key as string)
}

watchEffect(() => {
  const { path } = route
  selectedKeys.value = [path]
})

onMounted(() => {
  menuList.items = setMenu(buildRouteTree(permissions))
})
</script>

<template>
  <a-menu
    v-model:selected-keys="selectedKeys"
    theme="light"
    mode="inline"
    :items="menuList.items"
    @click="handleMenu"
  />
</template>

<style scoped lang="scss">
.ant-menu-inline{
  border-inline-end: none !important;
}
</style>
