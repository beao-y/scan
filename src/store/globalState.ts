import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginFn } from '@/api'
import { STORAGE_KEY } from '@/enums/cacheEnum.ts'
import { resetHasRoute } from '@/router'
import { tokenNotifier } from '@/utils/tokenEvents.ts'

export const useGlobalState = defineStore('globalState', () => {
  const collapsed = ref(false)
  const token = ref('') // token
  const refreshToken = ref('') // 刷新token

  const permissions = ref<IRouteType[]>([]) // 当前角色权限标识集合
  const functions = ref<EmptyArrayType>([])

  const login = async (params) => {
    const [err, res] = await loginFn(params)
    if (err)
      return

    setToken(res.data.token)
    setRefreshToken(res.data.refreshToken)
  }

  // 退出
  const logout = () => {
    // 退出的接口
    setToken('')
    setFunctions([])
    setPermissions([])
    // 路由表重置
    resetHasRoute()
  }

  function setToken(payload: string) {
    token.value = payload
  }
  function setRefreshToken(payload: string) {
    refreshToken.value = payload
  }

  function setPermissions(payload: IRouteType[]) {
    permissions.value = payload
  }

  function setFunctions(payload: any[]) {
    functions.value = payload
  }

  function initTokenListener() {
    // 监听 Token 更新事件
    tokenNotifier.onTokenUpdate((newToken) => {
      token.value = newToken
    })
    // 监听 reFreshToken 更新事件
    tokenNotifier.onTokenUpdate((newRefreshToken) => {
      refreshToken.value = newRefreshToken
    })
  }

  return {
    collapsed,
    token,

    refreshToken,

    permissions,
    functions,
    setToken,
    setRefreshToken,

    setPermissions,
    setFunctions,
    login,
    logout,
    initTokenListener,
  }
}, {
  persist: {
    key: `${`${STORAGE_KEY}globalState`}`,
    storage: localStorage,
  },
})
