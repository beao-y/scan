import type { App } from 'vue'
import registerComponents from './registerComponents'
import registerDirectives from './registerDirectives.ts'

export function globalRegister(app: App) {
  app.use(registerComponents)
  app.use(registerDirectives)
}
