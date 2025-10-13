import type { MessageInstance } from 'ant-design-vue/es/message/interface'
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm'
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface'

type ModalInstance = Omit<ModalStaticFunctions, 'warn'>

class AntdUtils {
  message: MessageInstance | null = null
  notification: NotificationInstance | null = null
  modal: ModalInstance | null = null

  setMessageInstance(message: MessageInstance) {
    this.message = message
  }

  setNotificationInstance(notification: NotificationInstance) {
    this.notification = notification
  }

  setModalInstance(modal: ModalInstance) {
    this.modal = modal
  }
}

export const antdUtils = new AntdUtils()
