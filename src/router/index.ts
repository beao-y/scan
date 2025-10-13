import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { dynamicRoutes, setAddRoute, staticRoutes } from '@/router/route.ts'

import { Local, Session } from '@/utils/storage'
import 'nprogress/nprogress.css'

const router = createRouter({
  routes: [...dynamicRoutes, ...staticRoutes],
  history: createWebHistory(import.meta.env.VITE_APP_ROUTER),
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/** 免登录白名单 */
const whiteList = ['/login']

/** 是否已经生成过路由表 */
let hasRoute = false
export function resetHasRoute() {
  hasRoute = false
}

// 路由加载前
router.beforeEach(async (to) => {
  NProgress.configure({ showSpinner: false })
  NProgress.start()

  // 动态设置标题
  const title = import.meta.env.VITE_APP_TITLE
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  const { token } = Local.get('globalState') || {}

  if (!token) {
    Session.clear()
    NProgress.done()
    // 如果没有 Token
    if (whiteList.includes(to.path)) {
      // 如果在免登录的白名单中，则直接进入
      return true
    }
    else {
      // 其他没有访问权限的页面将被重定向到登录页面
      return `/login?redirect=${to.path}&params=${JSON.stringify(
        to.query ? to.query : to.params,
      )}`
    }
  }
  // 没有 token
  else {
    if (!hasRoute) {
      // routeList不需要添加缓存， 防止刷新404
      // 动态添加路由
      await setAddRoute()
      hasRoute = true
      return { path: to.path, query: to.query }
    }
    else {
      return true
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

export default router
