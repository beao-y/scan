<script setup lang="ts">
import type { TableState } from './interface.ts'
import {
  CompressOutlined,
  ExpandOutlined,
  ReloadOutlined,
  TableOutlined,
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { h, ref, useAttrs } from 'vue'
import { useThemeStore } from '@/store/themeState.ts'

const props = withDefaults(defineProps<TableState>(), {
  control: false,
  scrollHeight: 0,
  showExpand: false,
})

const emit = defineEmits(['refresh'])

const attrs = useAttrs()

const { isFullScreen } = storeToRefs(useThemeStore())

const tableRef = ref()
const tableCtnRef = ref()

// 获取工具栏目的高度
const toolRef = ref()
const { height } = useElementSize(toolRef)

const scrollHeight = computed(() => {
  return props.scrollHeight - height.value
})

const stripe = ref(false)
const size = ref('small')
const isBordered = ref(true)

function refresh() {
  emit('refresh')
}

defineExpose({ tableRef })
</script>

<template>
  <div class="pro-table" :class="{ fullscreen: isFullScreen }">
    <a-row ref="toolRef" justify="space-between">
      <a-col class="mb-4">
        <slot name="custom-extra" />
      </a-col>
      <a-col v-if="control" class="mb-4">
        <a-space wrap align="center">
          <a-tooltip title="斑马纹">
            <a-switch v-model:checked="stripe" size="small" type="round" />
          </a-tooltip>
          <a-tooltip title="刷新">
            <a-button type="text" :icon="h(ReloadOutlined)" @click="refresh" />
          </a-tooltip>
          <a-tooltip title="全屏">
            <a-button type="text" @click="isFullScreen = !isFullScreen">
              <template #icon>
                <ExpandOutlined v-if="!isFullScreen" />
                <CompressOutlined v-else />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="显示边框">
            <a-button
              type="text"
              :icon="h(TableOutlined)"
              @click="isBordered = !isBordered"
            />
          </a-tooltip>
        </a-space>
      </a-col>
    </a-row>
    <div ref="tableCtnRef" class="table-ctn">
      <a-table
        v-bind="attrs"
        ref="tableRef"
        :size="size"
        :bordered="isBordered"
        :scroll="{ y: scrollHeight }"
        row-key="id"
        class="ant-table-striped "
        :row-class-name="
          (_record: any, index: number) =>
            index % 2 === 1 && stripe ? 'table-striped' : null
        "
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.type === 'custom'">
            <slot :name="column.key" :column="column" :record="record" />
          </template>
        </template>

        <!-- 设置展开列的插槽 -->
        <template v-if="showExpand" #expandedRowRender="{ record }">
          <slot name="expandedRowRender" :record="record" />
        </template>
        <template #expandColumnTitle>
          <slot name="expandColumnTitle" />
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pro-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.fullscreen {
    padding: var(--padding);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: var(--ant-color-bg-elevated);
    z-index: 1001;
  }
  .table-ctn {
    flex: 1;
    overflow: hidden;
  }
}

.ant-table-striped :deep(.table-striped) td {
  background-color: var(--ant-color-bg-layout) ;
}

:deep(.ant-space-item) {
  display: flex;
}

:deep(::-webkit-scrollbar-track)  {
  background-color: var(--ant-color-fill-quaternary) !important;
  border-right: 1px solid var(--ant-color-fill-secondary) !important;
}

:deep(.ant-space) {
  margin-bottom: 0 !important;
}

:deep(.ant-table-pagination.ant-pagination){
  margin: 16px 0 0 !important;
}
</style>
