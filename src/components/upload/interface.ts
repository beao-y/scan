import type { UploadFile } from 'ant-design-vue'

type ImageType = 'jpeg' | 'png' | 'gif' | 'webp' | 'svg+xml' | 'bmp' | 'tiff' | 'x-icon'

export interface UploadFileType {
  name?: string // 发到后台的文件参数名
  fileList?: UploadFile[] | string
  disabled?: boolean // 是否禁用
  fileSize?: number // 图片大小限制
  fileType?: ImageType[]
  height?: string
  width?: string
  borderRadius?: string // 组件边框圆角
  multiple?: boolean
  limit?: number
}
