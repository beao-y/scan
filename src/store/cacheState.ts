import { defineStore } from 'pinia'
import { STORAGE_KEY } from '@/enums/cacheEnum.ts'

/**
 * 缓存路由列表
 */

export const useCacheState = defineStore('cacheState', () => {
  const cacheRouteList = ref<string[]>([])

  function setCacheRouteList(payload: string[]) {
    cacheRouteList.value = payload
  }

  return {
    cacheRouteList,
    setCacheRouteList,
  }
}, {
  persist: {
    key: `${`${STORAGE_KEY}cacheState`}`,
    storage: localStorage,
  },
})
