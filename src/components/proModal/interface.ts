export interface ModalConfig {
  open: boolean
  loading?: boolean
  width?: string | number
  title?: string
  okText?: string
  cancelText?: string
}

export interface IModalProps {
  open: boolean
  rowState?: any
  type?: string
}
