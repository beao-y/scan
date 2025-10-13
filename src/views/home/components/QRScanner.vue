<script setup>
import { Html5Qrcode } from 'html5-qrcode'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const reader = ref(null)
const isScaning = ref(false)
const scanResult = ref('')
let html5Qrcode = null

const devicesNum = ref(0)

const cameraIdRef = ref('')

function startScan() {
//   Html5Qrcode.getCameras().then((devices) => {
//     isScaning.value = true
//     console.log('检测到摄像头:', devices)

  //     if (devices && devices.length) {
  //       // 自动选择后置摄像头
  //       let cameraId = devices[0].id
  //       const rearCamera = devices.find(device =>
  //         device.label.toLowerCase().includes('back')
  //         || device.label.includes('后置'),
  //       )
  //       if (rearCamera) {
  //         cameraId = rearCamera.id
  //         cameraIdRef.value = rearCamera.id
  //       }

  //       html5Qrcode = new Html5Qrcode('reader')
  //       html5Qrcode.start(
  //         cameraId,
  //         {
  //           fps: 10,
  //           qrbox: { width: 250, height: 250 },
  //           aspectRatio: 1.0, // 确保正方形预览
  //         },
  //         (decodeText) => {
  //           console.log('✅ 扫描成功:', decodeText)
  //           scanResult.value = decodeText
  //           stopScan()
  //         },
  //         (err) => {
  //           // 正常扫描过程中的错误，可以忽略
  //           console.log(err)
  //         },
  //       ).catch((error) => {
  //         console.error('❌ 摄像头启动失败:', error)
  //         isScaning.value = false
  //         // 可以在这里显示用户友好的错误信息
  //       })
  //     }
  //     else {
  //       console.error('❌ 未找到可用的摄像头')
  //       isScaning.value = false
  //     }
  //   }).catch((error) => {
  //     console.error('❌ 获取摄像头权限失败:', error)
  //     isScaning.value = false
  //   })

  Html5Qrcode.getCameras().then((devices) => {
    console.log('找到摄像头:', devices.length, '个')

    devicesNum.value = devices.length
    html5Qrcode = new Html5Qrcode('reader')

    html5Qrcode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodeText) => {
        console.log('扫描成功:', decodeText)
        scanResult.value = decodeText
      },
      (err) => {
        console.log('扫描过程:', err)
      },
    ).then(() => {
      console.log('✅ 相机启动成功，应该显示画面了')
      // 检查 DOM 是否被更新
      const reader = document.getElementById('reader')
      ca
      console.log('reader 内部HTML:', reader.innerHTML)
      cameraIdRef.value = reader.innerHTML
    }).catch((error) => {
      console.error('❌ 相机启动失败:', error)
    })
  }).catch((error) => {
    console.error('❌ 获取摄像头权限失败:', error)
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
    <div class="w-full max-w-md">
      <div class="">
        <div class="scanner-card">
          <div class="scanner-icon">
            📱
          </div>
          <p>点击下方按钮开始扫描设备二维码</p>
          <a-button class="start-btn" @click="startScan">
            开始扫描
          </a-button>
        </div>

        <div v-if="isScaning && !scanResult" class="mt-6 text-center ">
          正在启动相机...
        </div>
        <div>{{ devicesNum }}个摄像头 {{ cameraIdRef }}</div>
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
      id="reader"
      ref="reader"
      class="w-full h-64 border-2 mt-4 border-gray-200 rounded-lg overflow-hidden bg-black"
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
