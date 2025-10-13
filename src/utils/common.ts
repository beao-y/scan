import type { GlobalToken } from 'ant-design-vue/es/theme'
import { kebabCase } from 'lodash-es'

// export function debounce(fn: (...args: any[]) => void, duration = 1000) {
//   let timer: ReturnType<typeof setTimeout> | null = null
//   return (...args: any[]) => {
//     if (timer)
//       clearTimeout(timer)
//     timer = setTimeout(() => fn(...args), duration)
//   }
// }

/**
 * 一维数组转多维数组,处理路由
 */
export function buildRouteTree(data: IRouteType[]): IRouteType[] {
  const map: Map<string, IRouteType> = new Map()
  const tree: IRouteType[] = []

  // 将所有节点存入 map 中
  data.forEach((item) => {
    map.set(item.path, { ...item })
  })

  // 构建树形结构
  data.forEach((item) => {
    if (item.parentPath) {
      const parent = map.get(item.parentPath)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(map.get(item.path)!)
      }
    }
    else {
      tree.push(map.get(item.path)!)
    }
  })

  // 移除没有 children 的字段
  const removeEmptyChildren = (node: IRouteType) => {
    if (node.children && node.children.length === 0) {
      delete node.children
    }
    else if (node.children) {
      node.children.forEach(removeEmptyChildren)
    }
  }

  // 递归排序
  function sortTree(node: IRouteType) {
    if (!node.children)
      return
    if (node.children.length > 0) {
      node.children.sort((a, b) => a.sort - b.sort)
      node.children.forEach(sortTree)
    }
  }

  tree.forEach(removeEmptyChildren)

  // 对根节点进行排序
  tree.sort((a, b) => a.sort - b.sort)
  tree.forEach(sortTree)

  return tree
}

/**
 * 生成主题var
 * @param {GlobalToken} token
 * @param {string} prefixCls
 */
export function generateThemeVariables(token: GlobalToken, prefixCls: string): string {
  const cssVar = Object.entries(token)
    .filter(([key]) => /^(?:color|font|line|link|motion|border|margin|padding(?!con)|screen(?:(?!min|max).)*$|boxShadow(?!pop|dra|tab|car))/i.test(key))
    .map(([key, value]) => `--${prefixCls}-${kebabCase(key)}: ${value}${/size|width|radius|margin|screen|padding/i.test(key) ? 'px' : ''}`)

  return `
    :root {
      ${cssVar.join(';\n')}
    }
  `.trim()
}

/**
 * @description 生成唯一 uuid
 */
export function UUID() {
  let uuid = ''
  for (let i = 0; i < 32; i++) {
    const random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20)
      uuid += '-'
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}
