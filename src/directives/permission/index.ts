import type { Directive, DirectiveBinding } from 'vue'
import { useGlobalState } from '../../store/globalState.ts'

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { functions } = useGlobalState()

    const hasPermission = functions.some((v) => {
      if (Array.isArray(binding.value)) {
        return binding.value.includes(v.identifier)
      }
      else {
        return v.identifier === binding.value
      }
    })
    if (!hasPermission) {
      el?.parentNode?.removeChild(el)
    }
  },
}

export default permission
