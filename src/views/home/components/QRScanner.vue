<script setup>
import { onBeforeUnmount, ref } from 'vue'

const isScanning = ref(false)
const scanResult = ref(null)
const scanMode = ref(null)
const error = ref(null)
const html5QrCode = ref(null)

// 真实扫描模式
async function startRealScan() {
  try {
    const { Html5Qrcode } = await import('https://unpkg.com/html5-qrcode@2.3.8/minified/html5-qrcode.min.js')

    html5QrCode.value = new Html5Qrcode('qr-reader')

    await html5QrCode.value.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        onScanSuccess(decodedText)
      },
      (errorMessage) => {
        console.log('Scan error:', errorMessage)
      },
    )

    isScanning.value = true
    scanMode.value = 'real'
    error.value = null
  }
  catch (err) {
    error.value = `无法启动摄像头: ${err.message}`
    scanResult.value = null
    console.error('Scanner start error:', err)
  }
}

async function stopScanner() {
  if (html5QrCode.value && scanMode.value === 'real') {
    try {
      await html5QrCode.value.stop()
      html5QrCode.value.clear()
    }
    catch (err) {
      console.error('Scanner stop error:', err)
    }
    html5QrCode.value = null
  }
  isScanning.value = false
  scanMode.value = null
}

function onScanSuccess(decodedText) {
  console.log('扫描结果:', decodedText)
  scanResult.value = decodedText
  stopScanner()
}

onBeforeUnmount(() => {
  if (html5QrCode.value) {
    stopScanner()
  }
})
</script>

<template>
  <div class="qr-scanner">
    <!-- 模式选择 -->
    <div class="mode-selection">
      <div class="mode-card">
        <h3>🔧 选择扫描模式</h3>
        <div class="mode-buttons">
          <button class="mode-btn real-mode" @click="startRealScan">
            <span class="mode-icon">📷</span>
            <span class="mode-text">真实扫描</span>
            <span class="mode-desc">使用摄像头扫描二维码</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 扫描结果 -->
    <div v-if="scanResult">
      {{ scanResult }}
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <div class="error-card">
        <div class="error-icon">
          ⚠️
        </div>
        <h3>扫描错误</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="error = null">
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-scanner {
  width: 100%;
  max-width: 800px;
}

/* 模式选择样式 */
.mode-selection {
  margin-bottom: 2rem;
}

.mode-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.mode-card h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.mode-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.mode-btn {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.mode-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.mode-btn.real-mode:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.mode-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.mode-text {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.mode-desc {
  display: block;
  font-size: 0.9rem;
  color: #666;
}
</style>
