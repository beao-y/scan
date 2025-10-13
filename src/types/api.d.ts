/** 分页返回的数据格式 */
interface PageRes<T> {
  data: T
  total: number
}

/** 接口返回的路由数据类型 */
declare interface IRouteType {
  id?: number
  name: string
  path: string
  icon?: string
  sort: number // 排序
  parentPath?: string // 可选属性，表示父节点id
  redirect?: string // 可选属性，可能包含重定向路径
  children?: IRouteType[] // 子节点，默认为空数组
  hide?: 0 | 1 // 是否隐藏
  cache?: 0 | 1 // 是否缓存
}
