import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'

import { getRefreshToken } from '@/api/user'
import router from '@/router'

import { antdUtils } from '@/utils/antUtils.ts'
import { Local } from '@/utils/storage.ts'
import { tokenNotifier } from '@/utils/tokenEvents.ts'
import ErrorHandler from './error'

const refreshTokenUrl = '/refreshToken'

interface MetaType {
  success: boolean
  message: string
}

// MetaType 取决于后端的返回规范
export type Response<T> = Promise<[boolean, T, MetaType]>
// export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>

class Request {
  private readonly instance: AxiosInstance
  private refreshTokenFlag = false
  private requestQueue: {
    resolve: any
    config: any
    type: 'request' | 'response'
  }[] = []

  private limit = 5

  private requestingCount = 0

  private flag = true

  constructor(config?: CreateAxiosDefaults) {
    this.instance = axios.create(config)

    // 所有实例的拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): Promise<any> => {
        const { token, refreshToken } = Local.get('globalState') || {}

        if (config.url?.startsWith(refreshTokenUrl)) {
          config.headers.Authorization = refreshToken
          return Promise.resolve(config)
        }

        if (this.refreshTokenFlag || this.requestingCount >= this.limit) {
          return new Promise((resolve) => {
            this.requestQueue.push({
              resolve,
              config,
              type: 'request',
            })
          })
        }

        this.requestingCount += 1

        // 为每个接口注入token
        if (token)
          config.headers.Authorization = token

        return Promise.resolve(config)
      },
      (err: any): Promise<any> => {
        antdUtils.message?.error(err.message)
        return Promise.reject(err)
      },
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse<any, any>): Promise<any> => {
        if (!res.config.url?.startsWith(refreshTokenUrl)) {
          this.requestingCount -= 1
          if (this.requestQueue.length)
            this.requestByQueue()
        }

        // 接口特殊 处理情况 接口200 但获取的 data 状态异常
        const { code, msg } = res.data.meta

        if ([403].includes(+code) && this.flag) {
          ErrorHandler.handleStatus(+code, msg)
          tokenNotifier.emitTokenUpdate('')
          router.replace('/')

          // 处理页面调用多个接口，报多个错误的问题，开关控制
          this.flag = false
        }
        return Promise.resolve([false, res.data, res])
      },
      (err: any): Promise<any> => {
        this.requestingCount -= 1
        const { status, config } = err?.response || {}

        if (status === 401) {
          // token 失效 退出登录或者刷新token
          return new Promise((resolve) => {
            this.requestQueue.unshift({
              resolve,
              config,
              type: 'response',
            })
            if (this.refreshTokenFlag)
              return

            this.refreshTokenFlag = true
            this.refreshToken()
          })
        }
        else {
          ErrorHandler.handleStatus(status)
        }
        return Promise.reject([true, err?.response])
      },
    )
  }

  private requestByQueue() {
    if (!this.requestQueue.length)
      return

    Array.from({ length: this.limit - this.requestingCount }).forEach(
      async () => {
        const record = this.requestQueue.shift()
        if (!record)
          return

        const { config, resolve, type } = record
        const { token } = Local.get('globalState') || {}

        if (type === 'response') {
          config.headers.Authorization = token
          resolve(await this.request(config))
        }
        else if (type === 'request') {
          this.requestingCount += 1

          config.headers.Authorization = token
          resolve(config)
        }
      },
    )
  }

  private async refreshToken() {
    const { refreshToken, userId } = Local.get('globalState')
    if (!refreshToken)
      this.toLoginPage()

    const [err, data] = await getRefreshToken(userId)

    if (err) {
      this.toLoginPage()
    }

    tokenNotifier.emitTokenUpdate(data.token)
    tokenNotifier.emitRefreshTokenUpdate (data.refreshToken)

    this.refreshTokenFlag = false

    this.requestByQueue()
  }

  private toLoginPage() {
    this.requestQueue = []
    this.refreshTokenFlag = false
    this.requestingCount = 0
  }

  request<T, D = any>(config: AxiosRequestConfig<D>): Response<T> {
    return this.instance(config)
  }

  get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.instance.get(url, config)
  }

  post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Response<T> {
    return this.instance.post(url, data, config)
  }

  delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.instance.delete(url, config)
  }

  put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Response<T> {
    return this.instance.put(url, data, config)
  }

  patch<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.instance.patch(url, data, config)
  }
}

export default Request
