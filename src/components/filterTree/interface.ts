import type { TreeProps } from 'ant-design-vue'

export interface TreePropsType {
  treeData: TreeProps['treeData'] // 树数据
  title?: string // 标题
  multiple?: boolean // 是否为多选 ==>默认为 false
  defaultValue?: string | (string | number)[] // 默认选中的值
}
