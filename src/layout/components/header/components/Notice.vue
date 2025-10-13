<script setup lang="ts">
const activeKey = ref('1')
</script>

<template>
  <div>
    <a-tabs v-model:active-key="activeKey">
      <a-tab-pane key="1" tab="通知(10)" />
      <a-tab-pane key="2" tab="消息(0)" />
      <a-tab-pane key="3" tab="待办(0)" />
    </a-tabs>

    <div>content</div>
  </div>
</template>

<style scoped>

</style>
