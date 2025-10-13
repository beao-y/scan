import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router/index.ts'
import pinia from '@/store'
import { useGlobalState } from '@/store/globalState.ts'
import NotFound from '@/views/error/404.vue'

// 处理组件名字
export function handleComponentName(path: string) {
  return path.split('/')
    .filter(Boolean)
    .map(segment =>
      segment.split('-')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(''),
    )
    .join('')
}

// 1. 定义模块类型
type AsyncComponentModule = () => Promise<{
  default: Component & { name?: string }
}>

// 2. 定义组件集合类型
type ComponentsMap = Record<string, AsyncComponentModule>

// 3. 获取模块（带正确类型断言）
export const modules: Record<string, AsyncComponentModule>
    = import.meta.glob('@/views/**/index.vue') as Record<string, AsyncComponentModule>

// 4. 生成组件映射（完全类型安全）
export const components: ComponentsMap = Object.keys(modules).reduce<ComponentsMap>(
  (prev, cur) => {
    const path = cur.replace('/src/views', '').replace('/index.vue', '')

    prev[path] = (async () => {
      const module = await modules[cur]()

      // 类型守卫
      if (!module?.default)
        return module

      // 生成组件名（如 /system/user → SystemUser）
      const componentName = handleComponentName(path)

      // 安全注入name
      if (!module.default.name) {
        module.default.name = componentName || `Dynamic${path.replace(/\//g, '_')}`
      }

      return module
    }) as AsyncComponentModule

    return prev
  },
  {},
)

export async function setAddRoute() {
  const globalState = useGlobalState(pinia)
  // 通过接口拿到的权限路由

  const asyncRoutes = globalState.permissions.map((item: any) => ({
    path: item.path,
    name: item.name,
    redirect: item.redirect,
    component: components[item.path],
  }))

  asyncRoutes.forEach((v: RouteRecordRaw) => {
    router.addRoute(v)
  })
}

export const dynamicRoutes: Array<RouteRecordRaw> = [
  { path: '/:pathMatch(.*)', component: NotFound },
  { path: '/', redirect: '/home' },
]

export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
]
