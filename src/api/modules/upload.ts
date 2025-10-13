import { request } from '@/request'

// 删除文件
export function deleteFile(data: EmptyObjectType) {
  return request.delete(`/file/delete`, { data })
}
