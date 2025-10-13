<script setup lang="ts">
import { theme } from 'ant-design-vue'
import { generateThemeVariables } from '@/utils/common.ts'

defineOptions({ name: 'Application' })

const { css } = useStyleTag('')
const { token } = theme.useToken()

watchImmediate(token, token => css.value = generateThemeVariables(token, 'ant'))
</script>

<template>
  <slot />
</template>
