import type { App } from 'vue'

import ProEditTable from '@/components/proEditTable/index.vue'

import ProModal from '@/components/proModal/index.vue'
import ProTable from '@/components/proTable/index.vue'
import SvgIcon from '@/components/svgIcon/index.vue'
import Upload from '@/components/upload/index.vue'

export default function (app: App) {
  app.component('SvgIcon', SvgIcon)
  app.component('ProModal', ProModal)
  app.component('ProTable', ProTable)
  app.component('ProEditTable', ProEditTable)
  app.component('Upload', Upload)
}
