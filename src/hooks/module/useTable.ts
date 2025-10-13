import type { Response } from '@/request/request.ts'
import type { Ref } from 'vue'
import { usePagination } from '@/hooks'
import { antdUtils } from '@/utils/antUtils.ts'
import { ref } from 'vue'

interface Options<T> {
  formatResult?: (data: T[]) => any
  onSuccess?: () => void
  immediate?: boolean
  rowKey?: keyof T
}

interface PaginationParams {
  page: number
  size: number
}
type Api<T> = (params: PaginationParams) => Response<PageRes<T[]>>

function useTable<T>(api?: Api<T>, options?: Options<T>) {
  const { formatResult, onSuccess, immediate, rowKey } = options || {}
  const { pagination, setTotal } = usePagination(() => getTableData())
  const loading = ref(false)
  const tableData = ref<T[]>([]) as Ref<T[]>

  const getTableData = async () => {
    if (!api)
      return
    try {
      loading.value = true
      const [err, res] = await api({
        page: pagination.current,
        size: pagination.pageSize,
      })
      if (err)
        return
      tableData.value = formatResult ? formatResult(res.data) : res.data ?? []

      setTotal(res.total)
      onSuccess && onSuccess()
    }
    finally {
      loading.value = false
    }
  }

  // 是否立即出发
  const isImmediate = immediate ?? true
  isImmediate && getTableData()

  // 多选
  const selectedRowKeys = ref<(string | number)[]>([])
  const onChange = (rowKeys: (string | number)[]) => {
    selectedRowKeys.value = rowKeys
  }

  // 搜索
  const search = () => {
    selectedRowKeys.value = []
    pagination.onChange(1)
  }

  // 全选
  const onSelectAll = (checked: T) => {
    const key = rowKey ?? ('id' as keyof T)
    const arr = tableData.value.filter(
      i => !(i['disabled' as keyof T] ?? false),
    )
    selectedRowKeys.value = checked
      ? arr.map(i => i[key] as string | number)
      : []
  }

  // 删除
  const handleDelete = async <T>(
    deleteApi: () => Response<T>,
    options?: {
      title?: string
      content?: string
      successTip?: string
      showModal?: boolean
    },
  ): Promise<boolean | undefined> => {
    const onDelete = async () => {
      try {
        const [err, _, res] = await deleteApi()
        if (err)
          return
        if (res.status === 200) {
          antdUtils.message?.success(options?.successTip || '删除成功！')
          selectedRowKeys.value = []
          await getTableData()
        }
        return true
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return false
      }
    }

    return onDelete()
  }

  return {
    loading,
    tableData,
    getTableData,
    search,
    pagination,
    selectedRowKeys,
    onChange,
    onSelectAll,
    handleDelete,
  }
}

export default useTable
