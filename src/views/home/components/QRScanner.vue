<script setup>
import { Html5Qrcode } from 'html5-qrcode'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const reader = ref(null)
const isScaning = ref(false)
const scanResult = ref('')
let html5Qrcode = null

function startScan() {
  isScaning.value = true

  Html5Qrcode.getCameras().then((devices) => {
    console.log('检测到摄像头:', devices)

    if (devices && devices.length) {
      // 自动选择后置摄像头
      let cameraId = devices[0].id
      const rearCamera = devices.find(device =>
        device.label.toLowerCase().includes('back')
        || device.label.includes('后置'),
      )
      if (rearCamera) {
        cameraId = rearCamera.id
      }

      html5Qrcode = new Html5Qrcode('reader')
      html5Qrcode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0, // 确保正方形预览
        },
        (decodeText) => {
          console.log('✅ 扫描成功:', decodeText)
          scanResult.value = decodeText
          stopScan()
        },
        (err) => {
          // 正常扫描过程中的错误，可以忽略
          console.log(err)
        },
      ).catch((error) => {
        console.error('❌ 摄像头启动失败:', error)
        isScaning.value = false
        // 可以在这里显示用户友好的错误信息
      })
    }
    else {
      console.error('❌ 未找到可用的摄像头')
      isScaning.value = false
    }
  }).catch((error) => {
    console.error('❌ 获取摄像头权限失败:', error)
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
  <div class=" bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 text-center">
          Vue 3 二维码扫描器
        </h2>

        <a-button @click="startScan">
          开始扫码
        </a-button>

        <div
          v-if="isScaning"
          id="reader"
          ref="reader"
          class="w-full h-100 border-2 border-gray-200 rounded-lg overflow-hidden"
        />

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
  </div>
</template>
