import { request } from '@/request'

// 用户登录
export function loginFn(params: EmptyObjectType) {
  return request.put<any>('/user/login', null, { params })
}

// 用户列表
export function getUserList(params: EmptyObjectType) {
  return request.get<PageRes<any>>('/user', { params })
}
