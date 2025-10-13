<script setup>
import { Html5QrcodeScanner } from 'html5-qrcode'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const reader = ref(null)
const scanResult = ref('')
let html5QrcodeScanner = null

function onScanSuccess(decodedText, decodedResult) {
  console.log(`扫描成功！结果: ${decodedText}`, decodedResult)
  scanResult.value = decodedText
  stopScan()
}

function onScanFailure(error) {
  // console.warn(`扫描失败: ${error}`);
}

function startScan() {
  if (reader.value) {
    html5QrcodeScanner = new Html5QrcodeScanner(
      reader.value.id,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false,
    )
    html5QrcodeScanner.render(onScanSuccess, onScanFailure)
  }
}

function stopScan() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch((error) => {
      console.error('停止扫描失败.', error)
    })
  }
}

onMounted(() => {
  startScan()
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

        <div
          id="reader"
          ref="reader"
          class="w-full border-2 border-gray-200 rounded-lg overflow-hidden"
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
