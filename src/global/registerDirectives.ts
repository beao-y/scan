import type { App, Directive } from 'vue'

import permission from '@/directives/permission'

const directivesList: { [key: string]: Directive } = {
  permission,
}

export default function (app: App) {
  Object.keys(directivesList).forEach((key) => {
    app.directive(key, directivesList[key])
  })
}
