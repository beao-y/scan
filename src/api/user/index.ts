import type * as T from './type.ts'
import { request } from '@/request'

// 用户登录
export function userLogin(params: EmptyObjectType) {
  return request.put<T.Login>('/user/login', null, { params })
}

// 重置密码
export function resetPwd(data: EmptyObjectType) {
  return request.put(`/user/resetPassword/${data.id}`, data)
}

// 更新密码
export function updatePwd(data: EmptyObjectType) {
  return request.put('/user/update-password', data)
}

// 创建新用户
export function createUser(data: EmptyObjectType) {
  return request.post('/user/add', data)
}

// 禁用用户
export function disabledUser(id: number) {
  return request.put<any>(`/user/disable/${id}`)
}

// 启用用户
export function enableUser(id: number) {
  return request.put<any>(`/user/enable/${id}`)
}

// 更新用户
export function updateUser(data: EmptyObjectType) {
  return request.put(`/user/update/${data.id}`, data)
}

// 用户列表
export function queryUser(params: EmptyObjectType) {
  return request.get<PageRes<any>>('/user/query', { params })
}

// 重置密码
export function resetPassword(id: number) {
  return request.put(`/user/reset-password/${id}`)
}

// 获取部门数据
export function queryDepartment() {
  return request.get<EmptyArrayType>(`/user/department/`)
}

// 获取refreshToken
export function getRefreshToken(userId: number) {
  return request.get<T.RefreshToken>('/user/refresh-token', { params: { userId } })
}
