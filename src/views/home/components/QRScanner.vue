<script setup>
import { Html5Qrcode } from 'html5-qrcode'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { antdUtils } from '@/utils/antUtils'

const reader = ref(null)
const isScaning = ref(false)
const scanResult = ref('')
let html5Qrcode = null

const devicesNum = ref(0)

const cameraIdRef = ref('')

function startScan() {
  const screenWidth = window.innerWidth
  const qrboxSize = Math.min(screenWidth * 0.7, 500) // 屏幕70%，最大300px

  console.log('qrboxSize', screenWidth, qrboxSize)

  Html5Qrcode.getCameras().then((devices) => {
    if (!devices.length)
      return

    isScaning.value = true

    html5Qrcode = new Html5Qrcode('reader')

    html5Qrcode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: qrboxSize, height: qrboxSize },
      },
      (decodeText) => {
        scanResult.value = decodeText
      },
      (err) => {
        antdUtils.message?.error(err)
      },
    ).then(() => {
      // 退出扫码页面
      isScaning.value = false
    }).catch((error) => {
      antdUtils.message?.error(error)
    })
  }).catch((error) => {
    antdUtils.message?.error(error)
  }).finally(() => {
    isScaning.value = false
  })
}

function stopScan() {
  isScaning.value = false
  if (html5Qrcode) {
    html5Qrcode.stop()
    html5Qrcode = null
  }
}

onMounted(() => {
//   startScan()
})

onBeforeUnmount(() => {
  stopScan()
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full">
      <div class="">
        <div v-if="!isScaning" class="scanner-card">
          <div class="scanner-icon">
            📱
          </div>
          <p>点击下方按钮开始扫描设备二维码</p>
          <a-button class="start-btn" @click="startScan">
            开始扫描
          </a-button>
        </div>

        <div
          v-if="scanResult"
          class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <h3 class="text-lg font-semibold text-green-800 mb-2">
            扫描结果：
          </h3>
          <p class="text-green-700 break-all">
            {{ scanResult }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="isScaning"
      id="reader"
      ref="reader"
      class="w-full h-full border-2 mt-4 border-gray-200 rounded-lg overflow-hidden bg-black"
    />
  </div>
</template>

<style scoped>
.scanner-card {
  background: white;
  padding: 1rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.scanner-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.scanner-card h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.scanner-card p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}
</style>
