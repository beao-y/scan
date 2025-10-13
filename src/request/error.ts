import { antdUtils } from '@/utils/antUtils'

class ErrorHandler {
  private static errorLock = false
  private static debounceTimer: NodeJS.Timeout | null = null
  private static lastErrorTime = 0

  // 状态码映射表
  private static statusMessages: Record<number, string> = {
    400: '错误的请求',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求错误，未找到该资源',
    405: '请求方法未允许',
    408: '请求超时',
    500: '服务器端出错',
    501: '网络未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时',
    505: 'HTTP版本不支持该请求',
  }

  /**
   * 处理响应状态
   * @param status HTTP状态码
   * @param msg 自定义错误消息
   * @param showSuccess 是否显示成功提示
   * @param immediate 是否立即显示（跳过防抖）
   */
  static handleStatus(
    status: number,
    msg?: string,
      showSuccess: boolean = false,
      immediate: boolean = false,
  ) {
    // 成功状态处理
    if (status >= 200 && status < 300) {
      if (showSuccess) {
        antdUtils.message?.success(msg || '操作成功')
      }
      return
    }

    // 特殊状态码立即处理（如401未授权）
    if (status === 401) {
      antdUtils.message?.error(msg || this.statusMessages[401])
      return
    }

    // 错误锁定和防抖处理
    if (this.errorLock && !immediate)
      return

    // 准备错误消息
    const errMessage = msg || (this.statusMessages[status]
      ? this.statusMessages[status]
      : status
        ? `其他连接错误 --${status}`
        : '无法连接到服务器！')

    // 立即显示或防抖处理
    if (immediate) {
      this.showError(errMessage)
    }
    else {
      this.debounceError(errMessage)
    }
  }

  private static showError(message: string) {
    this.errorLock = true
    this.lastErrorTime = Date.now()

    // 显示错误
    antdUtils.message?.error(message)

    // 3秒后解锁
    setTimeout(() => {
      this.errorLock = false
    }, 3000)
  }

  private static debounceError(message: string, delay: number = 500) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      // 检查距离上次错误时间
      if (Date.now() - this.lastErrorTime > 3000) {
        this.showError(message)
      }
      this.debounceTimer = null
    }, delay)
  }
}

export default ErrorHandler
