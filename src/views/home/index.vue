<script>
import QRScanner from './components/QRScanner.vue'

export default {
  name: 'App',
  components: {
    QRScanner,
  },
}
</script>

<template>
  <main class="app-main">
    <QRScanner />
  </main>
</template>

<style>
.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.app-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.app-main {
  flex: 1;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
}

.app-footer {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
