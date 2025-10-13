<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ModalConfig } from './interface.ts'
import { useDraggable } from '@vueuse/core'
import { computed, ref, watch, watchEffect } from 'vue'

interface PropsType {
  modalConfig: ModalConfig
  cancelClosable?: boolean
  showFooter?: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  modalConfig: () => ({
    open: false,
  }),
  cancelClosable: true,
  showFooter: true,
})

const emit = defineEmits(['update:open', 'submit', 'cancel'])

// 更简单的用法
// const open = defineModel('open')

const open = computed({
  get() {
    return props.modalConfig.open
  },
  set(value) {
    emit('update:open', value)
  },
})

const modalTitleRef = ref()
const { x, y, isDragging } = useDraggable(modalTitleRef)

const startX = ref<number>(0)
const startY = ref<number>(0)
const startedDrag = ref(false)
const transformX = ref(0)
const transformY = ref(0)
const preTransformX = ref(0)
const preTransformY = ref(0)
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 })
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value
    startY.value = y.value
    const bodyRect = document.body.getBoundingClientRect()
    const titleRect = modalTitleRef.value.getBoundingClientRect()
    dragRect.value.right = bodyRect.width - titleRect.width
    dragRect.value.bottom = bodyRect.height - titleRect.height
    preTransformX.value = transformX.value
    preTransformY.value = transformY.value
  }
  startedDrag.value = true
})

watch(isDragging, () => {
  if (!isDragging)
    startedDrag.value = false
})

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value
        = preTransformX.value
        + Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right)
        - startX.value
    transformY.value
        = preTransformY.value
        + Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom)
        - startY.value
  }
})
const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  }
})
</script>

<template>
  <a-modal
    v-bind="$attrs"
    v-model:open="open"
    :mask-closable="false"
    :width="modalConfig.width ?? 600"
    :confirm-loading="modalConfig.loading"
    :ok-text="modalConfig.okText ?? '确定'"
    :cancel-text="modalConfig.cancelText ?? '取消'"
    :cancel-button-props="{ style: props.cancelClosable ? {} : { display: 'none' } }"
    centered
    @ok="() => emit('submit')"
    @cancel="() => emit('cancel')"
  >
    <template #title>
      <div
        ref="modalTitleRef"
        style="width: 100%"
        :style="{ cursor: $attrs.draggable === 0 ? 'move' : '' }"
      >
        {{ modalConfig.title }}
      </div>
    </template>
    <template v-if="$attrs.draggable === 0" #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <div class="modal-ctn">
      <slot />
    </div>

    <template v-if="!props.showFooter" #footer>
      <slot name="footer" />
    </template>
  </a-modal>
</template>

<style scoped lang="scss">
.modal-ctn{
  max-height: 70vh;
}
</style>
