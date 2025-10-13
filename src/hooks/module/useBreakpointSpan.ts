import type { FormConfig } from '@/components/formBuilder/interface.ts'

import { computed, type ComputedRef, type Ref, watch } from 'vue'
import { useBreakpoint } from '@/hooks'

// type FormCollapseConfig = NonNullable<FormConfig['collapse']> // 移除undefined可能性
type FormCollapseConfig = Partial<FormConfig['collapse']>

interface BreakpointMap {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

function useBreakpointSpan(
  formConfig: Ref<FormCollapseConfig> | ComputedRef<FormCollapseConfig>,
  callback: (count: number) => void,
  customBreakpointMap?: BreakpointMap,
) {
  const { breakpoint } = useBreakpoint()

  // 默认断点映射
  const defaultBreakpointMap: BreakpointMap = {
    xs: 0, // 超小屏幕
    sm: 1, // 小屏幕
    md: 1, // 中等屏幕
    lg: 2, // 大屏幕
    xl: 2,
    xxl: 3,
  }

  if (!formConfig.value)
    return

  const breakpointMap = customBreakpointMap || defaultBreakpointMap

  // 不能响应式获取index，页面中会动态改变，只需要拿到初始的值默认就行
  const _index = formConfig.value.index || Infinity

  // 计算应该显示的数量
  const shouldShowCount = computed(() => {
    if (!formConfig.value?.enable)
      return Infinity
    if (formConfig.value?.index === undefined)
      return Infinity

    const breakpointLimit = breakpointMap[breakpoint.value]
    return Math.min(
      breakpointLimit,
      _index,
    )
  })

  // 监听变化并回调
  watch(
    [() => breakpoint.value, () => formConfig.value],
    () => {
      callback(shouldShowCount.value)
    },
    { immediate: true, deep: true },
  )
}

export default useBreakpointSpan
