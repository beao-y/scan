<script lang="ts" setup>
import type { UploadChangeParam, UploadFile } from 'ant-design-vue'
import type { UploadFileType } from '@/components/upload/interface.ts'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { computed, ref, watch } from 'vue'
import { deleteFile } from '@/api/modules/upload'
import { useGlobalState } from '@/store/globalState.ts'
import { antdUtils } from '@/utils/antUtils.ts'
import { UUID } from '@/utils/common.ts'
import { getApiUrl } from '@/utils/tools.ts'

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileType>(), {
  name: 'file',
  disabled: false,
  fileList: () => [] as UploadFile[],
  fileSize: 5,
  fileType: () => ['jpeg', 'png'],
  height: '120px',
  width: '120px',
  borderRadius: '12px',
  multiple: false,
  limit: 5,
})

const emit = defineEmits(['update:fileList'])

const { token } = useGlobalState()

const url = getApiUrl('/file/upload')
const headers = computed(() => {
  return {
    Authorization: token,
  }
})

const previewVisible = ref(false)
// 生成组件唯一id
const uuid = ref(`id-${UUID()}`)

// 预览
const previewUrl = ref('')

const imgUrl = computed(() => {
  return typeof props.fileList === 'string' ? props.fileList : ''
})

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

// 用于多选
const fileList = computed({
  get() {
    return Array.isArray(props.fileList) ? props.fileList : []
  },
  set(value) {
    emit('update:fileList', value)
  },
})
const loading = ref<boolean>(false)

watch(() => props.fileList, () => {})

function handleChange(info: UploadChangeParam) {
  fileList.value = info.fileList.filter(f =>
    props.fileType.map(v => (`image/${v}`)).includes(f.type ?? '') && (f.size && f.size / 1024 / 1024 < props.fileSize),
  )
  // 多选的时候，需要限制上传数量
  if (props.multiple && info.fileList.length > props.limit) {
    antdUtils.message?.error(`最多只能上传 ${props.limit} 张图片！`)
    fileList.value = fileList.value.slice(0, props.limit)
  }
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done' && info.file.originFileObj) {
    getBase64(info.file.originFileObj, (base64Url: string) => {
      // 单选的时候修改内容
      !props.multiple && emit('update:fileList', base64Url)
      loading.value = false
    })
  }
  if (info.file.status === 'error') {
    loading.value = false
    antdUtils.message?.error('上传失败！')
  }
}

function beforeUpload(file: UploadFile) {
  const isLtType = props.fileType.map(v => (`image/${v}`)).includes(file.type ?? '')
  if (!isLtType) {
    antdUtils.message?.error(`请上传正确的图片格式，支持 ${props.fileType} 格式!`)
  }
  const isLtSize = file.size && file.size / 1024 / 1024 < props.fileSize
  if (!isLtSize) {
    antdUtils.message?.error(`上传图片大小不能超过 ${props.fileSize}M！`)
  }
  return isLtType && isLtSize
}

function onEdit() {
  const dom = document.querySelector(`#${uuid.value}`)
  dom && dom.dispatchEvent(new MouseEvent('click'))
}

function onDelete() {
  emit('update:fileList', '')

  // 单选的时候，需要清空
  fileList.value = []
}

// 预览
function onPreview() {
  previewVisible.value = true
  previewUrl.value = imgUrl.value
}
function handlePreview(file: UploadFile) {
  previewVisible.value = true
  previewUrl.value = file.url ?? ''
}

// 多图删除才走这个方法
async function handleRemove(file: UploadFile) {
  const [err, _, meta] = await deleteFile(file.response.data)
  if (err)
    return
  if (meta.success) {
    antdUtils.message?.success('删除成功')

    if (Array.isArray(props.fileList)) {
      // 类型安全的过滤
      const newFileList = props.fileList
        .filter((item): item is UploadFile => {
          return Boolean(item && item.response?.data?.uid)
        })
        .filter((item) => {
          return item.response.data.uid !== file.response.data.uid
        })

      emit('update:fileList', newFileList)
    }
  }
}
</script>

<template>
  <div>
    <a-upload
      v-bind="$attrs"
      :id="uuid"
      v-model:file-list="fileList"
      :multiple="multiple"
      :name="name"
      :disabled="disabled"
      :draggable="false"
      :class="!multiple && imgUrl ? 'upload' : ''"
      list-type="picture-card"
      :show-upload-list="multiple"
      :action="url"
      :headers="headers"
      :before-upload="beforeUpload"
      @preview="handlePreview"
      @change="handleChange"
      @remove="handleRemove"
    >
      <template v-if="imgUrl">
        <img :src="imgUrl" alt="avatar">
        <div class="upload-handler" @click.stop>
          <div v-if="!disabled" class="upload-handler-item" @click="onEdit">
            <SvgIcon name="ant-EditOutlined" />
            <span>编辑</span>
          </div>
          <div class="upload-handler-item" @click="onPreview">
            <SvgIcon name="ant-EyeOutlined" />
            <span>预览</span>
          </div>
          <div v-if="!disabled" class="upload-handler-item" @click="onDelete">
            <SvgIcon name="ant-ScissorOutlined" />
            <span>删除</span>
          </div>
        </div>
      </template>

      <template v-if="!imgUrl && fileList.length < props.limit">
        <div class="upload-empty">
          <slot name="empty">
            <LoadingOutlined v-if="loading" />
            <PlusOutlined v-else />
            <div class="mt-2">
              点击上传
            </div>
          </slot>
        </div>
      </template>
    </a-upload>

    <div class="upload-tip">
      <slot name="tip" />
    </div>

    <a-modal :open="previewVisible" title="图片预览" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewUrl">
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
:deep(.ant-upload) {
  @apply relative overflow-hidden;
  border-radius: v-bind(borderRadius) !important;
  width: v-bind(width) !important;
  height: v-bind(height) !important;

  &:hover {
    .upload-handler {
      @apply opacity-100;
    }
  }
}

:deep(.ant-upload-list-item){
  @apply overflow-hidden;
  border-radius: v-bind(borderRadius) !important;
  width: v-bind(width) !important;
  height: v-bind(height) !important;

  &::before {
    overflow: hidden!important;
    border-radius: v-bind(borderRadius) !important;
  }

}

:deep(.ant-upload-list-item-thumbnail) {
  @apply overflow-hidden;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.ant-upload-list-item-container){
  border-radius: v-bind(borderRadius) !important;
  width: v-bind(width) !important;
  height: v-bind(height) !important;
}

:deep(.ant-upload) {
  img {
    @apply w-full h-full object-contain;
  }
}

/** 单图的时候 禁用的鼠标样式 */
:deep(.upload .ant-upload-disabled ) {
  cursor: pointer!important;
}

.upload-handler {
  @apply absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0;
  background-color: rgba(0,0,0,0.6);
  border-radius: v-bind(borderRadius);

  &-item {
    @apply w-full flex flex-col items-center justify-center text-white z-10 ;
    padding: 0 6%;

    span {
      @apply mt-2 text-xs;
    }
  }
}

.upload-empty {
  @apply text-sm;
  color: var(--ant-color-text-tertiary);
}

.upload-tip {
  @apply text-xs;
  color: var(--ant-color-text-secondary);
}
</style>
