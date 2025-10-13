<script setup lang="ts">
const MenuFoldBtn = defineAsyncComponent(() => import('../MenuFoldBtn.vue'))
const Breadcrumb = defineAsyncComponent(() => import('./Breadcrumb.vue'))
const Setting = defineAsyncComponent(() => import('./Setting.vue'))
</script>

<template>
  <div class="header">
    <MenuFoldBtn />
    <a-row class="header-row">
      <a-col :xs="0" :md="10" :lg="10" :xl="12" :xxl="12">
        <Breadcrumb />
      </a-col>
      <a-col :xs="24" :md="14" :lg="14" :xl="12" :xxl="12">
        <a-row justify="end">
          <Setting />
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.header {
  @apply h-full flex justify-between items-center;
}
.header-row {
    @apply flex-1 flex items-center overflow-hidden;
}
</style>
