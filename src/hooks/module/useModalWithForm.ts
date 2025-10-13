import type { ComputedRef, Ref } from 'vue'
import type { ModalConfig } from '@/components/proModal/interface.ts'
import type { Response } from '@/request/request.ts'
import { reactive, watchEffect } from 'vue'
import { antdUtils } from '@/utils/antUtils.ts'

type Api<T, U> = (params: T) => Response<U>

function useModalWithForm<T = any, U = any>(modalConfig: ModalConfig, formRef?: Ref<HTMLElement | null>, api?: Api<T, U> | ComputedRef<Api<T, U>>) {
  const cloneFormRef = ref()
  const config = reactive(modalConfig)

  // 类型保护函数，用于判断 api 是否是 ComputedRef
  function isComputedRef<T>(value: Api<T, any> | ComputedRef<Api<T, any>>): value is ComputedRef<Api<T, any>> {
    return typeof (value as ComputedRef<Api<T, any>>).value !== 'undefined'
  }

  const submit = async (state: T) => {
    try {
      await cloneFormRef.value.validates()
      config.loading = true

      if (!api)
        return false

      // 判断 api 是 ComputedRef 还是普通的 Api
      const apiFn = isComputedRef(api) ? api.value : api // 如果是 ComputedRef，取 api.value

      const [err, _, meta] = await apiFn({ ...state })

      if (err)
        return false

      if (meta.success) {
        // 如果操作成功
        antdUtils.message?.success('操作成功')
        config.open = false
        return true // 返回 true
      }
      else {
        // 如果操作失败
        antdUtils.message?.error(meta.message)
        return false // 返回 false
      }
    }
    catch (err: any) {
      antdUtils.message?.error(err[1].statusText)
      return false // 返回 false
    }
    finally {
      config.loading = false
    }
  }

  watchEffect(() => {
    if (config.open && formRef?.value)
      cloneFormRef.value = formRef.value
  })

  watchEffect(() => {
    if (!config.open)
      nextTick(() => {}).then(() => cloneFormRef.value?.clearFields())
  })

  return { config, submit }
}

export default useModalWithForm
