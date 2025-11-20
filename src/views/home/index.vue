<script setup>
import { Html5Qrcode } from 'html5-qrcode'
import { computed, onUnmounted, ref } from 'vue'

// 响应式数据
const isScaning = ref(false)
const html5Qrcode = ref(null)
const scanResults = ref([])
const errorMessage = ref('')
const lastScanTime = ref(0) // 用于防抖

const requiredCodes = ['order', 'room', 'device']

// 防抖函数
function debounce(fn, delay) {
  let timer = null
  return (...args) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 计算属性
const progressPercentage = computed(() => {
  return Math.round((scanResults.value.length / 3) * 100)
})

const scannedTypes = computed(() => {
  return scanResults.value.map(item => item.type)
})

const currentRequiredType = computed(() => {
  const scannedTypes = scanResults.value.map(item => item.type)
  return requiredCodes.find(type => !scannedTypes.includes(type))
})

const currentTask = computed(() => {
  if (!currentRequiredType.value) {
    return '扫描完成！'
  }
  const typeMap = {
    order: '订单码',
    room: '房间码',
    device: '设备码',
  }
  return `请扫描${typeMap[currentRequiredType.value]} (${scanResults.value.length + 1}/3)`
})

const isAllCodesValid = computed(() => {
  const scannedTypes = scanResults.value.map(item => item.type)
  return requiredCodes.every(type => scannedTypes.includes(type))
})

// 防抖的错误提示
const showErrorDebounced = debounce((messageText) => {
  errorMessage.value = messageText
  setTimeout(() => {
    errorMessage.value = ''
  }, 2000)
}, 500)

// 方法
function startScan() {
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (!devices.length) {
        message.error('未找到摄像头设备')
        return
      }

      isScaning.value = true
      scanResults.value = []
      errorMessage.value = ''
      lastScanTime.value = 0

      html5Qrcode.value = new Html5Qrcode('reader')

      html5Qrcode.value.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 600, height: 600 },
        },
        (decodeText) => {
          handleScanResult(decodeText)
        },
        (error) => {
          // 忽略扫码过程中的常规错误
          if (!error.includes('NotFoundException')) {
            console.log('扫码错误:', error)
          }
        },
      )
    })
    .catch(() => {
      message.error('摄像头访问失败')
    })
}

function handleScanResult(decodeText) {
  // 防抖：1秒内不重复处理
  const now = Date.now()
  if (now - lastScanTime.value < 1000) {
    return
  }
  lastScanTime.value = now

  // 如果已经完成扫描，直接停止
  if (!currentRequiredType.value) {
    return
  }

  const codeType = parseCodeType(decodeText)

  if (!codeType) {
    showErrorDebounced('无效的二维码格式')
    return
  }

  // 检查是否是当前需要的类型
  if (codeType !== currentRequiredType.value) {
    const typeMap = { order: '订单码', room: '房间码', device: '设备码' }
    const currentTypeName = typeMap[currentRequiredType.value]
    const scannedTypeName = typeMap[codeType] || '未知类型'
    showErrorDebounced(`请先扫描${currentTypeName}，当前扫描的是${scannedTypeName}`)
    return
  }

  // 检查是否重复
  if (scanResults.value.some(item => item.code === decodeText)) {
    showErrorDebounced('该二维码已扫描，请扫描新的二维码')
    return
  }

  // 添加到结果
  scanResults.value.push({
    code: decodeText,
    type: codeType,
    timestamp: Date.now(),
  })

  message.success(`${getCodeType(decodeText)}扫描成功！`)

  // 检查是否完成所有扫描
  if (scanResults.value.length >= 3) {
    completeScanning()
  }
}

function parseCodeType(code) {
  if (code.includes('order'))
    return 'order'
  if (code.includes('room'))
    return 'room'
  if (code.includes('device'))
    return 'device'
  return null
}

function getCodeType(code) {
  const typeMap = {
    order: '订单码',
    room: '房间码',
    device: '设备码',
  }
  const type = parseCodeType(code)
  return typeMap[type] || '未知码'
}

function getTypeName(type) {
  const typeMap = {
    order: '订单码',
    room: '房间码',
    device: '设备码',
  }
  return typeMap[type] || '未知'
}

function completeScanning() {
  isScaning.value = false
  if (html5Qrcode.value) {
    html5Qrcode.value.stop().then(() => {
      html5Qrcode.value = null
    }).catch(() => {
      html5Qrcode.value = null
    })
  }
  message.success('所有二维码扫描完成！')
}

function stopScan() {
  isScaning.value = false
  if (html5Qrcode.value) {
    html5Qrcode.value.stop().then(() => {
      html5Qrcode.value = null
    }).catch(() => {
      html5Qrcode.value = null
    })
  }
  message.info('已停止扫描')
}

function resetScan() {
  stopScan()
  scanResults.value = []
  errorMessage.value = ''
  lastScanTime.value = 0
}

async function confirmResults() {
  if (!isAllCodesValid.value) {
    message.error('请确保订单码、房间码、设备码都已正确扫描')
    return
  }

  try {
    const result = await submitScanResults()
    message.success('提交成功！')
    // 触发事件
    // emit('scan-complete', result)
  }
  catch (error) {
    message.error(`提交失败：${error.message}`)
  }
}

async function submitScanResults() {
  const submitData = {
    orderCode: scanResults.value.find(item => item.type === 'order')?.code,
    roomCode: scanResults.value.find(item => item.type === 'room')?.code,
    deviceCode: scanResults.value.find(item => item.type === 'device')?.code,
    scanTime: Date.now(),
  }

  console.log('提交数据:', submitData)
  return { success: true, data: submitData }
}

// 生命周期
onUnmounted(() => {
  stopScan()
})
</script>

<template>
  <div class="scanner">
    <div class="scanner">
      <div class="">
        <!-- 初始状态 -->
        <div v-if="!isScaning && scanResults.length === 0" class="scanner-card">
          <div class="scanner-icon">
            📱
          </div>
          <p class="scan-title">
            设备二维码扫描
          </p>
          <p class="scan-tip">
            需要依次扫描：订单码、房间码、设备码
          </p>
          <a-button type="primary" class="start-btn" size="large" @click="startScan">
            开始扫描
          </a-button>
        </div>

        <!-- 扫描中状态 -->
        <div v-if="isScaning" class="scanning-status">
          <a-card class="status-card">
            <div class="scanning-icon">
              🔍
            </div>
            <h3 class="scanning-title">
              扫描中...
            </h3>
            <p class="current-task">
              {{ currentTask }}
            </p>
            <div class="progress">
              <a-progress :percent="progressPercentage" :show-info="false" />
              <span class="progress-text">已完成 {{ scanResults.length }}/3</span>
            </div>
            <div class="scanned-types">
              <a-tag v-for="type in scannedTypes" :key="type" color="blue">
                {{ getTypeName(type) }}
              </a-tag>
            </div>
            <a-button type="dashed" size="large" @click="stopScan">
              停止扫描
            </a-button>
          </a-card>
        </div>

        <!-- 扫描结果 -->
        <div v-if="scanResults.length > 0 && !isScaning" class="scan-results">
          <a-card title="扫描完成" class="result-card">
            <div class="result-list">
              <div v-for="(result, index) in scanResults" :key="index" class="result-item">
                <span class="result-type">{{ getCodeType(result.code) }}：</span>
                <span class="result-code">{{ result.code }}</span>
                <a-tag color="green">
                  正确
                </a-tag>
              </div>
            </div>

            <template #actions>
              <a-button type="primary" ghost @click="resetScan">
                重新扫描
              </a-button>
              <a-button
                type="primary"
                :disabled="!isAllCodesValid"
                @click="confirmResults"
              >
                确认提交
              </a-button>
            </template>
          </a-card>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          <a-alert :message="errorMessage" type="error" show-icon />
        </div>
      </div>
    </div>

    <div v-show="isScaning" id="reader" ref="reader" class="scanner-ctn" />
  </div>
</template>

<style scoped>
.scanner {
  width: 100%;
}

.scanner-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.scan-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.5rem;
}

.scan-tip {
  color: #8c8c8c;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.scanner-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.scanning-status {
  text-align: center;
  margin-bottom: 2rem;
}

.status-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.scanning-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.scanning-title {
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.current-task {
  font-size: 1rem;
  font-weight: 500;
  color: #595959;
  margin-bottom: 1.5rem;
}

.progress {
  margin: 1.5rem 0;
}

.progress-text {
  display: block;
  margin-top: 0.5rem;
  color: #8c8c8c;
  font-size: 0.9rem;
}

.scanned-types {
  margin: 1rem 0;
}

.scanned-types .ant-tag {
  margin: 0.25rem;
}

.result-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-list {
  margin: 1.5rem 0;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.result-type {
  font-weight: 500;
  color: #262626;
  min-width: 80px;
}

.result-code {
  flex: 1;
  margin: 0 1rem;
  color: #595959;
  font-family: monospace;
}

.error-message {
  margin-top: 1rem;
}

.start-btn {
  height: 48px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
}

.scanner-ctn {
  width: 100%;
  height: 100vh;
  background: #000;
  border-radius: 8px;
}

/* Ant Design 样式优化 */
:deep(.ant-card-head-title) {
  font-weight: 600;
  color: #262626;
}

:deep(.ant-card-actions) {
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-btn) {
  border-radius: 6px;
}

:deep(.ant-progress-line) {
  line-height: 1;
}
</style>
