import { theme } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEY } from '../enums/cacheEnum.ts'

export const useThemeStore = defineStore(
  'themeState',
  () => {
    const themeColor = ref('#1677ff') // 主题色
    const darkMode = ref('light') // 颜色模式
    const clientHeight = ref(0) // 屏幕高度
    const isFullScreen = ref(false) // 全屏
    const darkModeComp = computed(() => {
      document.documentElement.setAttribute('data-dark', darkMode.value)
      return darkMode.value
    })
    const themeConfig = computed(() => {
      document.documentElement.setAttribute('data-theme', darkMode.value)
      // 主题配置
      return {
        token: {
          colorPrimary: themeColor.value || '#1677ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: themeColor.value || '#1677ff',
          wireframe: true,
        },
        algorithm: darkMode.value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }
    })

    const toggleDarkMode = () => {
      if (darkMode.value === 'light') {
        darkMode.value = 'dark'
        document.documentElement.classList.add('dark')
      }
      else {
        darkMode.value = 'light'
        document.documentElement.classList.remove('dark')
      }
    }
    return { themeConfig, darkMode, themeColor, isFullScreen, darkModeComp, clientHeight, toggleDarkMode }
  },
  {
    persist: {
      key: `${`${STORAGE_KEY}themeState`}`,
      storage: localStorage,
    },
  },
)
