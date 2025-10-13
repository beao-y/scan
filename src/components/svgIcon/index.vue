<script setup lang="ts">
import * as Icon from '@ant-design/icons-vue'
import { computed, h } from 'vue'

const props = defineProps({
  // 显示的 svg 图标名称（剔除 icon-）
  name: {
    type: String,
    required: true,
  },
  // 直接指定 svg 图标的颜色
  color: {
    type: String,
  },
})

const antIcon: { [key: string]: any } = Icon

// 真实显示的 svg 图标名（拼接 #icon-）
const symbolId = computed(() => `#icon-${props.name}`)

// 用于判断 uno 引入 svg 图标的显示、隐藏
const isIconify = computed(() => {
  return props?.name?.startsWith('i-')
})

// 用于判断 ant deign 自带 svg 图标的显示、隐藏
const isAntIcon = computed(() => {
  return props?.name?.startsWith('ant-')
})

// 用于区分是 ant 的图标，传入时添加 ant- 前缀
const getIconName = computed(() => {
  return props?.name?.split('-')[1]
})
</script>

<template>
  <component :is="h(antIcon[getIconName])" v-if="isAntIcon" class="svg-icon" :style="{ color }" />

  <div v-else-if="isIconify" :class="name" class="svg-icon" :style="{ color }" />

  <svg v-else aria-hidden="true" class="svg-icon" :icon="name" viewBox="0 0 24 24">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  line-height: 1;
  vertical-align: -0.15em;
  fill: currentcolor;
  overflow: hidden;
}
</style>
