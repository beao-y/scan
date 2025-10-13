<script lang="ts" setup>
import type { TreePropsType } from '@/components/filterTree/interface.ts'
import type { MenuProps, TreeProps } from 'ant-design-vue'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'
import { MoreOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'
import { computed, nextTick, ref, watch } from 'vue'

const props = withDefaults(defineProps<TreePropsType>(), {
  multiple: false,
})

const emit = defineEmits(['change'])
const searchValue = ref('')
const autoExpandParent = ref(true)
const expandedKeys = ref<(string | number)[]>([])

const treeData = ref<TreeProps['treeData']>([])

const checkedKeys = ref()
const selectedKeys = ref()
function setCheckedKeys() {
  if (props.multiple) {
    checkedKeys.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue]
  }
  else {
    selectedKeys.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue]
  }
}

watch(
  () => props.defaultValue,
  () => nextTick(() => setCheckedKeys()),
  { deep: true, immediate: true },
)

// 根据搜索结果的子节点动态计算需要展开的父节点
function getExpandedKeys(nodes: TreeProps['treeData']): (string | number)[] {
  if (!nodes)
    return []
  const keys: (string | number)[] = []
  nodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      keys.push(node.key) // 如果有子节点，父节点需要展开
      // 递归处理子节点
      keys.push(...getExpandedKeys(node.children))
    }
  })
  return keys
}

const filteredTreeData = computed(() => {
  // 根据 searchText 过滤树数据
  if (!searchValue.value) {
    return treeData.value
  }

  // 过滤树节点的函数，递归处理子节点
  const filterData = (data: TreeProps['treeData']) => {
    if (!data)
      return
    return data
      .map((node) => {
        // 过滤子节点
        const children = node.children ? filterData(node.children) : []
        // 判断当前节点是否匹配搜索条件
        const isNodeMatched = node.title.toLowerCase().includes(searchValue.value.toLowerCase())

        // 如果当前节点或子节点匹配，则保留该节点
        return {
          ...node,
          children,
          // 记录父节点是否需要展开
          visible: isNodeMatched || children?.length > 0,
        }
      })
      .filter(node => node.visible) // 保留符合条件的节点
  }

  return filterData(treeData.value)
})

// 使用 watch 来更新 expandedKeys
watch(filteredTreeData, (newFilteredData) => {
  // 更新 expandedKeys，使匹配的父节点展开
  expandedKeys.value = getExpandedKeys(newFilteredData)
}, {
  immediate: true, // 初始时也触发一次，以确保 expandedKeys 在首次加载时也被更新
})

// 处理单选和多选的数据
watch(
  () => props.treeData,
  () => {
    if (props.treeData?.length) {
      treeData.value = props.multiple ? props.treeData : [{ key: '', title: '全部' }, ...props.treeData]
    }
  },
  { deep: true, immediate: true },
)

function onSearch() {
  // 每次搜索时，展开父节点
  autoExpandParent.value = true
}

function filterTreeNode(treeNode: DataNode) {
  // filterTreeNode 用来做节点过滤
  return treeNode.title.toLowerCase().includes(searchValue.value.toLowerCase())
}

// 展开折叠触发
function onExpand(keys: (string | number) []) {
  expandedKeys.value = keys
  autoExpandParent.value = false
}

function onCheck(keys: TreeProps['checkedKeys']) {
  // 判断 keys 是否是一个数组
  const checkedKeys = Array.isArray(keys) ? keys : keys?.checked
  emit('change', checkedKeys)
}

// 找到所有父节点
function getAllKeys(nodes: TreeProps['treeData']) {
  if (!nodes)
    return []
  let keys: (string | number)[] = []
  nodes.forEach((node) => {
    keys.push(node.key)
    if (node.children) {
      keys = keys.concat(getAllKeys(node.children))
    }
  })
  return keys
}

const handleMenuClick: MenuProps['onClick'] = (e) => {
  expandedKeys.value = e.key === '1' ? getAllKeys(filteredTreeData.value) : []
}
</script>

<template>
  <div full>
    <h4 v-if="title" class="text-base font-bold">
      {{ title }}
    </h4>
    <div class="flex-center mb-2">
      <a-input-search v-model:value="searchValue" placeholder="搜索关键词" @search="onSearch" />
      <a-dropdown>
        <a-button type="text">
          <template #icon>
            <MoreOutlined />
          </template>
        </a-button>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1">
              展开
            </a-menu-item>
            <a-menu-item key="2">
              折叠
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <a-tree
      v-if="filteredTreeData?.length"
      v-bind="$attrs"
      v-model:checked-keys="checkedKeys"
      v-model:selected-keys="selectedKeys"
      block-node
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :filter-tree-node="filterTreeNode"
      :tree-data="filteredTreeData"
      :checkable="multiple"
      @expand="onExpand"
      @check="onCheck"
    >
      <template #title="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substring(0, title.indexOf(searchValue)) }}
          <span class="selected">{{ searchValue }}</span>
          {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
    <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
  </div>
</template>

<style scoped lang="scss">
.selected {
  color: var(--ant-color-primary);
}
</style>
