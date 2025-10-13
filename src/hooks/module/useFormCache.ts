import { onActivated, onMounted, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { Local } from '../../utils/storage.ts'

/**
 * 表单缓存Hook选项
 */
interface UseFormCacheOptions {
  /**
   * 自定义缓存键名（避免不同页面同名表单冲突）
   */
  customKey?: string
  /**
   * 缓存过期时间（小时）
   * @default 24
   */
  expireHours?: number
  /**
   * 是否在组件激活时自动恢复表单
   * @default true
   */
  autoRestore?: boolean
  /**
   * 是否在组件失活时自动保存表单
   * @default true
   */
  autoSave?: boolean
}

/**
 * 表单缓存Hook返回值
 */
interface UseFormCacheReturn<T extends object> {
  /**
   * 手动恢复表单数据
   */
  restoreForm: () => void
  /**
   * 手动保存表单数据
   */
  saveForm: () => void
  /**
   * 清空当前表单缓存
   */
  clearFormCache: () => void
  /**
   * 获取缓存数据
   */
  getFormCache: () => FormCacheType<T> | undefined
}

interface FormCacheType<T> {
  data: T
  timestamp: number
}

/**
 * 表单缓存Hook
 * @param formRef 表单ref对象
 * @param options 配置选项
 */
export default function useFormCache<T extends object>(
  formRef: Ref<T>,
  options?: UseFormCacheOptions,
): UseFormCacheReturn<T> {
  const route = useRoute()

  const {
    customKey = '',
    expireHours = 24,
    autoRestore = true,
    autoSave = true,
  } = options || {}

  // 生成缓存key：route.path + customKey
  const storageKey = `${route.path}${customKey ? `${customKey}` : ''}`

  /**
   * 获取缓存数据
   */
  const getFormCache = () => {
    return Local.get(storageKey) as FormCacheType<T>
  }

  /**
   * 恢复表单数据
   */
  const restoreForm = () => {
    const cached = getFormCache()

    if (!cached)
      return

    try {
      const { data, timestamp } = cached
      if (Date.now() - timestamp < expireHours * 3600 * 1000) {
        Object.assign(formRef.value, data)
      }
      clearFormCache()
    }
    catch (e) {
      console.warn('缓存解析失败', e)
      clearFormCache()
    }
  }

  /**
   * 保存表单数据
   */
  const saveForm = () => {
    try {
      const cacheData = {
        data: formRef.value,
        timestamp: Date.now(),
      }
      Local.set<FormCacheType<T>>(storageKey, cacheData)
    }
    catch (e) {
      console.warn('[useFormCache] 表单缓存保存失败', e)
    }
  }

  /**
   * 清空当前表单缓存
   */
  const clearFormCache = () => {
    Local.remove(storageKey)
  }

  // 自动注册生命周期
  if (autoRestore) {
    onMounted(() => {
      restoreForm()
    })
    onActivated(() => {
      formRef.value = getFormCache()?.data ?? {}
    })
  }
  if (autoSave) {
    // 在路由离开前也保存一次
    onBeforeRouteLeave(() => {
      saveForm()
    })
  }

  return {
    restoreForm,
    saveForm,
    clearFormCache,
    getFormCache,
  }
}
