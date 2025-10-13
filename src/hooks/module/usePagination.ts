import { reactive, ref, toRefs, watch } from 'vue'
import { useDeviceType } from '@/hooks'

type Callback = () => void

interface Options {
  defaultPageSize: number
}

function usePagination(callback: Callback, options: Options = { defaultPageSize: 10 }) {
  // 手动控制change的触发，防止调用两次接口
  const sizeChangeFlag = ref(false)

  const { isMobile } = useDeviceType()

  const pagination = reactive({
    showPageSize: true,
    simple: isMobile,
    current: 1,
    pageSize: options.defaultPageSize,
    total: 0,
    pageSizeOptions: ['10', '20'],
    showTotal: (total: number) => `共 ${total} 条数据`,
    onChange: (size: number) => {
      if (!sizeChangeFlag.value) {
        pagination.current = size
        callback && callback()
      }
      sizeChangeFlag.value = false
    },
    onShowSizeChange: (_: number, size: number) => {
      sizeChangeFlag.value = true
      pagination.current = 1
      pagination.pageSize = size
      callback && callback()
    },
  })

  const changeCurrent = pagination.onChange
  const changePageSize = pagination.onShowSizeChange

  const setTotal = (value: number) => {
    pagination.total = value
  }

  const { current, pageSize, total } = toRefs(pagination)

  // 切换pageSize时，重置到第一页
  watch(pageSize, (newVal, oldVal) => {
    if (newVal !== oldVal)
      pagination.current = 1
  })

  return {
    current,
    pageSize,
    total,
    pagination,
    changeCurrent,
    changePageSize,
    setTotal,
  }
}

export default usePagination
