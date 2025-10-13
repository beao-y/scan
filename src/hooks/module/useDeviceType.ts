import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

/**
 * 设备类型
 * 大屏（>=1200px）
 * 中屏（>=992px）
 * 小屏（>=768px）
 */
function useDeviceType() {
  const { width } = useWindowSize()
  const isDesktop = computed(() => width.value > 1200)
  const isTablet = computed(() => width.value > 768 && width.value <= 1200)
  const isMobile = computed(() => width.value <= 768)

  return { isMobile, isDesktop, isTablet }
}

export default useDeviceType
