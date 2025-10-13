// ref
declare type RefType<T = any> = T | null

// 数组
declare type EmptyArrayType<T = any> = T[]

// 对象
declare interface EmptyObjectType<T = any> {
  [key: string]: T
}
