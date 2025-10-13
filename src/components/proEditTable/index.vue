<script lang='ts' setup>
import type { ColumnType } from '@/components/proEditTable/interface.ts'
import type { TableState } from './interface.ts'
import { antdUtils } from '@/utils/antUtils.ts'
import { computed, ref, useAttrs } from 'vue'

const props = withDefaults(defineProps<TableState>(), {
  disabledCell: true,
})

const AntFormType = [
  'input',
  'input-password',
  'input-number',
  'textarea',
  'select',
  'slider',
  'radio',
  'checkbox',
  'switch',
  'cascader',
  'tree-select',
  'date-picker',
  'range-picker',
  'time-picker',
  'time-range-picker',
]

const formRef = ref()
const attrs = useAttrs()

const form = computed(() => ({ tableData: props.dataSource }))

function resetFields() {
  formRef.value.resetFields()
}

function validate() {
  return new Promise((resolve) => {
    formRef.value.validate()
      .then((value) => {
        resolve(value)
      })
      .catch((error) => {
        antdUtils.message?.warning(error.errorFields[0].errors[0])
      })
  })
}

function clearValidate() {
  formRef.value.clearValidate()
}

// 处理验证信息
function formatMessage(column: ColumnType) {
  if (['input', 'input-number'].includes(column.type ?? '')) {
    return `请输入${column.title}`
  }
  if (['textarea'].includes(column.type ?? '')) {
    return `请填写${column.title}`
  }
  if (['select', 'cascader', 'tree-select'].includes(column.type ?? '')) {
    return `请选择${column.title}`
  }
  if (['date-picker'].includes(column.type ?? '')) {
    return `请选择日期`
  }
  if (['time-picker'].includes(column.type ?? '')) {
    return `请选择时间`
  }
  return ''
}

function setPlaceholder(type: string) {
  switch (type) {
    case 'cascader':
    case 'select':
    case 'tree-select':
      return '请选择'

    case 'input':
    case 'input-number':
      return '请输入'

    case 'textarea':
      return '请填写'

    case 'date-picker':
      return '请选择日期'

    case 'time':
    case 'time-picker':
      return '请选择时间'
  }
}

// 初始化 formItem 的一些 props
function initProps(column: ColumnType) {
  const obj: Partial<ColumnType['props'] & { placeholder: string }> = {}

  if (!column.type)
    return

  if (['input', 'textarea', 'select', 'cascader', 'tree-select', 'date-picker', 'time-picker'].includes(column.type)) {
    obj.allowClear = true
    obj.placeholder = `${setPlaceholder(column.type)}${column.title}`
  }
  if (column.type === 'input') {
    obj.maxLength = 50
  }
  if (column.type === 'textarea') {
    obj.maxLength = 200
  }
  return { ...obj, ...column.props }
}

function handleDisabled(column) {
  if (typeof props?.disabledCell === 'boolean')
    return props.disabledCell
  if (typeof props?.disabledCell === 'function')
    return props.disabledCell(column)
  return false
}

defineExpose({
  resetFields,
  clearValidate,
  validate,
})
</script>

<template>
  <div class="">
    <a-form ref="formRef" :model="form">
      <a-table
        v-bind="attrs" :data-source="form.tableData" bordered :pagination="false"
      >
        <template #headerCell="{ column }">
          <template v-if="column?.formItemProps?.required">
            <span class="title">{{ column.title }}</span>
          </template>
          <template v-else>
            <span>{{ column.title }}</span>
          </template>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column?.type && AntFormType.includes(column?.type)">
            <a-form-item
              v-bind="column.formItemProps"
              :name="['tableData', index, column.dataIndex]"
              :rules="[{ required: column.formItemProps?.required || false, message: formatMessage(column) }, ...(column.formItemProps?.rules || [])]"
            >
              <template v-if="column.type === 'custom'">
                <slot
                  :name="column.dataIndex" v-bind="{ record, index, column }"
                />
              </template>
              <component :is="`a-${column.type}`" v-else v-bind="initProps(column)" v-model:value="record[column.dataIndex]" :disabled="handleDisabled({ column, index })">
                <template v-for="item in column?.props?.slots" #[item]>
                  <slot :name="`${`${column.dataIndex}-${item}`}`" />
                </template>
              </component>
            </a-form-item>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-form-item>
              <slot
                :name="column.dataIndex" v-bind="{ record, index, column }"
              />
            </a-form-item>
          </template>
        </template>
      </a-table>
    </a-form>
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-form-item) {
  margin-bottom: 0 !important;
}

:deep(.ant-form-item-explain-error) {
  display: none; /* 不显示错误提示文本 */
}

.title::before {
  content: '*';
  color: var(--ant-color-error);
  margin-right: 4px;

}
</style>
