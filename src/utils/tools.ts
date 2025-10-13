/**
 *用于变格弹窗数据的，如果存在相同的key，将会覆盖，减少废数据调接口
 * @description 用于编辑和更新共用弹窗
 */
export function assignExistingKeys(target: EmptyObjectType, source: EmptyObjectType) {
  // 确保拷贝 source 中的 id
  if ('id' in source) {
    target.id = source.id
  }

  Object.keys(target).forEach((key) => {
    if (key in source) {
      target[key] = source[key]
    }
  })
  return target
}

/**
 * 合并并删除 id 属性
 * @description 用于编辑和更新共用弹窗
 */
export function mergeAndRemoveId(target: EmptyObjectType, source: EmptyObjectType) {
  // 遍历 source，将属性赋值到 target
  for (const key in source) {
    target[key] = source[key]
  }

  // 删除 target 中的 id
  delete target.id
}

/**
 * 动态拼接URL
 * @param path
 */
export function getApiUrl(path: string) {
  return `${import.meta.env.VITE_BASEURL}${path}`
}
