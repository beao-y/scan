import type * as Antd from 'ant-design-vue'
import type { checkboxProps } from 'ant-design-vue/es/checkbox'
import type { Component, Ref, VNode, WritableComputedRef } from 'vue'

export type ComponentProps =
  & Antd.InputProps
  & Antd.InputNumberProps
  & typeof checkboxProps
  & Antd.RadioProps
  & Antd.SelectProps
  & Antd.SliderProps
  & Antd.CascaderProps
  & Antd.TreeSelectProps
  & Antd.DatePickerProps
  & Antd.TimePickerProps
  & Antd.TimeRangePickerProps
  & Antd.SwitchProps
  & {
    [key: string]: any
  }

export interface ColumnsItemProps extends Partial<Omit<ComponentProps, 'placeholder' | 'type'>> {
  placeholder?: string | string[]
  type?: string
}

interface ColType {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

type FormType =
  | 'input'
  | 'input-password'
  | 'input-number'
  | 'textarea'
  | 'select'
  | 'slider'
  | 'radio'
  | 'radio-group'
  | 'checkbox-group'
  | 'checkbox'
  | 'switch'
  | 'cascader'
  | 'tree-select'
  | 'date-picker'
  | 'range-picker'
  | 'time-picker'
  | 'time-range-picker'
  | 'group'
  | 'dynamic'

export interface FormItemType {
  type?: FormType | Component | (() => VNode)
  label?: string | WritableComputedRef<string>
  key: string
  show?: boolean | ((model: any) => boolean) // 是否显示
  hide?: boolean | ((model: any) => boolean) // 是否隐藏
  props?: ColumnsItemProps
  formItemProps?: Omit<Antd.FormItemInstance['$props'], 'label' | 'field'> // a-form-item的props
  placeholder?: string
  col?: ColType
  required?: boolean
  rules?: Antd.FormInstance['rules'] | Antd.FormItemInstance['rules']
  slots?: Partial<ColumnsItemProps>
  span?: number
  picker?: 'quarter' | 'week' | 'month' | 'year'
  items?: FormItemType[]
  [key: string]: any
}

interface StyleType {
  width: string
}

interface LayoutType {
  style?: StyleType
  span?: number
  offset?: number
  [key: string]: any
}

export interface FormConfig {
  gutter?: number
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelAlign?: 'left' | 'right'
  size?: 'small' | 'large' | 'default'
  colon?: boolean
  span?: number
  labelWidth?: number
  labelCol?: LayoutType
  wrapperCol?: LayoutType
  labelPosition?: 'left' | 'right' | 'top'
  items: Array<FormItemType>
  rules?: Antd.FormInstance['rules']
  btn?: {
    hide?: boolean
    span?: number
    col?: ColType
    submitIcon?: string
    resetIcon?: string
    searchBtnText?: string
    resetBtnText?: string
    searchBtnLoading?: Ref<boolean> | boolean
    [key: string]: any
  }
  collapse?: {
    enable?: boolean
    index?: number
    isCollapsed?: boolean
  }

}
