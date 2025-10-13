import type { Response } from '@/request/request.ts'
import _ from 'lodash-es'
import { useLoading } from '@/hooks'
import { antdUtils } from '@/utils/antUtils.ts'

function useForm<T extends object, U = any>(initValue: T, api?: (params: T) => Response<U>) {
  const getInitValue = () => _.cloneDeep(initValue)

  const formState = ref(getInitValue())

  const { loading, setLoading } = useLoading(false)

  const submit = (state: T) => {
    setLoading(true)

    // 模拟提交, 传入接口函数
    api?.({ ...state })
      .then(() => {
        antdUtils.message?.success('操作成功')
      })
      .catch(() => {
        // 错误处理
        antdUtils.message?.error('操作失败')
      })
      .finally(() => {
        setLoading(false)
      })

    // 模拟延时，实际开发需删除
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  /**
   * 重置表单数据到初始值
   */
  const resetForm = () => {
    formState.value = getInitValue()
  }

  return { formState, loading, submit, resetForm }
}

export default useForm
