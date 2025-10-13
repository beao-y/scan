export interface TableState {
  dataSource: EmptyArrayType
  disabledCell?: boolean | ((record: EmptyObjectType) => boolean)
}

export interface ColumnType {
  title: string
  key?: string
  dataIndex: string
  props?: any
  formItemProps?: any
  type?:
    | 'input'
    | 'input-password'
    | 'input-number'
    | 'textarea'
    | 'select'
    | 'slider'
    | 'radio'
    | 'checkbox'
    | 'radio-group'
    | 'checkbox-group'
    | 'switch'
    | 'cascader'
    | 'tree-select'
    | 'date-picker'
    | 'range-picker'
    | 'time-picker'
    | 'time-range-picker'
  [key: string]: any
}
