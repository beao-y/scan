<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { FormConfig, FormItemType } from '@/components/formBuilder/interface.ts'
import type { ColumnType } from '@/components/proEditTable/interface.ts'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { debounce } from 'lodash-es'
import { computed, ref, toRaw } from 'vue'

interface FormState {
  formConfig: FormConfig
  immediate?: boolean
}

const props = withDefaults(defineProps<FormState>(), {
  immediate: false,
  formConfig: () => ({
    items: [],
    slots: [],
    btn: {},
    rules: {},
    collapse: {
      enable: true,
      index: 2,
    },
  }),
})
const emit = defineEmits<{
  (e: 'submit', payload: Record<string, any>): void
}>()

const modelValue = defineModel<Record<string, any>>({
  default: () => reactive({}), // 确保初始化为对象
  required: true, // 可选：强制父组件必须传值
})

const formInstance = useTemplateRef<FormInstance>('formRef')

/**
 * 布局渲染相关api
 */
function useFormLayout() {
  const defaultCol = ref({ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 })

  function getComponent(type: FormItemType['type']): string | Component | (() => VNode) | undefined {
    if (typeof type === 'string') {
      return `a-${type}` // 处理字符串类型
    }
    return type // 直接返回组件或渲染函数
  }

  return { defaultCol, getComponent }
}

const { defaultCol, getComponent } = useFormLayout()

/**
 * 表单初始化数据
 */
function useFormInit() {
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

  function setPlaceholder(type: string) {
    switch (type) {
      case 'cascader':
      case 'select':
      case 'tree-select':
      case 'time':
      case 'time-picker':
      case 'date-picker':
        return '请选择'

      case 'input':
      case 'input-number':
      case 'input-password':
        return '请输入'

      case 'textarea':
        return '请填写'
    }
  }

  // 初始化 formItem 的一些 props
  function initProps(column: FormItemType) {
    const obj: Partial<ColumnType['props'] & { placeholder: string }> = {}

    if (!column.type || typeof column.type !== 'string')
      return

    if (AntFormType.includes(column.type)) {
      obj.allowClear = true
      obj.placeholder = `${setPlaceholder(column.type)}${column.label}`
    }
    if (['time-range-picker', 'range-picker'].includes(column.type)) {
      obj.placeholder = ['开始时间', '结束时间']
    }
    if (column.type === 'input') {
      obj.maxLength = 50
    }
    if (column.type === 'textarea') {
      obj.maxLength = 200
    }
    return { ...obj, ...column.props }
  }

  // 表单项校验规则
  function getFormItemRules(item: FormItemType) {
    if (item.required) {
      return [{ required: true, message: `${item.label}为必填项` }, ...(Array.isArray(item.rules) ? item.rules : [])]
    }
    return item.rules
  }

  return {
    initProps,
    getFormItemRules,
  }
}

const { initProps, getFormItemRules } = useFormInit()

/**
 * 动态布局
 */
function useFormDynamicLayout() {
  const collapsed = ref(props.formConfig.collapse?.isCollapsed ?? false)

  // col组件的显示隐藏
  function isShow(index: number) {
    // 展开状态显示全部
    if (!collapsed.value) {
      return true
    }

    if (props.formConfig?.collapse?.index === undefined) {
      return true
    }

    // 收起状态按计算值显示
    return index < props.formConfig?.collapse?.index
  }

  // 是否显示展开与收起按钮
  const isShowCollapseBtn = computed(() => {
    const { collapse, items } = props.formConfig || {}

    // 处理 collapse 或 items 为 undefined 的情况
    if (!collapse?.enable || !items?.length) {
      return false
    }

    // 处理 index 为 undefined 的情况（默认不显示）
    const collapseIndex = collapse.index ?? Infinity

    // 最终判断
    return items.length > collapseIndex
  })

  // 判断表单项是否隐藏
  function isHide(item: FormItemType) {
    if (item.hide === undefined)
      return false
    if (typeof item.hide === 'boolean')
      return item.hide
    if (typeof item.hide === 'function') {
      return item.hide(modelValue)
    }
  }

  return {
    collapsed,
    isShow,
    isShowCollapseBtn,
    isHide,
  }
}

const {
  collapsed,
  isShow,
  isShowCollapseBtn,
  isHide,
} = useFormDynamicLayout()

/**
 * 处理表单数据
 */
function useFormAction() {
  // 滚动到第一个错误字段
  function scrollToError(error: EmptyObjectType) {
    // 滚动到第一个错误字段
    formInstance.value?.scrollToField(error.errorFields[0].name, {
      behavior: 'smooth',
      block: 'center',
    })
  }

  // 解决 trigger：blur 不生效问题
  function handleBlur(item: FormItemType) {
    if (typeof item.type !== 'string')
      return
    if (!['input', 'input-number', 'input-password'].includes(item.type))
      return
    formInstance.value?.validateFields([item.field])
  }

  function onFinish() {
    formInstance.value?.validate()
      .then(() => {
        emit('submit', toRaw(modelValue.value))
      })
      .catch((err) => {
        scrollToError(err)
      })
  }

  // 用于单个formItem的rules验证
  function validates() {
    return new Promise((resolve, reject) => {
      formInstance.value?.validate()
        .then(() => {
          resolve(true)
        })
        .catch((err) => {
          reject(err)
          scrollToError(err)
        })
    })
  }

  // 重置表单并且移除校验
  function clearFields() {
    formInstance.value?.resetFields()
    formInstance.value?.clearValidate()
  }

  // 重置标记，防止和watch同时运行多次接口调用
  const isResetting = ref(false)

  function onreset() {
    clearFields()
    isResetting.value = true
    // 执行重置逻辑...
    nextTick(() => {
      isResetting.value = false
      // 重置后直接提交，不使用防抖
      props.immediate && emit('submit', toRaw(modelValue.value))
    })
  }

  // input 防抖
  const inputChange = debounce(() => {
    if (!isResetting.value) {
      props.immediate && emit('submit', toRaw(modelValue.value))
    }
  })

  const filterItems = props.formConfig.items
    .filter(v => v.type !== 'input')
    .map(v => v.field)

  return {
    scrollToError,
    handleBlur,
    onFinish,
    validates,
    clearFields,
    filterItems,
    onreset,
    inputChange,
    isResetting,
  }
}

const {
  scrollToError,
  handleBlur,
  onFinish,
  validates,
  clearFields,
  filterItems,
  onreset,
  inputChange,
  isResetting,
} = useFormAction()

// 监听表单的变化，改变自动搜索数据
watch(
  () => filterItems.map(v => modelValue[v]),
  (newValue) => {
    if (!isResetting.value && newValue.every(v => v !== undefined)) {
      debounce(() => {
        props.immediate && emit('submit', toRaw(modelValue.value))
      }, 300)
    }
  },
  { deep: true },
)

defineExpose({
  clearFields,
  validates,
  scrollToError,
})
</script>

<template>
  <a-form
    ref="formRef"
    v-bind="$attrs"
    :layout="formConfig.layout"
    :size="formConfig.size"
    :rules="formConfig.rules"
    :model="modelValue"
    :label-col="formConfig.labelCol"
    :wrapper-col="formConfig.wrapperCol"
    @finish="onFinish"
  >
    <a-row :gutter="formConfig.gutter ?? 14">
      <template
        v-for="(item, index) in formConfig.items"
        :key="item.key"
      >
        <a-col
          v-if="!isHide(item)"
          v-show="isShow(index) "
          :span="item.span || 12"
          v-bind="item.col || defaultCol"
        >
          <a-form-item
            :label="item.label"
            :name="item.key"
            v-bind="item.formItemProps"
            :rules="getFormItemRules(item)"
          >
            <slot :name="item.key">
              <component
                :is="getComponent(item.type)"
                v-model:value="modelValue[item.key]"
                v-bind="initProps(item)"
                @change="inputChange"
                @blur="handleBlur(item)"
              >
                <template
                  v-for="(slotValue, slotKey) in item?.slots"
                  :key="slotKey"
                  #[slotKey]="scope"
                >
                  <!-- 字符串直接渲染 -->
                  <template v-if="typeof slotValue === 'string'">
                    {{ slotValue }}
                  </template>
                  <!-- 函数返回的 JSX/VNode 用 component 渲染 -->
                  <component
                    :is="slotValue(scope)"
                    v-else-if="slotValue"
                  />
                </template>
              </component>
            </slot>
          </a-form-item>

          <!-- 动态表单部分 -->
          <template v-if="item.type === 'dynamic'">
            <a-row v-for="(it, idx) in modelValue[item.key]" :key="idx" :gutter="formConfig.gutter ?? 14">
              <a-col
                v-for="(v, i) in item.items" :key="v.key"
                :span="v.span || 12"
                v-bind="v.col || defaultCol"
              >
                <a-form-item
                  :label="v.label"
                  :name="[item.key, idx, v.field]"
                  :colon="formConfig.colon ?? true"
                  :rules="getFormItemRules(v)"
                >
                  <div class="flex-center">
                    <component
                      :is="`a-${v.type}`" v-bind="initProps(v)" v-model:value="it[v.key]" @change="inputChange"
                      @blur="handleBlur(v)"
                    >
                      <template v-for="(slotValue, slotKey) in v?.slots" :key="slotKey" #[slotKey]="scope">
                        <template v-if="typeof slotValue === 'string'">
                          {{ slotValue }}
                        </template>
                        <template v-else-if="slotValue">
                          <component :is="slotValue(scope)" />
                        </template>
                      </template>
                    </component>
                    <template v-if="item.items && i === item.items.length - 1 ">
                      <slot :name="`${item.key}-${v.key}`" :i="idx" />
                    </template>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </a-col>
      </template>

      <!-- 按钮组 -->
      <a-col
        v-if="!formConfig.btn?.hide"
        :span="formConfig.btn?.span || 24"
        v-bind="formConfig.btn?.col || defaultCol"
      >
        <a-form-item v-bind="{ ...formConfig.btn }">
          <a-space wrap>
            <a-button
              html-type="submit"
              type="primary"
              :loading="formConfig.btn?.searchBtnLoading"
            >
              <template #icon>
                <SvgIcon :name="formConfig.btn?.submitIcon ?? 'ant-SearchOutlined'" />
              </template>
              {{ formConfig.btn?.searchBtnText ?? "查询" }}
            </a-button>
            <a-button @click="onreset">
              <template #icon>
                <SvgIcon v-if="formConfig.btn?.resetIcon" :name="formConfig.btn?.resetIcon ?? ''" />
              </template>
              {{ formConfig.btn?.resetBtnText ?? "重置" }}
            </a-button>
            <a-button
              v-if="isShowCollapseBtn"
              size="small"
              type="link"
              @click="collapsed = !collapsed"
            >
              <template #icon>
                <UpOutlined v-if="!collapsed" />
                <DownOutlined v-else />
              </template>
              <span>{{ collapsed ? "展开" : "收起" }}</span>
            </a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped lang="scss">
/* 解决按钮与label错位 */
:deep(.ant-space) {
  margin-bottom: 0 !important;
}
</style>
